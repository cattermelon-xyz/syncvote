const moment = require('moment');

class VotingMachine {
  constructor(props) {
    const { name, options, duration } = props;
    this.name = name;
    this.options = options;
    this.duration = duration;
  }

  fallBack(data) {
    // check if this checkpoint is outdate
    const createdAtMoment = moment(data.cvd_created_at);
    const now = moment();
    const differenceInMilliseconds = now.diff(createdAtMoment);

    if (differenceInMilliseconds >= data.duration) {
      return 'This checkpoint is stopped';
    }

    return null;
  }

  recordVote(data, voteData) {
    // check if user's choice is wrong
    
  }
}

module.exports = {
  VotingMachine,
};
