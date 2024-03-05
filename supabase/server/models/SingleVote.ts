import { VotingMachine } from './index.ts';

export class SingleVote extends VotingMachine {
  thresholds: any;
  includedAbstain: any;
  quorum: any;
  options: any;
  static validate: any;
  constructor(props: any) {
    super(props);
    const { thresholds, includedAbstain, quorum, options } = props;
    this.thresholds = thresholds;
    this.includedAbstain = includedAbstain;
    this.quorum = quorum;
    this.options = options;
  }

  validate(checkpoint: any) {
    let isValid = true;
    const message: string[] = [];
    if (!checkpoint?.children || checkpoint.children.length === 0) {
      isValid = false;
      message.push('Missing options');
    }

    if (!checkpoint?.data.max) {
      isValid = false;
      message.push('Missing number of vote need to win');
    }

    if (!checkpoint?.quorum) {
      isValid = false;
      message.push('Missing quorum');
    }

    return {
      isValid,
      message,
    };
  }

  initDataForCVD() {
    const options = this.options;
    if (options.length === 0) {
      return {
        initData: false,
        error: 'Cannot init data because options is empty',
      };
    }
    let result = {};
    options.map((_, index) => {
      result[index] = {
        count: 0,
      };
    });

    if (this.includedAbstain) {
      result['-1'] = {
        count: 0,
      };
    }

    return {
      initData: true,
      result: result,
    };
  }

  fallBack() {
    // check fallback of VotingMachine class
    const { fallback, error } = super.fallBack();
    if (fallback) {
      return { fallback, error };
    }

    // Are there enough conditions for tally?
    const { shouldTally } = this.shouldTally();
    if (shouldTally) {
      return { fallback: true, error: 'This checkpoint should tally' };
    }

    return {};
  }

  async recordVote(voteData: any) {
    // check recordVote of VotingMachine class
    const { notRecorded, error } = await super.recordVote(voteData);

    if (notRecorded) {
      return { notRecorded, error };
    }

    if (!voteData.option) {
    }

    // check if user's choice is wrong
    for (const option of voteData.option) {
      if (option > this.options.length - 1) {
        return { notRecorded: true, error: `Invalid choice` };
      }
    }

    // check if options is single vote
    if (voteData.option.length !== 1) {
      return { notRecorded: true, error: 'You need to pick one' };
    }

    // check if user is already vote
    if (this.who !== null && this.who.includes(voteData.identify)) {
      return { notRecorded: true, error: 'User is already voted' };
    }

    // check if abstain, dont increase the result, abstain send option [-1]'
    if (!this.includedAbstain && voteData.option[0] === -1) {
      return { notRecorded: true, error: 'Cannot vote abstain option' };
    }

    if (!this.who || this.who.length === 0) {
      this.who = [voteData.identify];
    } else {
      this.who = this.who.concat(voteData.identify);
    }

    if (this.participation.type === 'identity') {
      this.result[voteData.option[0]].count += 1;
    } else {
      // Dont have vote by token
    }

    return {};
  }

  shouldTally() {
    super.shouldTally();

    if (this.who && this.who.length !== 0) {
      // check if the number of voter is bigger than quorum
      let thresholdsNumber = 0;

      // check if thesholes is percentage
      if (this.thresholds > 1) {
        thresholdsNumber = this.thresholds;
      } else {
        if (this.thresholds * this.quorum <= this.who.length) {
          thresholdsNumber = this.thresholds * this.who.length;
        } else {
          thresholdsNumber = this.thresholds * this.quorum;
        }
      }
      for (let index in this.options) {
        if (this.result[index].count >= thresholdsNumber) {
          if (this.who.length >= this.quorum) {
            this.tallyResult = { index: index, ...this.result[index] };
            return { shouldTally: true, tallyResult: this.tallyResult };
          }
        }
      }
    }

    return { shouldTally: false };
  }
}
