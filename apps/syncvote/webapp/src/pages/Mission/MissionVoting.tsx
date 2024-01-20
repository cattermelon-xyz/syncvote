import { useEffect, useState } from 'react';
import { Space, MenuProps, Button, Card, Tag, Tabs } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import { queryAMissionDetail } from '@dal/data';
import { extractIdFromIdString, supabase, useGetDataHook } from 'utils';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import ModalListParticipants from './fragments/ModalListParticipants';
import { extractCurrentCheckpointId } from '@utils/helpers';
import { config } from '@dal/config';
import { useSDK } from '@metamask/sdk-react';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { getVoteMachine } from 'directed-graph';
import { vote } from '@axios/vote';
import Metamask from '@assets/icons/svg-icons/Metamask';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { L } from '@utils/locales/L';
import HistoryOfCheckpoint from './fragments/HistoryOfCheckpoint';
import HeaderEditorPage from '@layout/fragments/HeaderEditorPage';
import { AuthContext } from '@layout/context/AuthContext';
import ModalConnectWallet from './fragments/ModalConnectWallet';
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
  // FIXME: doc-input data format is not compliant with the current format
  // TODO: change doc-input to PDA-style data structure
  // const listVersionDocs = data?.progress.flatMap((progress: any) => {
  //   return progress?.tallyResult?.submission || [];
  // });
  const listVersionDocs: any = [];
  let checkpointDataAfterHandle = checkpointData[0];
  if (!checkpointData[0].isEnd) {
    const startToVote = new Date(data.startToVote);
    // convert second to millisecond of duration
    const duration = (checkpointData[0].duration || 0) * 1000;
    const endTovote = new Date(startToVote.getTime() + duration).toISOString();
    checkpointDataAfterHandle.endToVote = endTovote;
    checkpointDataAfterHandle.initData = data.initData || {};
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

const renderVoteMachine = (
  missionData: any,
  user: any,
  account: any,
  dispatch: any
) => {
  const { currentCheckpointData } = getCheckpointData(missionData);
  const voteMachine = getVoteMachine(currentCheckpointData?.vote_machine_type);
  // if forkNode or joinNode, what should we do?
  const isVoteable = !(
    currentCheckpointData?.isEnd ||
    currentCheckpointData?.vote_machine_type === 'forkNode' ||
    currentCheckpointData?.vote_machine_type === 'joinNode'
  );
  const isForkNode = currentCheckpointData?.vote_machine_type === 'forkNode';
  return (
    <>
      {isVoteable && voteMachine?.VoteUIWeb && (
        <voteMachine.VoteUIWeb
          missionData={missionData}
          checkpointData={currentCheckpointData}
          onSubmit={(sumitted: any) => {
            submit(
              sumitted,
              currentCheckpointData,
              missionData.mission_id,
              user,
              account,
              dispatch
            );
          }}
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
    </>
  );
};

const renderId = (
  user: any,
  dispatch: any,
  account: any,
  connect: any,
  disconnect: any
) => {
  return (
    <Card className='flex flex-col mb-10 gap-6'>
      <Space direction='vertical'>
        {user?.email ? (
          <div>
            <span>
              You are logged in with email <Tag>{user.email}</Tag>
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
              onClick={async () => {
                login(dispatch);
                await window?.ethereum?.request({
                  method: 'eth_requestAccounts',
                });
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
  );
};

const submit = (
  submitted: any,
  currentCheckpointData: any,
  missionId: any,
  user: any,
  account: any,
  dispatch: any
  //   isFullVote?: boolean
) => {
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
            // maskClosable: !isFullVote,
            content: 'Please open Extension to continue',
            footer: null,
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

const MissionVoting = () => {
  const { missionIdString } = useParams();
  const dispatch = useDispatch();
  const missionId = extractIdFromIdString(missionIdString);
  const [missionData, setMissionData] = useState<any>();
  const [openModalListParticipants, setOpenModalListParticipants] =
    useState<boolean>(false);
  const [openModalConnectWallet, setOpenModalConnectWallet] =
    useState<boolean>(true);
  const [historicalCheckpointData, setHistoricalCheckpointData] =
    useState<any>();
  const { currentCheckpointData, listVersionDocs } = missionData
    ? getCheckpointData(missionData)
    : {
        currentCheckpointData: undefined,
        listVersionDocs: [],
      };
  const subMissions = missionData?.data?.subMissions || [];
  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  // =============================== METAMASK SECTION ===============================
  const [account, setAccount] = useState<any>();
  const { sdk } = useSDK();

  const connect = async () => {
    try {
      console.log(sdk);
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
      onSuccess: async (data: any) => {
        // query variables value
        const variables = data?.data?.variables;
        const variableValues: any = {};
        for (var i = 0; i < variables?.length; i++) {
          const resp: any = await supabase
            .from('variables')
            .select('value')
            .eq('mission_id', missionId)
            .eq('name', variables[i]);
          if (resp.data) {
            variableValues[variables[i]] = resp.data[0]?.value;
          }
        }
        const currentCheckpointId = extractCurrentCheckpointId(data.id);
        let subMissionIds = [];
        const subMissions: any = [];
        const checkpointData = data?.data?.checkpoints.filter(
          (checkpoint: any) => checkpoint.id === currentCheckpointId
        );
        if (checkpointData[0].vote_machine_type === 'forkNode') {
          subMissionIds = data.initData?.start || [];

          for (var i = 0; i < subMissionIds.length; i++) {
            await queryAMissionDetail({
              missionId: subMissionIds[i],
              dispatch,
              onSuccess: (data: any) => {
                console.log(
                  'push submission data in array, set variables: ',
                  variableValues
                );
                subMissions.push({
                  ...data,
                  data: { ...data.data, variables: variableValues },
                });
              },
              onError: (error) => {},
            });
          }
        }
        data.data.variables = variableValues;
        data.data.subMissions = subMissions;
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

  useEffect(() => {
    console.log('account', account);
  }, [account]);

  // TODO: change to PDA-style design to query all docs version

  const isForkNode = currentCheckpointData?.vote_machine_type === 'forkNode';
  const subMissionTabItems = subMissions?.map(
    (subMission: any, index: number) => {
      return {
        label: subMission?.title,
        key: index.toString(),
        children: renderVoteMachine(subMission, user, account, dispatch),
      };
    }
  );
  return (
    <>
      <AuthContext.Consumer>
        {({ session }) => (
          <div className='flex flex-col w-full items-center gap-10'>
            <HeaderEditorPage
              session={session}
              account={account}
              setAccount={setAccount}
            />
            {missionData && currentCheckpointData && (
              <div className='w-full h-full'>
                {isForkNode && (
                  <>
                    <Tabs defaultActiveKey='0' items={subMissionTabItems} />
                  </>
                )}
                {historicalCheckpointData ? (
                  <HistoryOfCheckpoint
                    historicalCheckpointData={historicalCheckpointData}
                  />
                ) : (
                  renderVoteMachine(missionData, user, account, dispatch)
                )}
              </div>
            )}
            <ModalConnectWallet
              open={openModalConnectWallet}
              onClose={() => setOpenModalConnectWallet(false)}
              setAccount={setAccount}
            />
          </div>
        )}
      </AuthContext.Consumer>
    </>
  );
};

export default MissionVoting;
