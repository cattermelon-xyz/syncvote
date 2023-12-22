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

    if (!checkpoint?.data?.fallback || !checkpoint?.data?.next) {
      isValid = false;
      message.push('Missing fallback and next checkpoint');
    }

    if (!checkpoint?.data?.space || !checkpoint?.data?.type) {
      isValid = false;
      message.push('Missing attributes of snapshot');
    }

    if (
      checkpoint?.data?.action !== SNAPSHOT_ACTION.CREATE_PROPOSAL &&
      checkpoint?.data?.action !== SNAPSHOT_ACTION.SYNC_PROPOSAL
    ) {
      isValid = false;
      message.push('Wrong or missing action');
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
      if (!voteData.submission.proposalId) {
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
