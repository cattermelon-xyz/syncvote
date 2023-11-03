import React, { useEffect, useState } from 'react';
import { Icon } from 'icon';
import { useGetDataHook, createIdString } from 'utils';
import { config } from '@dal/config';
import { Space, Button, Tag } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';
import { Empty, Popover } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ThunderboltOutlined, EditOutlined } from '@ant-design/icons';
import { formatDate } from '@utils/helpers';
import { CreateProposalModal } from '@fragments/CreateProposalModal';
import { EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import ModalDeleteMission from './ModalDeleteMission';

interface Props {
  title?: string;
  listProposals: any[];
  type?: string;
  isExcludeDraftMission?: boolean;
}

const ListProposals: React.FC<Props> = ({
  listProposals,
  title,
  type,
  isExcludeDraftMission,
}) => {
  const [modalOfProposalId, setModalOfProposalId] = useState<string | null>(
    null
  );
  const [missionIdDelete, setMissionIdDelete] = useState<string | null>(
    null
  );
  const [workflowOfProposalId, setWorkflowOfProposalId] = useState<any>();
  const [wfversionOfProposalId, setWfversionOfProposalId] = useState<any>();
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);
  const [isPopoverVisible, setIsPopoverVisible] = useState(true);

  const actions = [
    {
      icon: <DeleteOutlined />,
      text: 'Delete',
      action: (e: any) => {
        e.stopPropagation();
        setIsPopoverVisible(false);
        setIsDeleteModalVisible(true);
      },
      visible: true,
    },
  ];

  const PopoverContent: React.FC = () => (
    <Space direction='vertical' size='middle' className='w-[196px]'>
      {actions.map(({ icon, text, action, visible }, index) =>
        visible ? (
          <div
            key={index}
            className='flex gap-2 cursor-pointer hover:text-violet-500'
            onClick={action}
          >
            {icon}
            {text}
          </div>
        ) : null
      )}
    </Space>
  );

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  useEffect(() => {
    const dataOfAproposal = listProposals.find(
      (proposal) => proposal.id === modalOfProposalId
    );
    setWorkflowOfProposalId({
      icon_url: dataOfAproposal?.mission_icon_url,
      id: dataOfAproposal?.workflow_id,
      title: dataOfAproposal?.workflow_title,
    });
    setWfversionOfProposalId({
      id: dataOfAproposal?.workflow_version_id,
      data: dataOfAproposal?.workflow_version_data,
    });

  }, [modalOfProposalId]);


  const navigate = useNavigate();

  const handleNavigate = (proposal: any) => {
    const pathOrg = createIdString(
      proposal.org_title,
      proposal.org_id.toString()
    );
    const pathMission = createIdString(proposal.title, proposal.id.toString());
    navigate(`/${pathOrg}/${pathMission}`);
  };

  useEffect(() => {
    const filteredData = isExcludeDraftMission
      ? listProposals.filter((proposal) => proposal.status !== 'DRAFT')
      : listProposals;
    setFilteredProposals(filteredData);
  }, [listProposals]);

  return (
    <>
      <div>
        <div className='flex mb-6 mt-2 justify-between'>
          <Space direction='horizontal' className='items-center mx-3'>
            {title ? (
              <>
                <p>{title}</p>
                <Button
                  style={{
                    border: 'None',
                    padding: '2px',
                    color: '#6200EE',
                    borderRadius: '50%',
                  }}
                  className='w-[25px] h-[25px] bg-[#F4F0FA]'
                >
                  {listProposals.length}
                </Button>
              </>
            ) : (
              <div></div>
            )}
          </Space>
          <Space>
            <Button
              style={{ border: 'None', padding: '5px' }}
              className='w-[44px] bg-[#F6F6F6]'
            >
              <SortAscendingOutlined
                style={{ fontSize: '20px', color: '#6200EE' }}
              />
            </Button>
          </Space>
        </div>
        <div
          className='rounded-lg px-3 py-6 max-h-[480px] overflow-y-auto'
          style={{ border: '1px solid #E3E3E2' }}
        >
          <div className='flex mb-4'>
            <p className='w-[50%] text-[#898988]'>Proposal</p>
            <p className='w-[25%] text-[#898988]'>
              {type === 'owner' ? 'status' : 'stage'}
            </p>
            <p className='w-[25%] text-[#898988] text-end'>
              {type === 'all' ? 'Due date' : ''}
            </p>
          </div>
          <div className='flex flex-col gap-2'>
            {filteredProposals.length === 0 ? (
              <div>
                <Empty />
              </div>
            ) : (
              filteredProposals.map((proposal, index) => {
                const currentTimestamp = new Date().toISOString();
                const isInTimeLock = proposal?.startToVote > currentTimestamp;
                let endToVote;
                if (proposal?.duration && proposal?.startToVote) {
                  const startToVoteDate = new Date(proposal?.startToVote);
                  const endToVoteDate = new Date(
                    startToVoteDate.getTime() + proposal?.duration * 1000
                  );
                  endToVote = endToVoteDate.toISOString();
                }
                return (
                  <div
                    key={index}
                    onClick={
                      proposal?.status !== 'DRAFT'
                        ? () => {
                            handleNavigate(proposal);
                          }
                        : () => {}
                    }
                    className={
                      proposal?.status !== 'DRAFT' ? 'cursor-pointer' : ''
                    }
                  >
                    <div className='flex items-center'>
                      <div className='w-[50%] flex'>
                        <Icon
                          presetIcon={presetIcons}
                          iconUrl={proposal?.org_icon_url}
                          size='large'
                        />
                        <div className='flex flex-col ml-2'>
                          <p className='text-base'>{proposal?.title}</p>
                          <p className='text-[13px] text-[#898988]'>
                            {proposal.workflow_title}
                          </p>
                        </div>
                      </div>
                      <p className='w-[25%]'>
                        {proposal?.status === 'DRAFT' ? (
                          <Tag color='default'>draft</Tag>
                        ) : proposal?.status === 'STOPPED' ? (
                          <Tag color='default'>close</Tag>
                        ) : isInTimeLock ? (
                          <Tag color='orange'>In time-lock</Tag>
                        ) : proposal?.vote_machine_type === 'DocInput' ? (
                          <Tag color='orange'>Update document</Tag>
                        ) : (
                          <Tag color='green'>
                            {proposal?.checkpoint_title
                              ? proposal?.checkpoint_title
                              : 'N/A'}
                          </Tag>
                        )}
                      </p>

                      <p className='w-[25%] text-end'>
                        {proposal?.status === 'DRAFT' && type === 'owner' ? (
                          <div className='flex gap-4 justify-end'>
                            <Button
                              icon={<ThunderboltOutlined />}
                              onClick={(event) => {
                                event.stopPropagation();
                                setModalOfProposalId(proposal?.id);
                              }}
                            >
                              Publish
                            </Button>
                            {isPopoverVisible && (
                              <Popover
                                placement='bottom'
                                content={<PopoverContent />}
                                trigger='click'
                              >
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMissionIdDelete(proposal?.id);
                                  }}
                                  className='flex justify-center items-center'
                                >
                                  <EllipsisOutlined
                                    style={{
                                      fontSize: '16px',
                                      color: '#000000',
                                    }}
                                  />
                                </div>
                              </Popover>
                            )}
                          </div>
                        ) : proposal?.status === 'STOPPED' ? (
                          <p>{formatDate(proposal?.startToVote, true)}</p>
                        ) : isInTimeLock ? (
                          <p className='italic text-[#898988]'>
                            {`until ${formatDate(proposal?.startToVote)}`}
                          </p>
                        ) : proposal?.vote_machine_type === 'DocInput' &&
                          type === 'owner' ? (
                          <Button icon={<EditOutlined />}>Update</Button>
                        ) : (
                          <p>{endToVote ? formatDate(endToVote) : <></>}</p>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {workflowOfProposalId && (
        <CreateProposalModal
          open={!!modalOfProposalId}
          onCancel={() => setModalOfProposalId(null)}
          workflow={workflowOfProposalId}
          workflowVersion={wfversionOfProposalId}
          missionId={Number(modalOfProposalId)}
          onUpdateProposals={setFilteredProposals}
        />
      )}
      <ModalDeleteMission
        visible={isDeleteModalVisible}
        onClose={() => {
          setIsDeleteModalVisible(false);
          setIsPopoverVisible(true);
        }}
        missionIdDelete={Number(missionIdDelete)}
        onUpdateProposals={setFilteredProposals}
      />
    </>
  );
};

export default ListProposals;
