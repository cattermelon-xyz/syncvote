const { VotingMachine } = require('.');
const { SNAPSHOT_ACTION } = require('../../configs/constants');
const { ApolloClient, InMemoryCache, gql } = require('@apollo/client');
const { supabase } = require('../../configs/supabaseClient');

class Snapshot extends VotingMachine {
  constructor(props) {
    super(props);
  }

  validate(checkpoint) {
    let isValid = true;
    const message = [];
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
        checkpoint.children.length !== snapshotOption.length
      ) {
        isValid = false;
        message.push('Missing children checkpoint for option');
      }
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
        const { data } = await getSnapshotData({
          proposalId: variables[0].value,
        });
        this.who = [voteData.identify];
        this.result = data;
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
    }
    return {};
  }
}

module.exports = {
  Snapshot,
};

const getSnapshotData = async (props) => {
  try {
    const { proposalId } = props;
    const clientApollo = new ApolloClient({
      uri: 'https://hub.snapshot.org/graphql',
      cache: new InMemoryCache(),
    });

    const respone = await clientApollo.query({
      query: gql`
          query {
            proposal(id: "${proposalId}") {
              id
              title
              body
              choices
              start
              end
              snapshot
              state
              author
              created
              scores
              scores_by_strategy
              scores_total
              scores_updated
              plugins
              network
              strategies {
                name
                network
                params
              }
              space {
                id
                name
              }
            }
          }
        `,
    });

    return { data: respone };
  } catch (error) {
    console.log('GetDataProposalError: ', e);
    return {};
  }
};
