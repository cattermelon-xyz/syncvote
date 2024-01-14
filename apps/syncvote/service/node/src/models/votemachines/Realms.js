const { VotingMachine } = require('.');
const { supabase } = require('../../configs/supabaseClient');

class Realms extends VotingMachine {
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

    if (!checkpoint?.data.fallback || !checkpoint.data.next) {
      isValid = false;
      message.push('Missing fallback or next checkpoint');
    }

    if (!checkpoint?.data.realms) {
      isValid = false;
      message.push('Missing realms address');
    }

    if (!checkpoint?.data.governance_program) {
      isValid = false;
      message.push('Missing governance_program address');
    }

    if (!checkpoint?.data.proposalId) {
      isValid = false;
      message.push('Missing variable to store proposal ID');
    }

    if (!checkpoint?.data.proposal_mint) {
      isValid = false;
      message.push('Missing proposal mint address');
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
      proposalLink: `https://app.realms.today/dao/${this.data.realms}/proposal/${voteData.submission.proposalId}?cluster=devnet`,
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
  Realms,
};
