import React, { useEffect } from 'react';
import { Icon } from 'icon';
import { useGetDataHook, createIdString } from 'utils';
import { config } from '@dal/config';
import { Space, Button, Tag } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ThunderboltOutlined, EditOutlined } from '@ant-design/icons';
import { formatDate } from '@utils/helpers';

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
  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  useEffect(() => {
    console.log('listProposals', listProposals);
  }, [listProposals]);

  const navigate = useNavigate();

  const handleNavigate = (proposal: any) => {
    const pathOrg = createIdString(
      proposal.org_title,
      proposal.org_id.toString()
    );
    const pathMission = createIdString(proposal.title, proposal.id.toString());
    navigate(`/${pathOrg}/${pathMission}`);
  };

  const filteredProposals = isExcludeDraftMission
    ? listProposals.filter((proposal) => proposal.status !== 'DRAFT')
    : listProposals;

  return (
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
              const isInTimeLock =
                proposal?.startToVote > currentTimestamp;
              let endToVote;
              if (
                proposal?.duration &&
                proposal?.startToVote
              ) {
                const startToVoteDate = new Date(
                  proposal?.startToVote
                );
                const endToVoteDate = new Date(
                  startToVoteDate.getTime() +
                    proposal?.duration * 1000
                );
                endToVote = endToVoteDate.toISOString();
              }
              return (
                <div
                  key={index}
                  onClick={() => {
                    handleNavigate(proposal);
                  }}
                  className='cursor-pointer'
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
                      ) : proposal?.vote_machine_type ===
                        'DocInput' ? (
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
                        <Button icon={<ThunderboltOutlined />}>Publish</Button>
                      ) : proposal?.status === 'STOPPED' ? (
                        <p>
                          {formatDate(proposal?.startToVote, true)}
                        </p>
                      ) : isInTimeLock ? (
                        <p className='italic text-[#898988]'>
                          {`until ${formatDate(
                            proposal?.startToVote
                          )}`}
                        </p>
                      ) : proposal?.vote_machine_type ===
                          'DocInput' && type === 'owner' ? (
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
  );
};

export default ListProposals;
