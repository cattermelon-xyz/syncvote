const { VotingMachine } = require('.');
const { DISCOURSE_ACTION } = require('../../configs/constants');
const { supabase } = require('../../configs/supabaseClient');
const { createPost, updateTopic } = require('../../services/PostService');
const { createTopic, moveTopic } = require('../../services/TopicService');

class Discourse extends VotingMachine {
  constructor(props) {
    super(props);
    const { org_id } = props;
    this.org_id = org_id;
  }

  validate(checkpoint) {
    let isValid = true;
    const message = [];

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

    if (
      checkpoint?.data?.action !== DISCOURSE_ACTION.CREATE_TOPIC &&
      checkpoint?.data?.action !== DISCOURSE_ACTION.CREATE_POST &&
      checkpoint?.data?.action !== DISCOURSE_ACTION.UPDATE_TOPIC &&
      checkpoint?.data?.action !== DISCOURSE_ACTION.MOVE_TOPIC
    ) {
      isValid = false;
      message.push('Wrong or missing action');
    }

    return {
      isValid,
      message,
    };
  }

  async recordVote(voteData) {
    // check recordVote of VotingMachine class
    const { notRecorded, error } = super.recordVote(voteData);
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
      if (!voteData.submission.title) {
        return { notRecorded: true, error: 'Missing title to create topic' };
      }

      if (!voteData.submission.raw) {
        return {
          notRecorded: true,
          error: 'Missing description of proposal to create topic',
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

      this.tallyResult = {
        index: this.children.indexOf(this.data.next) || 0,
        submission: {
          firstPostId: data?.firstPostId,
          linkDiscourse: data?.linkDiscourse,
          [this.data.variables[0]]: data?.topicId,
        },
      };

      // update variables
      const { data: variables } = await supabase
        .from('variables')
        .insert({
          name: this.data.variables[0],
          value: data?.topicId,
          mission_id: this.mission_id,
        })
        .select('*');

      await supabase.from('variables').insert({
        name: 'firstPostId',
        value: data?.firstPostId,
        mission_id: this.mission_id,
        parent: variables[0].id,
      });
    } else if (this.data.action === DISCOURSE_ACTION.CREATE_POST) {
      if (!voteData.submission.raw) {
        return {
          notRecorded: true,
          error: 'Missing description of proposal to create post',
        };
      }

      const { data: variables, error } = await supabase
        .from('variables')
        .select('*')
        .eq('name', this.data.variables[0])
        .eq('mission_id', this.mission_id);

      if (error) {
        return {
          notRecorded: true,
          error: 'Cannot get value of topicId',
        };
      } else {
        const { data, error: error_create_post } = await createPost({
          raw: voteData.submission.raw,
          org_id: this.org_id,
          topic_id: Number(variables[0].value),
        });

        if (error_create_post) {
          console.log('CreatePostError');
          return {
            notRecorded: true,
            error: 'Error when create post',
          };
        }

        this.tallyResult = {
          index: this.children.indexOf(this.data.next) || 0,
          submission: {
            linkDiscourse: data?.linkDiscourse,
            [this.data.variables[0]]: data?.topicId,
          },
        };
      }
    } else if (this.data.action === DISCOURSE_ACTION.MOVE_TOPIC) {
      if (!voteData.submission.categoryId) {
        return {
          notRecorded: true,
          error: 'Missing categoryId to move topic',
        };
      }

      const { data: variables, error } = await supabase
        .from('variables')
        .select('*')
        .eq('name', this.data.variables[0])
        .eq('mission_id', this.mission_id);

      if (error) {
        return {
          notRecorded: true,
          error: 'Cannot get value of topicId',
        };
      } else {
        const { data, error: error_move_topic } = await moveTopic({
          topic_id: variables[0].value,
          org_id: this.org_id,
          category_id: voteData.submission.categoryId,
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

      if (!voteData.submission.edit_reason) {
        return {
          notRecorded: true,
          error: 'Missing edit_reason to update topic',
        };
      }
      const { data: variables, error } = await supabase
        .from('variables')
        .select('*')
        .eq('name', this.data.variables[0])
        .eq('mission_id', this.mission_id);

      if (error) {
        return {
          notRecorded: true,
          error: 'Cannot get value of topicId',
        };
      } else {
        const { data: firstPostId, error } = await supabase
          .from('variables')
          .select('*')
          .eq('name', 'firstPostId')
          .eq('parent', variables[0].id);

        if (error) {
          return {
            notRecorded: true,
            error: 'Cannot get value of firstTopicId',
          };
        }

        const { data, error: error_update_topic } = await updateTopic({
          raw: voteData.submission.raw,
          org_id: this.org_id,
          edit_reason: voteData.submission.edit_reason,
          firstPostId: firstPostId[0].id,
        });

        if (error_update_topic) {
          console.log('UpdateTopicError');
          return {
            notRecorded: true,
            error: 'Error when update topic',
          };
        }

        this.tallyResult = {
          index: this.children.indexOf(this.data.next) || 0,
          submission: {
            [this.data.variables[0]]: data?.topicId,
          },
        };
      }
    }

    this.who = [voteData.identify];
    this.result = [voteData.submission];

    return {};
  }

  shouldTally() {
    if (this.data.action === DISCOURSE_ACTION.CREATE_TOPIC) {
      return { shouldTally: true, tallyResult: this.tallyResult };
    } else if (this.data.action === DISCOURSE_ACTION.CREATE_POST) {
      return { shouldTally: true, tallyResult: this.tallyResult };
    } else if (this.data.action === DISCOURSE_ACTION.MOVE_TOPIC) {
      return { shouldTally: true, tallyResult: this.tallyResult };
    } else if (this.data.action === DISCOURSE_ACTION.UPDATE_TOPIC) {
      return { shouldTally: true, tallyResult: this.tallyResult };
    }

    return {};
  }
}

module.exports = {
  Discourse,
};
