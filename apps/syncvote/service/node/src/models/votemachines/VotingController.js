const { Pooling } = require('./Pooling');
const { Veto } = require('./Veto');
const { UpVote } = require('./Upvote');
const { SingleVote } = require('./SingleVote');
const { DocInput } = require('./DocInput');

class VoteMachineController {
  constructor(props) {
    this.votingTypes = {
      pooling: new Pooling(props),
      Veto: new Veto(props),
      UpVote: new UpVote(props),
      SingleChoiceRaceToMax: new SingleVote(props),
      DocInput: new DocInput(props),
    };
    this.vote_machine_type = props.vote_machine_type;
  }

  initDataForCVD() {
    if (this.votingTypes[this.vote_machine_type]) {
      return this.votingTypes[this.vote_machine_type].initDataForCVD();
    } else {
      throw new Error(`Invalid data`);
    }
  }

  fallBack() {
    if (this.votingTypes[this.vote_machine_type]) {
      return this.votingTypes[this.vote_machine_type].fallBack();
    } else {
      throw new Error(`Invalid data`);
    }
  }

  recordVote(voteData) {
    if (this.votingTypes[this.vote_machine_type]) {
      return this.votingTypes[this.vote_machine_type].recordVote(voteData);
    } else {
      throw new Error(
        `Invalid voting machine type: ${checkpointData.vote_machine_type}`
      );
    }
  }

  getResult() {
    if (this.votingTypes[this.vote_machine_type]) {
      if (this.vote_machine_type === 'DocInput') {
        return {
          who: this.votingTypes[this.vote_machine_type].who,
          result: this.votingTypes[this.vote_machine_type].result,
          tallyResult: this.votingTypes[this.vote_machine_type].tallyResult,
        };
      }
      return {
        who: this.votingTypes[this.vote_machine_type].who,
        result: this.votingTypes[this.vote_machine_type].result,
      };
    } else {
      throw new Error(
        `Invalid voting machine type: ${checkpointData.vote_machine_type}`
      );
    }
  }

  shouldTally() {
    if (this.votingTypes[this.vote_machine_type]) {
      return this.votingTypes[this.vote_machine_type].shouldTally();
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
