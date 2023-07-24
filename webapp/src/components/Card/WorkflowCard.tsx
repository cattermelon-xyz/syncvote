import React from 'react';
import { Avatar, Card } from 'antd';
import './AntCard.css';
import { useNavigate } from 'react-router-dom';
import { createIdString } from '@utils/helpers';
import { EllipsisOutlined } from '@ant-design/icons';
import { getImageUrl } from '@utils/helpers';
import Banner from '@components/Banner/Banner';

interface WorkflowCardProps {
  dataWorkflow: any;
  isListHome?: boolean;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  dataWorkflow,
  isListHome,
}) => {
  const navigate = useNavigate();
  return (
    <Card
      hoverable={true}
      style={{ position: 'relative' }}
      className='w-[256px] h-[150px] relative rounded-lg'
      onClick={() => {
        if (isListHome) {
          navigate(
            `/public/${createIdString(
              dataWorkflow?.infoOrg.title,
              dataWorkflow?.owner_org_id.toString()
            )}/${createIdString(
              dataWorkflow?.title,
              dataWorkflow?.id
            )}/${dataWorkflow?.versions[0].id.toString()}`
          );
        } else {
          navigate(
            `/${createIdString(
              dataWorkflow?.org_title,
              dataWorkflow?.owner_org_id.toString()
            )}/${createIdString(
              dataWorkflow?.title,
              dataWorkflow?.id
            )}/${dataWorkflow?.versions[0].id.toString()}`
          );
        }
      }}
    >
      {
        <Banner
          bannerUrl={dataWorkflow.banner_url}
          className='w-full h-[86px] rounded-lg m-0'
          size='small'
        />
      }
      {dataWorkflow.icon_url ? (
        <Avatar
          src={getImageUrl({
            filePath: dataWorkflow?.icon_url?.replace('preset:', ''),
            isPreset: dataWorkflow?.icon_url?.indexOf('preset:') === 0,
            type: 'icon',
          })}
          style={{
            position: 'absolute',
            top: '78px',
            left: '24px',
            zIndex: 10,
          }}
        />
      ) : (
        <Avatar
          shape='circle'
          style={{
            backgroundColor: '#D3D3D3',
            position: 'absolute',
            top: '78px',
            left: '24px',
            zIndex: 10,
          }}
        />
      )}
      <p className='text-xs text-[#252422] mt-[18px] mb-2 truncate'>
        {dataWorkflow.title}
      </p>
      {/* <div className='flex justify-between'>
        <div className='flex'>
          {dataWorkflow?.owner_workflow_icon_url ? (
            <Avatar
              src={getImageUrl({
                filePath: dataWorkflow?.owner_workflow_icon_url?.replace(
                  'preset:',
                  ''
                ),
                isPreset:
                  dataWorkflow?.owner_workflow_icon_url?.indexOf('preset:') ===
                  0,
                type: 'icon',
              })}
              className='w-[16px] h-[16px]'
            />
          ) : (
            <Avatar
              shape='circle'
              className='w-[16px] h-[16px]'
              style={{
                backgroundColor: '#D3D3D3',
                position: 'absolute',
              }}
            />
          )}
          {dataWorkflow?.owner_workflow_name ? (
            <p className='text-xs text-[#575655] self-center ml-[4px]'>
              {dataWorkflow?.owner_workflow_name}
            </p>
          ) : (
            <p></p>
          )}
        </div>
        <EllipsisOutlined style={{ fontSize: '16px', color: '#000000' }} />
      </div> */}
    </Card>
  );
};

export default WorkflowCard;
