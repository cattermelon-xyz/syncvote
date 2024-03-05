import { VotingMachine } from './index.ts';
import { createArweave } from '../functions/index.ts';
import {
  upsertVariable,
  selectVariable,
} from '../integration/database/variables.ts';
import { supabase } from '../configs/supabaseClient.ts';
import axios from 'npm:axios@^1.5.0';

export class Discourse extends VotingMachine {
  org_id: any;

  constructor(props: any) {
    super(props);
    const { org_id } = props;
    this.org_id = org_id;
  }

  validate(checkpoint: any) {
    let isValid = true;
    const message: any[] = [];

    if (!checkpoint?.children || checkpoint.children.length === 0) {
      isValid = false;
      message.push('Missing options');
    }

    if (!checkpoint?.data?.fallback || !checkpoint?.data?.next) {
      isValid = false;
      message.push('Missing fallback and next checkpoint');
    }

    if (!checkpoint?.data?.variables) {
      isValid = false;
      message.push('Missing variable to store data');
    }

    if (!isValidAction(DISCOURSE_ACTION, checkpoint?.data?.action)) {
      isValid = false;
      message.push('Wrong or missing action');
    }

    // check if move topic missing categoryId
    if (checkpoint?.data.action === DISCOURSE_ACTION.MOVE_TOPIC) {
      if (!checkpoint?.data?.categoryId) {
        isValid = false;
        message.push('Missing categoryId in move topic checkpoint');
      }
    }

    return {
      isValid,
      message,
    };
  }

