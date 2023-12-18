// =============================== METAMASK SECTION ===============================
import { useSDK } from '@metamask/sdk-react';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import snapshot from '@snapshot-labs/snapshot.js';
import moment from 'moment';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { FaCopy } from 'react-icons/fa6';
export function isExternalProvider(
provider: any
): provider is ExternalProvider {
return provider && typeof provider.request === 'function';
}
// =============================== METAMASK SECTION ===============================


// =============================== METAMASK SECTION ===============================
  const [proposalId, setProposalId] = useState(null);
  const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
  const [proposal, setProposal] = useState<any>(null);
  const [account, setAccount] = useState<any>();
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();

      if (Array.isArray(accounts) && accounts.length > 0) {
        setAccount(accounts[0]);
        console.log(accounts[0]);
      }
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  const disconnect = async () => {
    sdk?.terminate();
    setAccount('');
  };

  const client = new snapshot.Client712(hub);

  const createProposal = async () => {
    let web3;
    if (isExternalProvider(window.ethereum)) {
      web3 = new Web3Provider(window.ethereum);
    }
    let choices: string[] = currentCheckpointData.data.options;
    if (currentCheckpointData.includedAbstain) {
      choices.push('Abstain');
    }

    if (web3) {
      const accounts = await web3.listAccounts();
      const receipt = await client.proposal(web3, accounts[0], {
        space: currentCheckpointData?.data?.space,
        type: currentCheckpointData?.data?.type?.value,
        title: 'Testing Syncvote MVP',
        body: `***Hello DAO members,***
        How's everyone doing?
        If you're reading this proposal, it means that our team has successfully generated a Snapshot proposal through Syncvote. This marks a step in our ongoing efforts to enhance DAOs' autonomy through integrations on Syncvote.
        DAOs which have already created governance workflows on Syncvote can now adopt this new automation feature. When it comes to the Snapshot (off-chain voting) stage of the governance process, proposal author only needs to:
        - Open our plugin
        - Click on one button
        - Draft the proposal
        - And the proposal will be automatically generated on Snapshot.
        In the near future, we will broaden our integrations with widely-used DAO apps and tools such as Discourse, Tally, Realms… ***It will bring Syncvote one step closer to becoming a top-of-mind unified app to enforce DAO governance process.***
        To gain a better understanding of the context, please refer to this proposal: **[HIP14 - Proposal to utilize treasury for developing Syncvote](https://snapshot.org/#/hectagon.eth/proposal/0xadde5daee982803db92ba838ba3fefe5bc6b935baf44aef9643f010be5bbc7f3).**
        Thanks for reading.`,
        choices: choices,
        start: moment().unix(),
        end: moment().unix() + currentCheckpointData?.duration,
        snapshot: 13620822,
        plugins: JSON.stringify({}),
        app: 'my-app',
        discussion: '',
      });

      if (receipt) {
        const { data } = await supabase
          .from('current_vote_data')
          .update({ initData: receipt })
          .eq('checkpoint_id', `${missionId}-${currentCheckpointData.id}`)
          .select('initData');

        if (data) {
          setProposalId(data[0].initData.id);
          getDataSnapshot(data[0]?.initData.id);
        }
      }
    }
  };

  const checkProposalId = async () => {
    if (
      currentCheckpointData &&
      currentCheckpointData?.vote_machine_type === 'Snapshot'
    ) {
      const { data } = await supabase
        .from('current_vote_data')
        .select('initData')
        .eq('checkpoint_id', `${missionId}-${currentCheckpointData.id}`);

      if (data && data[0]?.initData?.id) {
        setProposalId(data[0]?.initData.id);

        getDataSnapshot(data[0]?.initData.id);
      }
    }
  };

  const getDataSnapshot = async (proposalId: string) => {
    const clientApollo = new ApolloClient({
      uri: 'https://hub.snapshot.org/graphql',
      cache: new InMemoryCache(),
    });

    clientApollo
      .query({
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
      })
      .then((result) => {
        console.log(result);
        setProposal(result.data.proposal);
      });
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <>
          {!proposalId ? (
            <a onClick={createProposal} className='rounded-xl w-full'>
              Create Snapshot Proposal
            </a>
          ) : (
            <a className='rounded-xl w-full'>Sync proposal</a>
          )}
        </>
      ),
      disabled: proposalId ? true : false,
    },
    {
      key: '2',
      label: (
        <>
          <a className='rounded-xl w-full'>Change wallet</a>
        </>
      ),
      disabled: true,
    },
    {
      key: '3',
      label: (
        <>
          <a onClick={disconnect} className='rounded-xl w-full'>
            Disconnect
          </a>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('Metamask is installed');
    }

    checkProposalId();
  }, [currentCheckpointData]);

  // =============================== METAMASK SECTION ===============================

    {/* =============================== METAMASK SECTION =============================== */}
                {connected && account ? (
                  <>
                    <Dropdown menu={{ items }} placement='bottom'>
                      <Button
                        className='h-14 rounded-xl flex items-center justify-center'
                        onClick={() => {
                          navigator.clipboard
                            .writeText(account)
                            .then(() => {
                              console.log('Text copied to clipboard');
                            })
                            .catch((err) => {
                              console.error('Failed to copy text: ', err);
                            });
                        }}
                      >
                        {account?.slice(0, 7)}...{account.slice(39, 43)}{' '}
                        <FaCopy className='ml-1' />
                      </Button>
                    </Dropdown>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={connect}
                      className='h-14 rounded-xl flex items-center justify-center'
                    >
                      <img
                        src='/metamask.svg'
                        alt=''
                        height={20}
                        width={20}
                        className='mr-2'
                      />
                      Connect wallet
                    </Button>
                  </>
                )}

                {/* =============================== METAMASK SECTION =============================== */}
