import React from 'react';
import { Card, Space } from 'antd';
import { Icon } from 'icon';
import { createIdString, useGetDataHook, useSetData } from 'utils';
import { config } from '@dal/config';

interface Props {
  orgData: any;
}

const OrgCard: React.FC<Props> = ({ orgData }) => {
  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  return (
    <Card
      className='w-[189px] h-[180px] bg-white rounded-xl border border-neutral-200 flex justify-center items-center gap-2'
      hoverable={true}
    >
      <Space direction='vertical' style={{ alignItems: 'center' }}>
        {presetIcons && (
          <Icon
            presetIcon={presetIcons}
            iconUrl={orgData.icon_url}
            size='large'
            className=''
          />
        )}
        <div className='text-neutral-800 text-base font-medium hover:text-violet-500 max-w-[157px] truncate ...'>
          {orgData.title ? orgData.title : 'Untitled'}
        </div>
      </Space>
    </Card>
  );
};

export default OrgCard;
