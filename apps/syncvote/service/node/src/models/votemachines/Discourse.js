const { VotingMachine } = require('.');
const { DISCOURSE_ACTION, isValidAction } = require('../../configs/constants');
const { supabase } = require('../../configs/supabaseClient');
const { createPost, updateTopic } = require('../../services/PostService');
const { createTopic, moveTopic } = require('../../services/TopicService');
const { upsertVariable, selectVariable } = require('../../functions');
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
      const variableStored = await upsertVariable(
        this,
        this.data.variables[0],
        dataToStore
      );
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

module.exports = {
  Discourse,
};
