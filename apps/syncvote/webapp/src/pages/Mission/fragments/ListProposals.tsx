import React, { useEffect } from 'react';
import { Icon } from 'icon';
import { useGetDataHook, createIdString } from 'utils';
import { config } from '@dal/config';
import { Space, Button } from 'antd';
import { ConsoleSqlOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import { useNavigate } from 'react-router-dom';

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
          <p className='w-[50%]'>Proposal</p>
          <p className='w-[25%]'>{type === 'owner' ? 'status' : 'stage'}</p>
          <p className='w-[25%]'>{type === 'all' ? 'Voting ends on' : ''}</p>
        </div>
        <div className='flex flex-col gap-2'>
          {filteredProposals.length === 0 ? (
            <div>
              <Empty />
            </div>
          ) : (
            filteredProposals.map((proposal, index) => (
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
                      <p>{proposal?.title}</p>
                      <p>{`${proposal?.org_title} progress`}</p>
                    </div>
                  </div>
                  <p className='w-[25%]'>Unknow Data</p>
                  <p className='w-[25%]'>Unknow Data</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProposals;
