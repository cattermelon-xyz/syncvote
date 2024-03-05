import { VotingMachine } from './index.ts';
import { upsertVariable } from '../integration/database/variables.ts';

export class DocInput extends VotingMachine {
  options: any;
  constructor(props: any) {
    super(props);
    this.options = this.options;
  }

  validate(checkpoint: any) {
    let isValid = true;
    const message: string[] = [];
    if (!checkpoint?.children || checkpoint.children.length === 0) {
      isValid = false;
      message.push('Missing options');
    }
    return {
      isValid,
      message,
    };
  }

  async recordVote(voteData: any) {
    // check recordVote of VotingMachine class
    const { notRecorded, error } = await super.recordVote(voteData);
    if (notRecorded) {
      return { notRecorded, error };
    }

    // check if option not is a single vote
    if (voteData.option.length !== 1) {
      return { notRecorded: true, error: 'You need to pick one' };
    }
    const variableValues = voteData.submission || {};
    const variables = this.data.variables || [];
    for (let i = 0; i < variables.length; i++) {
      const v = variables[i];
      if (variableValues[v]) {
        const variableStored = await upsertVariable(this, v, variableValues[v]);
      }
    }
    // // check if contain enough submit
    // if (this.docs.length !== voteData.submission.length) {
    //   return { notRecorded: true, error: 'Your doc required is not enough' };
    // }

    this.who = [voteData.identify];
    this.result = voteData.submission;
    this.tallyResult = {
      index: voteData.option[0],
      submission: voteData.submission,
    };
    return {};
  }

  tally() {
    this.options.map((option: any, index: number) => {
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

  shouldTally() {
    return { shouldTally: true, tallyResult: this.tallyResult };
  }
}
