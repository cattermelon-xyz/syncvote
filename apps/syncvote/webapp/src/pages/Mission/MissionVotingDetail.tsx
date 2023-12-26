import { useEffect, useState } from 'react';
import { Space, MenuProps } from 'antd';
import { useParams } from 'react-router-dom';
import { queryAMissionDetail } from '@dal/data';
import { extractIdFromIdString, supabase } from 'utils';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import ModalListParticipants from './fragments/ModalListParticipants';
import ModalVoterInfo from './fragments/ModalVoterInfo';
import { extractCurrentCheckpointId } from '@utils/helpers';
import { queryDocInput } from '@dal/data';
// =============================== METAMASK SECTION ===============================
import { useSDK } from '@metamask/sdk-react';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import snapshot from '@snapshot-labs/snapshot.js';
import moment from 'moment';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import MissionProgressSummary from './fragments/MissionProgressSummary';
import MissionSummary from './fragments/MissionSummary';
import { getVoteMachine } from 'directed-graph';
export function isExternalProvider(
  provider: any
): provider is ExternalProvider {
  return provider && typeof provider.request === 'function';
}
// =============================== METAMASK SECTION ===============================

const getCheckpointData = (data: any) => {
  const currentCheckpointId = extractCurrentCheckpointId(data.id);
  const checkpointData = data?.data?.checkpoints.filter(
    (checkpoint: any) => checkpoint.id === currentCheckpointId
  );
  const listVersionDocs = data?.progress.flatMap((progress: any) => {
    return progress?.tallyResult?.submission || [];
  });
  let checkpointDataAfterHandle = checkpointData[0];
  if (!checkpointData[0].isEnd) {
    const startToVote = new Date(data.startToVote);
    // convert second to millisecond of duration
    const duration = checkpointData[0].duration * 1000;
    const endTovote = new Date(startToVote.getTime() + duration).toISOString();
    checkpointDataAfterHandle.endToVote = endTovote;
  }
  return {
    listVersionDocs,
    currentCheckpointData: checkpointDataAfterHandle,
  };
};

const MissionVotingDetail = () => {
  const { missionIdString } = useParams();
  const missionId = extractIdFromIdString(missionIdString);
  const [missionData, setMissionData] = useState<any>();
  const [openModalListParticipants, setOpenModalListParticipants] =
    useState<boolean>(false);
  const [openModalVoterInfo, setOpenModalVoterInfo] = useState<boolean>(false);
  const [selectedOption, onSelectedOption] = useState<number>(-1);
  const { currentCheckpointData, listVersionDocs } = missionData
    ? getCheckpointData(missionData)
    : { currentCheckpointData: undefined, listVersionDocs: [] };
  const [submission, setSubmission] = useState<any>();
  const dispatch = useDispatch();

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

  // =============================== METAMASK SECTION ===============================

  const fetchData = () => {
    queryAMissionDetail({
      missionId,
      onSuccess: (data: any) => {
        console.log('data query', data);
        setMissionData(data);
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: error,
        });
      },
      dispatch,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // TODO: change to PDA-style design to query all docs version

  const onSubmit = (submitted: any) => {
    console.log('submitted data: ', submitted);
  };
  console.log(
    'current votemachine: ',
    currentCheckpointData?.vote_machine_type
  );
  const voteMachine = getVoteMachine(currentCheckpointData?.vote_machine_type);
  const shouldRenderVoteSection = !(
    currentCheckpointData?.isEnd ||
    currentCheckpointData?.vote_machine_type === 'forkNode' ||
    currentCheckpointData?.vote_machine_type === 'joinNode'
  );
  return (
    <>
      {missionData && currentCheckpointData && (
        <div className='lg:w-[1024px] md:w-[640px] sm:w-[400px] flex gap-4'>
          <div className='w-2/3'>
            <MissionSummary
              currentCheckpointData={currentCheckpointData}
              missionData={missionData}
              listVersionDocs={listVersionDocs}
              dataOfAllDocs={[]}
            />
            <Space direction='vertical' size={16} className='w-full'>
              {shouldRenderVoteSection && voteMachine?.VoteUIWeb && (
                <voteMachine.VoteUIWeb
                  missionData={missionData}
                  checkpointData={currentCheckpointData}
                  onSubmit={onSubmit}
                />
              )}
              {!currentCheckpointData.isEnd &&
                currentCheckpointData.vote_machine_type !== 'Snapshot' &&
                currentCheckpointData.vote_machine_type !== 'DocInput' && (
                  <>
                    {voteMachine?.RenderChoices && (
                      <voteMachine.RenderChoices
                        missionData={missionData}
                        currentCheckpointData={currentCheckpointData}
                      />
                    )}
                  </>
                )}
            </Space>
          </div>
          <div className='flex-1 flex flex-col gap-4'>
            <MissionProgressSummary
              missionData={missionData}
              proposal={proposal}
              currentCheckpointData={currentCheckpointData}
              setOpenModalListParticipants={setOpenModalListParticipants}
            />
          </div>
        </div>
      )}
      <ModalListParticipants
        open={openModalListParticipants}
        onClose={() => setOpenModalListParticipants(false)}
        listParticipants={currentCheckpointData?.participation?.data || []}
      />

      <ModalVoterInfo
        option={selectedOption === -1 ? [-1] : [selectedOption - 1]}
        open={openModalVoterInfo}
        onClose={() => setOpenModalVoterInfo(false)}
        missionId={missionId}
        listParticipants={currentCheckpointData?.participation?.data || []}
        submission={submission}
        currentCheckpointData={currentCheckpointData}
      />
    </>
  );
};

export default MissionVotingDetail;
