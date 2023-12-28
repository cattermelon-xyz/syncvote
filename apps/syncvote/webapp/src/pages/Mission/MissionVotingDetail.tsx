import { useEffect, useState } from 'react';
import { Space, MenuProps, Button, Card, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { queryAMissionDetail } from '@dal/data';
import { extractIdFromIdString, supabase, useGetDataHook } from 'utils';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import ModalListParticipants from './fragments/ModalListParticipants';
import { extractCurrentCheckpointId } from '@utils/helpers';
import { queryDocInput } from '@dal/data';
import { config } from '@dal/config';
// =============================== METAMASK SECTION ===============================
import { useSDK } from '@metamask/sdk-react';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import snapshot from '@snapshot-labs/snapshot.js';
import moment from 'moment';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import MissionProgressSummary from './fragments/MissionProgressSummary';
import MissionSummary from './fragments/MissionSummary';
import { getVoteMachine } from 'directed-graph';
import { vote } from '@axios/vote';
import { log } from 'console';
import Metamask from '@assets/icons/svg-icons/Metamask';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { L } from '@utils/locales/L';
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

const login = async (dispatch: any) => {
  dispatch(startLoading({}));
  const currentURL = window.location.href;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: currentURL,
    },
  });
  dispatch(finishLoading({}));
  if (error) {
    Modal.error({
      title: L('error'),
      content: error.message || '',
    });
  }
};

const MissionVotingDetail = () => {
  const { missionIdString } = useParams();
  const missionId = extractIdFromIdString(missionIdString);
  const [missionData, setMissionData] = useState<any>();
  const [openModalListParticipants, setOpenModalListParticipants] =
    useState<boolean>(false);
  const [selectedOption, onSelectedOption] = useState<number>(-1);
  const { currentCheckpointData, listVersionDocs } = missionData
    ? getCheckpointData(missionData)
    : { currentCheckpointData: undefined, listVersionDocs: [] };
  const [submission, setSubmission] = useState<any>();
  const dispatch = useDispatch();
  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  // =============================== METAMASK SECTION ===============================
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
    const { option, submission } = submitted;
    const participants = currentCheckpointData?.participation?.data || [];
    let permittedIdentity = participants.find(
      (participant: any) =>
        participant.toLowerCase() === user?.email?.toLowerCase() ||
        participant.toLowerCase() === account?.toLowerCase()
    );
    let permitted =
      participants.length === 0
        ? true
        : permittedIdentity !== undefined
        ? true
        : false;
    if (permitted) {
      vote({
        data: {
          identify: permittedIdentity,
          option: option,
          mission_id: missionId,
          submission: submission,
        },
        onSuccess: (res: any) => {
          if (['FALLBACK', 'ERR'].indexOf(res.data.status) !== -1) {
            console.log('error: ', res);
            Modal.error({
              title: 'Error',
              content: res.data.message.toString(),
            });
          } else {
            Modal.success({
              title: 'Success',
              content: 'Voting successfully',
              onOk: () => {
                window.location.reload();
              },
            });
          }
        },
        onError: (err) => {
          console.log('err: ', err);
          Modal.error({
            title: 'Error',
            content: 'Voting error',
          });
        },
        dispatch,
      });
    } else {
      Modal.error({
        title: "You don't have permission to vote",
        content: 'Please sign in with your registered email or wallet address',
      });
    }
  };
  const voteMachine = getVoteMachine(currentCheckpointData?.vote_machine_type);
  // if forkNode or joinNode, what should we do?
  const isVoteable = !(
    currentCheckpointData?.isEnd ||
    currentCheckpointData?.vote_machine_type === 'forkNode' ||
    currentCheckpointData?.vote_machine_type === 'joinNode'
  );
  return (
    <>
      {missionData && currentCheckpointData && (
        <div className='lg:w-[1024px] md:w-[640px] sm:w-[400px] flex gap-4'>
          <Space direction='vertical' className='w-2/3' size='small'>
            <MissionSummary
              currentCheckpointData={currentCheckpointData}
              missionData={missionData}
              listVersionDocs={listVersionDocs}
              dataOfAllDocs={[]}
            />
            {isVoteable && (
              <Card className='flex flex-col mb-10 gap-6'>
                <Space direction='vertical'>
                  {user?.email ? (
                    <div>
                      <span>
                        You are voting with email <Tag>{user.email}</Tag>
                        <Button
                          type='text'
                          onClick={async () => {
                            dispatch(startLoading({}));
                            await supabase.auth.signOut();
                            window.location.reload();
                            dispatch(finishLoading({}));
                          }}
                        >
                          Sign out
                        </Button>
                      </span>
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={() => {
                          login(dispatch);
                        }}
                      >
                        Login
                      </Button>{' '}
                      with email
                    </div>
                  )}
                  {account ? (
                    <div>
                      <span>You are voting with wallet </span>
                      <Tag>{account}</Tag>{' '}
                      <Button type='text' onClick={disconnect}>
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <div className='flex gap-2 items-center'>
                      Or
                      <Button
                        icon={<Metamask />}
                        className='flex items-center'
                        onClick={connect}
                      >
                        Login
                      </Button>
                      with MetaMask
                    </div>
                  )}
                </Space>
              </Card>
            )}
            <Space direction='vertical' size={16} className='w-full'>
              {isVoteable && voteMachine?.VoteUIWeb && (
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
          </Space>
          <div className='flex-1 flex flex-col gap-4'>
            <MissionProgressSummary
              missionData={missionData}
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
    </>
  );
};

export default MissionVotingDetail;
