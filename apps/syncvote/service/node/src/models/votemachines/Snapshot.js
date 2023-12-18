const { VotingMachine } = require('.');
const { SNAPSHOT_ACTION } = require('../../configs/constants');
const { ApolloClient, InMemoryCache, gql } = require('@apollo/client');

class Snapshot extends VotingMachine {
  constructor(props) {
    super(props);
  }

  validate(checkpoint) {
    let isValid = true;
    const message = [];
    if (!checkpoint?.children || checkpoint.children.length === 0) {
      isValid = false;
      message.push('Missing options');
    }

    if (!checkpoint?.props.fallback || !checkpoint?.props.next) {
      isValid = false;
      message.push('Missiong fallback and next checkpoint');
    }

    if (!checkpoint?.props.space || !checkpoint?.props.type) {
      isValid = false;
      message.push('Missing attributes of snapshot');
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
      if (!voteData.proposalId) {
        return {
          notRecorded: true,
          error: 'Snapshot: Missing proposalId',
        };
      }
    }

    if (this.data.action === SNAPSHOT_ACTION.CREATE_PROPOSAL) {
      this.who = [voteData.identify];
      this.result = voteData.submission;
      this.tallyResult = {
        ...voteData.submission,
        index: this.children.indexOf(this.data.next),
      };
    } else if (this.data.action === SNAPSHOT_ACTION.SYNC_PROPOSAL) {
      const { data } = await getSnapshotData('proposalId');
    }

    return {};
  }

  shouldTally() {
    if (this.submission.action === SNAPSHOT_ACTION.CREATE_PROPOSAL) {
      return {
        shouldTally: true,
        tallyResult: this.tallyResult,
      };
    } else if (voteData.submission.action === SNAPSHOT_ACTION.SYNC_PROPOSAL) {
    }
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
