const { VotingMachine } = require('.');

class Tally extends VotingMachine {
  constructor(props) {
    super(props);
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

    if (!checkpoint?.data?.proposalId) {
      isValid = false;
      message.push('Missing variable proposalId');
    }

    if (!checkpoint?.data?.governor || !checkpoint?.data?.token) {
      isValid = false;
      message.push('Missing governor or token contract');
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

    // check if dont have action
    if (!voteData.submission) {
      return {
        notRecorded: true,
        error: 'Snapshot: Missing submission',
      };
    } else {
      if (!voteData.submission.proposalId) {
        return {
          notRecorded: true,
          error: 'Snapshot: Missing proposalId',
        };
      }
    }

    this.who = [voteData.identify];
    this.tallyResult = {
      ...voteData.submission,
      index: this.children.indexOf(this.data.next),
    };

    await supabase
      .from('variables')
      .insert({
        name: this.data.proposalId,
        value: voteData.submission.proposalId,
        mission_id: this.mission_id,
      })
      .select('*');

    return {};
  }

  shouldTally() {
    return {
      shouldTally: true,
      tallyResult: this.tallyResult,
    };
  }
}

module.exports = {
  Tally,
};
