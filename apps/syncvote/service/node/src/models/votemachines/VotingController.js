const { Pooling } = require('./Pooling');
const { Veto } = require('./Veto');
const { Upvote } = require('./Upvote');
const { SingleVote } = require('./SingleVote');

class VoteMachineController {
  constructor(props) {
    this.votingTypes = {
      pooling: new Pooling(props),
      veto: new Veto(props),
      upvote: new Upvote(props),
      SingleChoiceRaceToMax: new SingleVote(props),
    };
  }

  fallBack(checkpointData) {
    if (this.votingTypes[checkpointData.vote_machine_type]) {
      return this.votingTypes[checkpointData.vote_machine_type].fallBack(
        checkpointData
      );
    } else {
      throw new Error(`Invalid data`);
    }
  }

  recordVote(checkpointData, voteData) {
    if (this.votingTypes[checkpointData.vote_machine_type]) {
      return this.votingTypes[checkpointData.vote_machine_type].recordVote(
        checkpointData,
        voteData
      );
    } else {
      throw new Error(
        `Invalid voting machine type: ${checkpointData.vote_machine_type}`
      );
    }
  }
}

module.exports = {
  VoteMachineController,
};
