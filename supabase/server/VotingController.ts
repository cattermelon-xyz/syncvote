import { Discourse } from './Discourse.ts';
import { DocInput } from './DocInput.ts';
import { Pooling } from './Pooling.ts';
import { Realms } from './Realms.ts';
import { SingleVote } from './SingleVote.ts';
import { Snapshot } from './Snapshot.ts';
import { Tally } from './Tally.ts';
import { UpVote } from './UpVote.ts';
import { Veto } from './Veto.ts';

export class VoteMachineController {
  votingTypes: any;
  vote_machine_type: any;
  id: any;
  constructor(props: any) {
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
      throw new Error();
      // `Invalid voting machine type: ${checkpointData.vote_machine_type}`
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
      throw new Error();
      // `Invalid voting machine type: ${checkpointData.vote_machine_type}`
    }
  }

  shouldTally() {
    if (this.votingTypes[this.vote_machine_type]) {
      return this.votingTypes[this.vote_machine_type].shouldTally();
    } else {
      throw new Error();
      // `Invalid voting machine type: ${checkpointData.vote_machine_type}`
    }
  }
}