  async recordVote(voteData: any) {
    // check recordVote of VotingMachine class
    const { notRecorded, error } = await super.recordVote(voteData);
    if (notRecorded) {
      return { notRecorded, error };
    }

    // check if option not is a single vote
    if (!voteData.submission) {
      return {
        notRecorded: true,
        error: 'Missing submission',
      };
    }

    // handle with action: create-topic
    if (this.data.action === DISCOURSE_ACTION.CREATE_TOPIC) {
      if (!voteData.submission.title || !voteData.submission.raw) {
        return {
          notRecorded: true,
          error: 'Missing title or description to create topic',
        };
      }

      const { data, error: error_create_topic } = await createTopic({
        ...voteData.submission,
        org_id: this.org_id,
      });
      if (error_create_topic) {
        console.log('CreateTopicError', error_create_topic);
        return {
          notRecorded: true,
          error: 'Error when create topic',
        };
      }
      const dataToStore = data?.topicId + ',' + data?.firstPostId;
      // store id of topic and firstPostId
      const variableStored = await upsertVariable(
        this,
        this.data.variables[0],
        dataToStore
      );
      // store description of topic
      console.log('this.data.variables[1]: ', this.data.variables[1]);
      if (this.data.variables[1]) {
        const { arweave_id, error } = await createArweave({
          title: voteData.submission.title,
          raw: voteData.submission.raw,
        });
        if (arweave_id) {
          const variableStored = await upsertVariable(
            this,
            this.data.variables[1],
            arweave_id
          );
          // TODO: handle error
        }
      }
      if (!variableStored) {
        return {
          notRecorded: true,
          error: 'Error when store variables',
        };
      }
      this.tallyResult = {
        index: this.children.indexOf(this.data.next) || 0,
        submission: {
          firstPostId: data?.firstPostId,
          linkDiscourse: data?.linkDiscourse,
          [this.data.variables[0]]: dataToStore,
        },
      };
    } else if (this.data.action === DISCOURSE_ACTION.MOVE_TOPIC) {
      const variables = await selectVariable(this, this.data.variables[0]);
      if (!variables) {
        return {
          notRecorded: true,
          error: 'Cannot get value of topicId',
        };
      } else {
        // console.log('root_mission_id', this.m_parent);
        // console.log(this.data.variables[0], variables);
        const topicId = variables?.split(',')[0];
        console.log(topicId, this.org_id, this.data.categoryId);
        const { data, error: error_move_topic } = await moveTopic({
          topic_id: Number(topicId),
          org_id: this.org_id,
          category_id: this.data.categoryId,
        });
        if (error_move_topic) {
          console.log('MoveTopicError');
          return {
            notRecorded: true,
            error: 'Error when move topic',
          };
        }
        this.tallyResult = {
          index: this.children.indexOf(this.data.next) || 0,
          submission: {
            [this.data.variables[0]]: data?.topicId,
          },
        };
      }
    } else if (this.data.action === DISCOURSE_ACTION.UPDATE_TOPIC) {
      if (!voteData.submission.raw) {
        return {
          notRecorded: true,
          error: 'Missing raw to update topic',
        };
      }
      const variables = await selectVariable(this, this.data.variables[0]);

      if (!variables) {
        return {
          notRecorded: true,
          error: 'Cannot get value of topicId',
        };
      } else {
        // console.log('variables: ', variables);
        const postId = variables?.split(',')[1];
        if (!postId) {
          return {
            notRecorded: true,
            error: 'Cannot get value of firstTopicId',
          };
        }

        const { error: error_update_topic } = await updateTopic({
          raw: voteData.submission.raw,
          org_id: this.org_id,
          edit_reason: voteData.submission.edit_reason || 'Not specified',
          firstPostId: Number(postId),
        });

        if (this.data.variables[1]) {
          const { arweave_id, error } = await createArweave({
            raw: voteData.submission.raw,
          });
          if (arweave_id) {
            const variableStored = await upsertVariable(
              this,
              this.data.variables[1],
              arweave_id
            );
            // TODO: handle error
          }
        }

        if (error_update_topic) {
          console.log('UpdateTopicError ', error_update_topic);
          return {
            notRecorded: true,
            error: 'Error when update topic',
          };
        }

        this.tallyResult = {
          index: this.children.indexOf(this.data.next) || 0,
          submission: {
            [this.data.variables[0]]: Number(postId),
          },
        };
      }
    } else if (this.data.action === DISCOURSE_ACTION.CREATE_POST) {
      if (!voteData.submission.raw) {
        return {
          notRecorded: true,
          error: 'Missing description of proposal to create post',
        };
      }
      const variable = await selectVariable(this, this.data.variables[0]);

      if (!variable) {
        return {
          notRecorded: true,
          error: 'Cannot get value of topicId',
        };
      } else {
        const topicId = variable.split(',')[0];
        const { data, error: error_create_post } = await createPost({
          raw: voteData.submission.raw,
          org_id: this.org_id,
          topic_id: Number(topicId),
        });

        if (this.data.variables[1]) {
          const { arweave_id, error } = await createArweave({
            raw: voteData.submission.raw,
          });
          if (arweave_id) {
            const variableStored = await upsertVariable(
              this,
              this.data.variables[1],
              arweave_id
            );
            // TODO: handle error
          }
        }

        if (error_create_post) {
          console.log('CreatePostError ', error_create_post);
          return {
            notRecorded: true,
            error: 'Error when create post',
          };
        }

        this.tallyResult = {
          index: this.children.indexOf(this.data.next) || 0,
          submission: {
            linkDiscourse: data?.linkDiscourse,
          },
        };
      }
    }

    this.who = [voteData.identify];
    this.result = [voteData.submission];

    return {};
  }

  shouldTally() {
    if (isValidAction(DISCOURSE_ACTION, this.data.action)) {
      return { shouldTally: true, tallyResult: this.tallyResult };
    }

    return {};
  }
}

const DISCOURSE_ACTION = {
  CREATE_TOPIC: 'create-topic', //Create topic
  CREATE_POST: 'create-post', //Create post into topic
  UPDATE_TOPIC: 'update-topic', //Update first post of topic
  MOVE_TOPIC: 'move-topic', //Move Topic
};

export function isValidAction(type_action: any, action: any) {
  return Object.values(type_action).includes(action);
}

const createTopic = async (props: any) => {
  try {
    if (!props.title || !props.raw || !props.org_id) {
      throw new Error('Title, content, and org_id are all required!');
    }

    const { data, error } = await supabase
      .from('web2_key')
      .select('*')
      .eq('org_id', props.org_id);

    if (error || data.length === 0) {
      throw new Error(error || 'No Discourse configuration found.');
    }

    const filteredDiscourse = data.filter(
      (integration) => integration.provider === 'discourse'
    );
    const discourseConfig = filteredDiscourse[0];

    const discourseData = {
      title: props.title,
      raw: props.raw,
      category: discourseConfig.category_id,
    };

    // Make API call to Discourse
    const response = await axios.post(
      discourseConfig.id_string.includes('https')
        ? `${discourseConfig.id_string}/posts`
        : `https://${discourseConfig.id_string}/posts`,
      discourseData,
      {
        headers: {
          'Api-Key': discourseConfig.access_token,
          'Api-Username': discourseConfig.username,
        },
      }
    );

    const firstPostId = response?.data?.id;
    const topicId = response?.data?.topic_id;
    const linkDiscourse = `${discourseConfig.id_string}/t/${topicId}`;

    const dataAfterCreate = {
      firstPostId,
      topicId,
      linkDiscourse,
    };

    return { data: dataAfterCreate };
  } catch (e) {
    console.error('Error creating topic:', e.data);
    return { error: e };
  }
};

