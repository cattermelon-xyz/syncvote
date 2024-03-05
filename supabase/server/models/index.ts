import moment from 'npm:moment@^2.29.4';

export class VotingMachine {
  duration: any;
  cvd_created_at: any;
  mission_id: any;
  who: any;
  delays: any;
  delayUnits: any;
  result: any;
  startToVote: any;
  endedAt: any;
  tallyResult: any;
  participation: any;
  children: any;
  data: any;
  m_parent: any;

  public constructor(props: any) {
    const {
      duration,
      cvd_created_at,
      who,
      delays,
      delayUnits,
      result,
      startToVote,
      endedAt,
      tallyResult,
      participation,
      children,
      props: data,
      mission_id,
      m_parent,
      minDuration,
    } = props;

    this.duration = duration;
    this.cvd_created_at = cvd_created_at;
    this.mission_id = mission_id;
    this.who = who;
    this.delays = delays;
    this.delayUnits = delayUnits;
    this.result = result;
    this.startToVote = startToVote;
    this.endedAt = endedAt;
    this.tallyResult = tallyResult;
    this.participation = JSON.parse(participation || `{}`);
    this.children = children;
    this.data = data;
    this.m_parent = m_parent;
    this.duration = minDuration;
  }

  initDataForCVD() {
    return {};
  }

  fallBack() {
    // check if this checkpoint is outdate
    const startToVoteMoment = moment(this.startToVote).unix();
    const now = moment().unix();

    if (now > startToVoteMoment + this.duration) {
      return {
        fallback: true,
        error: 'This checkpoint suppose to be closed',
      };
    }

    return {};
  }

  async recordVote(voteData: any) {
    if (!voteData.identify) {
      return {
        notRecorded: true,
        error: `VoteData missing identity`,
      };
    }

    if (this.endedAt) {
      return {
        notRecorded: true,
        error: `This checkpoint is ended`,
      };
    }

    const startToVoteMoment = moment(this.startToVote).unix();
    const now = moment().unix();
    // check if this checkpoint is not ready to vote
    if (now - startToVoteMoment < 0) {
      return {
        notRecorded: true,
        error: `This checkpoint was not ready to vote`,
      };
    }

    // check if user was allow to vote, check participation
    if (this.participation.type === 'identity') {
      // check if user was allow to vote, check participation
      if (!this.participation.data.includes(voteData.identify)) {
        return { notRecorded: true, error: `You don't have right to vote` };
      }
    }

    return {};
  }

  tally() {}

  shouldTally() {}
}
