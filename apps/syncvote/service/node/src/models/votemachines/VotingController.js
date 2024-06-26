const { Pooling } = require('./Pooling');
const { Veto } = require('./Veto');
const { UpVote } = require('./Upvote');
const { SingleVote } = require('./SingleVote');
const { DocInput } = require('./DocInput');
const { Discourse } = require('./Discourse');
const { Snapshot } = require('./Snapshot');
const { Tally } = require('./Tally');
const { Realms } = require('./Realms');


class VoteMachineController {
  constructor(props) {
    this.votingTypes = {
      pooling: new Pooling(props),
      Veto: new Veto(props),
      UpVote: new UpVote(props),
      SingleChoiceRaceToMax: new SingleVote(props),
      DocInput: new DocInput(props),
      Discourse: new Discourse(props),
      Snapshot: new Snapshot(props),
      Tally: new Tally(props),
      Realms: new Realms(props),
    };
    this.vote_machine_type = props.vote_machine_type;
    this.id = props.id;
  }

  initDataForCVD() {
    if (this.votingTypes[this.vote_machine_type]) {
      return this.votingTypes[this.vote_machine_type].initDataForCVD();
    } else {
      console.log('Debug initDataForCVD', this.vote_machine_type, this.id);
      throw new Error(`Invalid data`);
    }
  }

  fallBack() {
    if (this.votingTypes[this.vote_machine_type]) {
      return this.votingTypes[this.vote_machine_type].fallBack();
    } else {
      console.log('Debug fallBack', this.vote_machine_type, this.id);
      throw new Error(`Invalid data`);
    }
  }

  async recordVote(voteData) {
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