const moveTopic = async (props: any) => {
  if (!props.topic_id || !props.org_id || !props.category_id) {
    throw new Error('Topic_id, category_id and org_id are all required!');
  }

  try {
    const { data, error } = await supabase
      .from('web2_key')
      .select('*')
      .eq('org_id', props.org_id);

    if (error || data.length === 0) {
      throw new Error(error || 'No Discourse configuration found.');
    }

    const filteredDiscourse = data.filter(
      (integration) => integration.provider === 'discourse'
    );
    const discourseConfig = filteredDiscourse[0];
    discourseConfig.id_string = discourseConfig.id_string.includes('https')
      ? discourseConfig.id_string
      : 'https://' + discourseConfig.id_string;

    const url = `${discourseConfig.id_string}/t/-/${props.topic_id}.json`;

    const payload = {
      category_id: props.category_id,
    };

    const response = await axios.put(url, payload, {
      headers: {
        'Api-Key': discourseConfig.access_token,
        'Api-Username': discourseConfig.username,
      },
    });

    return response.data;
  } catch (e) {
    console.error('Error get post:', e);
    throw e;
  }
};

const updateTopic = async (props: any) => {
  try {
    if (
      !props.raw ||
      !props.org_id ||
      !props.edit_reason ||
      !props.firstPostId
    ) {
      throw new Error('Topic id, content, and OrgId are all required!');
    }
    const { data, error } = await supabase
      .from('web2_key')
      .select('*')
      .eq('org_id', props.org_id);

    if (error || data.length === 0) {
      throw new Error(error || 'No Discourse configuration found.');
    }
    const filteredDiscourse = data.filter(
      (integration) => integration.provider === 'discourse'
    );
    const discourseConfig = filteredDiscourse[0];
    discourseConfig.id_string = discourseConfig.id_string.includes('https')
      ? discourseConfig.id_string
      : 'https://' + discourseConfig.id_string;
    const url = discourseConfig.id_string + `/posts/${props.firstPostId}.json`;

    const payload = {
      post: { raw: props.raw, edit_reason: props.edit_reason },
    };
    const response = await axios.put(url, payload, {
      headers: {
        'Api-Key': discourseConfig.access_token,
        'Api-Username': discourseConfig.username,
      },
    });
    return { data: response.data };
  } catch (e) {
    return { error: e };
  }
};

const createPost = async (props: any) => {
  try {
    if (!props.topic_id || !props.raw || !props.org_id) {
      throw new Error('Topic id, content, and OrgId are all required!');
    }
    const { data, error } = await supabase
      .from('web2_key')
      .select('*')
      .eq('org_id', props.org_id);

    if (error || data.length === 0) {
      throw new Error(error || 'No Discourse configuration found.');
    }

    const filteredDiscourse = data.filter(
      (integration) => integration.provider === 'discourse'
    );
    const discourseConfig = filteredDiscourse[0];
    discourseConfig.id_string = discourseConfig.id_string.includes('https')
      ? discourseConfig.id_string
      : 'https://' + discourseConfig.id_string;
    const payload = {
      raw: props.raw,
      topic_id: props.topic_id,
    };

    // Make API call to Discourse
    const response = await axios.post(
      `${discourseConfig.id_string}/posts`,
      payload,
      {
        headers: {
          'Api-Key': discourseConfig.access_token,
          'Api-Username': discourseConfig.username,
        },
      }
    );
    const linkDiscourse = `${discourseConfig.id_string}/p/${response.data.id}`;

    return { data: { ...response.data, linkDiscourse: linkDiscourse } };
  } catch (e) {
    console.error('Error creating post:', e.data);
    return { error: e };
  }
};
