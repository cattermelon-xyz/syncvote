import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Progress,
  Space,
  Tag,
  message,
  MenuProps,
  Dropdown,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Icon } from 'icon';
import { useParams } from 'react-router-dom';
import { queryAMissionDetail } from '@dal/data';
import { extractIdFromIdString, supabase } from 'utils';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import {
  formatDate,
  getTimeElapsedSinceStart,
  getTimeRemainingToEnd,
} from '@utils/helpers';
import ModalListParticipants from './fragments/ModalListParticipants';
import ModalVoterInfo from './fragments/ModalVoterInfo';
import { extractCurrentCheckpointId } from '@utils/helpers';
import MissionProgress from './fragments/MissionProgress';
import VoteSection from './fragments/VoteSection';
import ShowDescription from './fragments/ShowDescription';
import ProposalDocuments from './fragments/ProposalDocuments';
import { queryDocInput } from '@dal/data';
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

const MissionVotingDetail = () => {
  const { missionIdString } = useParams();
  const missionId = extractIdFromIdString(missionIdString);
  const [missionData, setMissionData] = useState<any>();
  const [isReachedQuorum, setIsReachedQuorum] = useState<boolean>();
  const [openModalListParticipants, setOpenModalListParticipants] =
    useState<boolean>(false);
  const [openModalVoterInfo, setOpenModalVoterInfo] = useState<boolean>(false);
  const [listParticipants, setListParticipants] = useState<any[]>([]);
  const [selectedOption, onSelectedOption] = useState<number>(-1);
  const [currentCheckpointData, setCurrentCheckpointData] = useState<any>();
  const [submission, setSubmission] = useState<any>();
  const [listVersionDocs, setListVersionDocs] = useState<any[]>();
  const [dataOfAllDocs, setDataOfAllDocs] = useState<any[]>([]);
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

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('Metamask is installed');
    }

    checkProposalId();
  }, [currentCheckpointData]);

  // =============================== METAMASK SECTION ===============================

  const fetchData = () => {
    queryAMissionDetail({
      missionId,
      onSuccess: (data: any) => {
        setMissionData(data);
        const currentCheckpointId = extractCurrentCheckpointId(data.id);
        const checkpointData = data?.data?.checkpoints.filter(
          (checkpoint: any) => checkpoint.id === currentCheckpointId
        );
        const listVersionDocs = data?.progress.flatMap((progress: any) => {
          return progress?.tallyResult?.submission || [];
        });
        setListVersionDocs(listVersionDocs);
        console.log('missiondata', data);
        console.log('checkpointData', checkpointData[0]);
        let checkpointDataAfterHandle = checkpointData[0];

        if (!checkpointData[0].isEnd) {
          const startToVote = new Date(data.startToVote);
          // convert second to millisecond of duration
          const duration = checkpointData[0].duration * 1000;
          const endTovote = new Date(
            startToVote.getTime() + duration
          ).toISOString();
          checkpointDataAfterHandle.endToVote = endTovote;
        }

        switch (checkpointData[0]?.vote_machine_type) {
          case 'SingleChoiceRaceToMax':
            if (checkpointData[0]?.includedAbstain === true) {
              checkpointDataAfterHandle.data.options.push('Abstain');
            }
            break;
          case 'UpVote':
            checkpointDataAfterHandle.data.options = [];
            checkpointDataAfterHandle.data.options.push('Upvote');
            if (checkpointData[0]?.includedAbstain === true) {
              checkpointDataAfterHandle.data.options.push('Abstain');
            }
            break;
          case 'Veto':
            checkpointDataAfterHandle.data.options = [];
            checkpointDataAfterHandle.data.options.push('Upvote');
            if (checkpointData[0]?.includedAbstain === true) {
              checkpointDataAfterHandle.data.options.push('Abstain');
            }
            break;
          default:
            break;
        }
        setCurrentCheckpointData(checkpointDataAfterHandle);
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
    if (listVersionDocs) {
      listVersionDocs?.map((versionItem: any) => {
        const idDocInput = versionItem[Object.keys(versionItem)[0]];
        queryDocInput({
          idDocInput,
          onSuccess: (data: any) => {
            setDataOfAllDocs((prevData) => [...prevData, data]);
          },
          onError: (error) => {
            Modal.error({
              title: 'Error',
              content: error,
            });
          },
          dispatch,
        });
      });
    }
  }, [listVersionDocs]);

  useEffect(() => {
    console.log('missionData', missionData);
    console.log('dataOfAllDocs', dataOfAllDocs);
  }, [missionData, listParticipants, dataOfAllDocs]);

  useEffect(() => {
    if (missionData && currentCheckpointData) {
      if (missionData.result) {
        const totalVotingPower = Object.values(missionData.result).reduce(
          (acc: number, voteData: any) => acc + voteData.voting_power,
          0
        );
        if (totalVotingPower >= currentCheckpointData.quorum) {
          setIsReachedQuorum(true);
        }
      }

      if (!currentCheckpointData.isEnd) {
        setListParticipants(currentCheckpointData.participation.data);
      }
    }
  }, [missionData, selectedOption]);

  return (
    <>
      {missionData && currentCheckpointData && (
        <div className='w-[1033px] flex gap-4'>
          <div className='w-2/3'>
            <div className='flex flex-col mb-10 gap-6'>
              <div className='flex gap-4'>
                {!currentCheckpointData.isEnd &&
                getTimeRemainingToEnd(currentCheckpointData.endToVote) !=
                  'expired' ? (
                  <Tag bordered={false} color='green' className='text-base '>
                    Active
                  </Tag>
                ) : (
                  <Tag bordered={false} color='default' className='text-base'>
                    Closed
                  </Tag>
                )}
                <Button
                  style={{ border: 'None', padding: '0px', boxShadow: 'None' }}
                  className='text-[#6200EE]'
                  icon={<UploadOutlined />}
                  onClick={() =>
                    navigator.clipboard
                      .writeText(window.location.href)
                      .then(() => message.success('URL copied to clipboard!'))
                      .catch((err) => {
                        console.error('Failed to copy URL: ', err);
                        message.error('Failed to copy URL');
                      })
                  }
                >
                  Share
                </Button>
              </div>
              <div className='flex items-center'>
                <Icon presetIcon='' iconUrl='' size='large' />
                <div className='flex flex-col ml-2'>
                  <p className='font-semibold text-xl	'>{missionData.m_title}</p>
                  <p>{missionData.workflow_title}</p>
                </div>
              </div>
            </div>
            <Space direction='vertical' size={16} className='w-full'>
              <Space direction='horizontal'>
                <Card className='w-[271px]'>
                  <Space direction='horizontal' size={'small'}>
                    <p>Author</p>
                    <Icon iconUrl='' presetIcon='' size='medium' />
                    <p className='w-[168px] truncate ...'>
                      {missionData.author}
                    </p>
                  </Space>
                </Card>

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
              </Space>

              <ShowDescription
                titleDescription={'Proposal content'}
                description={missionData?.m_desc}
              />
              <ShowDescription
                titleDescription={'Checkpoint description'}
                description={currentCheckpointData?.description}
                bgColor='bg-[#F6F6F6]'
              />
              {missionData?.progress && (
                <ProposalDocuments
                  titleDescription={'Proposal documents'}
                  missionData={missionData}
                  listVersionDocs={listVersionDocs}
                  dataOfAllDocs={dataOfAllDocs}
                />
              )}
              {currentCheckpointData.isEnd ||
              (currentCheckpointData.vote_machine_type === 'Snapshot' &&
                !proposal) ? null : (
                <VoteSection
                  currentCheckpointData={currentCheckpointData}
                  setOpenModalVoterInfo={setOpenModalVoterInfo}
                  onSelectedOption={onSelectedOption}
                  missionData={missionData}
                  setSubmission={setSubmission}
                  submission={submission}
                  dataOfAllDocs={dataOfAllDocs}
                  listVersionDocs={listVersionDocs}
                  proposal={proposal}
                  client={client}
                />
              )}

              {!currentCheckpointData.isEnd &&
                currentCheckpointData.vote_machine_type !== 'Snapshot' &&
                currentCheckpointData.vote_machine_type !== 'DocInput' && (
                  <Card className='p-4'>
                    <div className='flex flex-col gap-4'>
                      <p className='text-xl font-medium'>Votes</p>
                      <div className='flex'>
                        <p className='w-8/12'>Identity</p>
                        <p className='w-4/12 text-right'>Vote</p>
                      </div>
                      {missionData.vote_record &&
                        missionData.vote_record.map(
                          (record: any, recordIndex: number) => {
                            return (
                              <div className='flex mb-4' key={recordIndex}>
                                <div className='w-8/12 flex items-center gap-2'>
                                  <Icon
                                    iconUrl=''
                                    presetIcon=''
                                    size='medium'
                                  />
                                  <p>{record.identify}</p>
                                </div>
                                {record.option.map(
                                  (option: any, optionIndex: number) => {
                                    const voteOption =
                                      option === '-1'
                                        ? 'Abstain'
                                        : currentCheckpointData.data.options[
                                            parseInt(option)
                                          ];
                                    return (
                                      <p
                                        key={optionIndex}
                                        className='w-4/12 text-right'
                                      >
                                        {voteOption}
                                      </p>
                                    );
                                  }
                                )}
                              </div>
                            );
                          }
                        )}
                    </div>
                    {/* <div className='w-full flex justify-center items-center'>
                  <Button className='mt-4' icon={<ReloadOutlined />}>
                    View More
                  </Button>
                </div> */}
                  </Card>
                )}
            </Space>
          </div>
          <div className='flex-1 flex flex-col gap-4'>
            {missionData?.progress && (
              <MissionProgress missionData={missionData} />
            )}

            {missionData.result || proposal ? (
              <Card className=''>
                <p className='mb-6 text-base font-semibold'>Voting results</p>

                {currentCheckpointData.data.options.map(
                  (option: any, index: any) => {
                    // still calculate voting_power of Abstain but not show in result
                    if (option === 'Abstain') {
                      return <div key={-1}></div>;
                    }
                    let totalVotingPower = 0;
                    let percentage = 0;

                    if (!proposal) {
                      totalVotingPower = Object.values(
                        missionData.result
                      ).reduce(
                        (acc: number, voteData: any) =>
                          acc + voteData.voting_power,
                        0
                      );

                      if (currentCheckpointData.quorum >= totalVotingPower) {
                        percentage =
                          (missionData.result[index]?.voting_power /
                            currentCheckpointData.quorum) *
                          100;
                      } else {
                        percentage =
                          (missionData.result[index]?.voting_power /
                            totalVotingPower) *
                          100;
                      }
                      percentage = parseFloat(percentage.toFixed(2));
                    } else {
                      totalVotingPower = proposal?.scores_total;
                      percentage = parseFloat(
                        (proposal?.scores[index] / totalVotingPower).toFixed(2)
                      );
                    }

                    return (
                      <div key={index} className='flex flex-col gap-2'>
                        <p className='text-base font-semibold'>{option}</p>
                        <p className='text-base'>
                          {proposal ? 0 : missionData.result[option]} votes
                        </p>
                        <Progress percent={percentage} size='small' />
                      </div>
                    );
                  }
                )}

                {isReachedQuorum ? (
                  <div className='w-full flex justify-center items-center mt-2'>
                    <Button className='w-full bg-[#EAF6EE] text-[#29A259]'>
                      Reached required quorum
                    </Button>
                  </div>
                ) : (
                  <div className='w-full flex justify-center items-center mt-2'>
                    <Button className='w-full'>Not reached quorum</Button>
                  </div>
                )}
              </Card>
            ) : null}

            {currentCheckpointData.isEnd ||
            (currentCheckpointData.vote_machine_type === 'Snapshot' &&
              !proposal) ? null : (
              <>
                <Card className=''>
                  <p className='mb-4 text-base font-semibold'>
                    Rules & conditions
                  </p>
                  <div className='flex flex-col gap-2'>
                    <div className='flex justify-between'>
                      <p className='text-base '>Start time</p>
                      <p className='text-base font-semibold'>
                        {proposal
                          ? getTimeElapsedSinceStart(
                              moment(proposal.created).format()
                            )
                          : getTimeElapsedSinceStart(missionData.startToVote)}
                      </p>
                    </div>
                    <p className='text-right'>
                      {proposal
                        ? formatDate(moment(proposal.created).format())
                        : formatDate(missionData.startToVote)}
                    </p>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <div className='flex justify-between'>
                      <p className='text-base '>Remaining duration</p>
                      <p className='text-base font-semibold'>
                        {proposal
                          ? getTimeRemainingToEnd(moment(proposal.end).format())
                          : getTimeRemainingToEnd(
                              currentCheckpointData.endToVote
                            )}
                      </p>
                    </div>

                    {currentCheckpointData.isEnd ? (
                      <></>
                    ) : (
                      <p className='text-right'>
                        {formatDate(currentCheckpointData.endToVote)}
                      </p>
                    )}
                  </div>

                  {proposal ? null : (
                    <>
                      <hr className='w-full my-4' />
                      <div className='flex justify-between'>
                        <p className='text-base '>Who can vote</p>
                        <p
                          className='text-base font-semibold text-[#6200EE] cursor-pointer'
                          onClick={() => setOpenModalListParticipants(true)}
                        >
                          View details
                        </p>
                      </div>
                      <hr className='w-full my-4' />
                      {currentCheckpointData?.data?.threshold ? (
                        <div>
                          <div className='flex justify-between'>
                            <p className='text-base '>Threshold counted by</p>
                            <p className='text-base font-semibold'>
                              Total votes made
                            </p>
                          </div>
                          <div className='flex justify-between'>
                            <p className='text-base '>Threshold</p>
                            <p className='text-base font-semibold'>
                              {currentCheckpointData?.data?.threshold}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className='flex justify-between'>
                        <p className='text-base '>Quorum</p>
                        <p className='text-base font-semibold'>
                          {currentCheckpointData.quorum} votes
                        </p>
                      </div>
                    </>
                  )}
                </Card>
              </>
            )}
          </div>
        </div>
      )}
      <ModalListParticipants
        open={openModalListParticipants}
        onClose={() => setOpenModalListParticipants(false)}
        listParticipants={listParticipants}
      />

      <ModalVoterInfo
        option={selectedOption === -1 ? [-1] : [selectedOption - 1]}
        open={openModalVoterInfo}
        onClose={() => setOpenModalVoterInfo(false)}
        missionId={missionId}
        listParticipants={listParticipants}
        submission={submission}
        currentCheckpointData={currentCheckpointData}
      />
    </>
  );
};

export default MissionVotingDetail;
