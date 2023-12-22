const { VotingMachine } = require('.');
const { DISCOURSE_ACTION } = require('../../configs/constants');
const { supabase } = require('../../configs/supabaseClient');
const { createPost } = require('../../services/PostService');
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

      if (!voteData.submission.variable) {
        return {
          notRecorded: true,
          error: 'Missing variable to store topic_id',
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
          [voteData.submission.variable]: data?.topicId,
        },
      };

      // update variables
      await supabase.from('variables').insert({
        name: voteData.submission.variable,
        value: data?.topicId,
        mission_id: this.mission_id,
      });
    } else if (this.data.action === DISCOURSE_ACTION.CREATE_POST) {
      if (!voteData.submission.raw) {
        return {
          notRecorded: true,
          error: 'Missing description of proposal to create post',
        };
      }

      if (!voteData.submission.variable) {
        return {
          notRecorded: true,
          error: 'Missing variable to take topic_id',
        };
      }

      const { data: variables, error } = await supabase
        .from('variables')
        .select('*')
        .eq('name', voteData.submission.variable)
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
            [voteData.submission.variable]: data?.topicId,
          },
        };
      }
    } else if (this.data.action === DISCOURSE_ACTION.MOVE_TOPIC) {
      if (!voteData.submission.variable) {
        return {
          notRecorded: true,
          error: 'Missing variable to get value of topic_id',
        };
      }

      if (!voteData.submission.categoryId) {
        return {
          notRecorded: true,
          error: 'Missing categoryId to move topic',
        };
      }

      const { data: variables, error } = await supabase
        .from('variables')
        .select('*')
        .eq('name', voteData.submission.variable)
        .eq('mission_id', this.mission_id);

      if (error) {
        return {
          notRecorded: true,
          error: 'Cannot get value of topicId',
        };
      } else {
        const { data, error: error_update_topic } = await moveTopic({
          topic_id: variables[0].value,
          org_id: this.org_id,
          category_id: voteData.submission.categoryId,
        });

        if (error_update_topic) {
          console.log('MoveTopicError');
          return {
            notRecorded: true,
            error: 'Error when move topic',
          };
        }

        this.tallyResult = {
          index: this.children.indexOf(this.data.next) || 0,
          submission: {
            [voteData.submission.variable]: data?.topicId,
          },
        };
      }
    } else if (this.data.action === DISCOURSE_ACTION.UPDATE_TOPIC) {
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
    }

    return {};
  }
}

module.exports = {
  Discourse,
};
