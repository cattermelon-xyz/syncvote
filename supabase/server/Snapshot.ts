import { supabase } from './configs/supabaseClient.ts';
import { VotingMachine } from './index.ts';
// import { ApolloClient, InMemoryCache, gql } from 'npm:@apollo/client@^3.8.7';

export class Snapshot extends VotingMachine {
  status: string;
  proposal: any;
  state: string;
  constructor(props: any) {
    super(props);
    this.status = 'active';
    this.proposal = {};
  }

  validate(checkpoint: any) {
    let isValid = true;
    const message: string[] = [];
    if (!checkpoint?.data.type) {
      isValid = false;
      message.push('Missing type of vote in snapshot');
    }

    if (!checkpoint?.data.space) {
      isValid = false;
      message.push('Missing space of snapshot');
    }

    if (!checkpoint?.data.action) {
      isValid = false;
      message.push('Missing action for snapshot checkpoint');
    }

    if (checkpoint?.data.action === 'create-proposal') {
      if (!checkpoint.data.proposalId) {
        isValid = false;
        message.push('Missiong variable to store proposalId');
      }

      if (!checkpoint?.data.fallback || !checkpoint.data.next) {
        isValid = false;
        message.push('Missing fallback or next checkpoint');
      }

      if (!checkpoint?.children || checkpoint.children.length === 0) {
        isValid = false;
        message.push('Missing options');
      }

      if (!checkpoint?.data.snapshotDuration) {
        isValid = false;
        message.push('Missing duration for Snapshot proposal');
      }
    } else {
      if (!checkpoint?.data.snapshotIdToSync) {
        isValid = false;
        message.push('Missing checkpoint snapshot parent');
      }

      const snapshotOption = checkpoint?.data?.snapShotOption
        ? checkpoint?.data?.snapShotOption
        : [];
      if (
        !checkpoint?.children ||
        checkpoint.children.length === 0 ||
        checkpoint.children.length !== snapshotOption.length + 1
      ) {
        isValid = false;
        message.push('Missing children checkpoint for option');
      }

      if (!checkpoint?.data.fallback) {
        isValid = false;
        message.push('Missing fallback checkpoint');
      }
    }

    return {
      isValid,
      message,
    };
  }

  async recordVote(voteData) {
    // check recordVote of VotingMachine class
    const { notRecorded, error } = await super.recordVote(voteData);
    if (notRecorded) {
      return { notRecorded, error };
    }

    // check if dont have action
    if (this.data.action === 'create-proposal' && !voteData.submission) {
      return {
        notRecorded: true,
        error: 'Snapshot: Missing submission',
      };
    } else {
      if (this.data.action === 'create-proposal') {
        if (!voteData.submission.proposalId) {
          return {
            notRecorded: true,
            error: 'Snapshot: Missing proposalId',
          };
        }
      }
    }

    if (this.data.action === SNAPSHOT_ACTION.CREATE_PROPOSAL) {
      this.who = [voteData.identify];
      this.result = voteData.submission;
      this.tallyResult = {
        ...voteData.submission,
        index: this.children.indexOf(this.data.next),
        linkSnapshot: `https://snapshot.org/#/${this.data.space}/proposal/${voteData.submission.proposalId}`,
      };
      const root_mission_id = this.m_parent ? this.m_parent : this.mission_id;

      await supabase
        .from('variables')
        .insert({
          name: this.data.proposalId,
          value: voteData.submission.proposalId,
          mission_id: root_mission_id,
        })
        .select('*');
    } else if (this.data.action === SNAPSHOT_ACTION.SYNC_PROPOSAL) {
      const root_mission_id = this.m_parent ? this.m_parent : this.mission_id;

      const { data: variables } = await supabase
        .from('variables')
        .select('*')
        .eq('mission_id', root_mission_id)
        .eq('name', this.data.proposalId);

      if (variables) {
        const { respone } = await getSnapshotData({
          proposalId: variables[0].value,
        });

        if (respone) {
          let result = {};
          for (let i = 0; i < respone?.data.proposal.choices.length; i++) {
            result[i] = {
              voting_power: respone.data.proposal.scores[i],
            };
          }
          this.result = result;

          if (respone.data.proposal.state === 'closed') {
            this.state = 'closed';
            let maxVotingPower = -Infinity;
            let maxIndex: any;

            for (const key in result) {
              if (result.hasOwnProperty(key)) {
                const votingPower = result[key].voting_power;
                if (votingPower > maxVotingPower) {
                  maxVotingPower = votingPower;
                  maxIndex = key;
                }
              }
            }

            this.tallyResult = {
              index: maxIndex,
              voting_power: maxVotingPower,
            };
          }
        }
      } else {
        return {
          notRecorded: true,
          error: 'Snapshot: Cannot find proposalId of checkpoinr parent',
        };
      }
    }

    return {};
  }

  shouldTally() {
    if (this.data.action === SNAPSHOT_ACTION.CREATE_PROPOSAL) {
      return {
        shouldTally: true,
        tallyResult: this.tallyResult,
      };
    } else if (this.data.action === SNAPSHOT_ACTION.SYNC_PROPOSAL) {
      if (this.state === 'closed') {
        if (Number(this.tallyResult.voting_power) === 0) {
          return {
            error:
              'Cannot move to next checkpoint because voting power is not enough',
          };
        }
        return {
          shouldTally: true,
          tallyResult: this.tallyResult,
        };
      }
    }
    return {};
  }
}

const SNAPSHOT_ACTION = {
  CREATE_PROPOSAL: 'create-proposal',
  SYNC_PROPOSAL: 'sync-proposal',
};

const getSnapshotData = async (props) => {
  // try {
  //   const { proposalId } = props;
  //   const clientApollo = new ApolloClient({
  //     uri: 'https://hub.snapshot.org/graphql',
  //     cache: new InMemoryCache(),
  //   });

  //   const respone = await clientApollo.query({
  //     query: gql`
  //         query {
  //           proposal(id: "${proposalId}") {
  //             id
  //             choices
  //             start
  //             end
  //             snapshot
  //             state
  //             author
  //             created
  //             scores
  //             scores_by_strategy
  //             scores_total
  //             scores_updated
  //             plugins
  //             network
  //           }
  //         }
  //       `,
  //   });

  //   return { respone };
  // } catch (error) {
  //   console.log('GetDataProposalError: ', error);
  //   return {};
  // }
  return {};
};
