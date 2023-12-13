const { VotingMachine } = require('.');
const { DISCOURSE_ACTION } = require('../../configs/constants');

class Discourse extends VotingMachine {
  constructor(props) {
    super(props);
  }

  recordVote(voteData) {
    // check recordVote of VotingMachine class
    const { notRecorded, error } = super.recordVote(voteData);
    if (notRecorded) {
      return { notRecorded, error };
    }

    // check if option not is a single vote
    if (!voteData.submission.action) {
      return {
        notRecorded: true,
        error: 'Missing action with discourse forum',
      };
    }

    // handle with action: create-topic
    if (voteData.submission.action === DISCOURSE_ACTION.CREATE_TOPIC) {
      if (!voteData.submission.title) {
        return { notRecorded: true, error: 'Missing title to create topic' };
      }

      if (!voteData.submission.raw) {
        return {
          notRecorded: true,
          error: 'Missing description of proposal to create topic',
        };
      }

      if (!voteData.submission.org_id) {
        return { notRecorded: true, error: 'Missing org_id to query API key' };
      }

      if (!voteData.submission.variables) {
        return {
          notRecorded: true,
          error: 'Missing variable to store topic_id',
        };
      }
    }

    this.who = [voteData.identify];
    return {};
  }

  tally() {
    this.options.map((option, index) => {
      if (option === this.tallyResult[0]) {
        return {
          who: this.who,
          result: this.result,
          tallyResult: this.tallyResult,
          index,
        };
      }
    });
  }
}

module.exports = {
  Discourse,
};
