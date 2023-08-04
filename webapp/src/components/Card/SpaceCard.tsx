import React, { useState } from 'react';
import { Avatar, Card, Popover, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createIdString } from '@utils/helpers';
import { EllipsisOutlined } from '@ant-design/icons';
import { getImageUrl } from '@utils/helpers';
import {
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import ModalInviteOfSpaceCard from '@pages/Organization/fragments/ModalInviteOfSpaceCard';
import ModalDeleteSpace from '@pages/Organization/fragments/ModalDeleteSpace';
import ModalChangeWorkSpace from '@pages/Organization/fragments/ModalChangeWorkSpace';
import { useLocation } from 'react-router-dom';

interface SpaceCardProps {
  dataSpace: any;
  isMySpace?: boolean;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ dataSpace, isMySpace }) => {
  const location = useLocation();
  const isSharedWorkspacesRoute = location.pathname === '/shared-workspaces';

  const actions = [
    {
      icon: <ShareAltOutlined />,
      text: 'Invite',
      action: (e: any) => {
        e.stopPropagation();
        setIsPopoverVisible(false);
        setIsInviteModalVisible(true);
      },
      visible: !isSharedWorkspacesRoute,
    },
    {
      icon: <EditOutlined />,
      text: 'Change info',
      action: (e: any) => {
        e.stopPropagation();
        setIsPopoverVisible(false);
        setIsChangeInfoModalVisible(true);
      },
      visible: true,
    },
    {
      icon: <DeleteOutlined />,
      text: 'Delete',
      action: (e: any) => {
        e.stopPropagation();
        setIsPopoverVisible(false);
        setIsDeleteModalVisible(true);
      },
      visible: !isSharedWorkspacesRoute,
    },
  ];

  const PopoverContent: React.FC = () => (
    <Space direction='vertical' size='middle' className='w-[196px]'>
      {actions.map(({ icon, text, action, visible }, index) =>
        visible ? (
          <div
            key={index}
            className='flex gap-2 cursor-pointer'
            onClick={action}
          >
            {icon}
            {text}
          </div>
        ) : null
      )}
    </Space>
  );

  const [isPopoverVisible, setIsPopoverVisible] = useState(true);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isChangeInfoModalVisible, setIsChangeInfoModalVisible] =
    useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Card
        className='w-[189px] bg-white rounded-xl border border-neutral-200 flex-col justify-start items-start gap-2'
        onClick={() => {
          navigate(
            `/${createIdString(dataSpace.title, dataSpace.id.toString())}`,
            {
              state: { dataSpace },
            }
          );
        }}
        hoverable={true}
      >
        <div>
          {dataSpace?.icon_url ? (
            <Avatar
              shape='circle'
              src={getImageUrl({
                filePath: dataSpace?.icon_url?.replace('preset:', ''),
                isPreset: dataSpace?.icon_url?.indexOf('preset:') === 0,
                type: 'icon',
              })}
              className='w-9 h-9 mb-2 border-1 border-gray-300'
            />
          ) : (
            <Avatar
              shape='circle'
              className='w-9 h-9 mb-2'
              style={{
                backgroundColor: '#D3D3D3',
              }}
            />
          )}
        </div>
        <div className='justify-start items-center gap-2'>
          <div className='flex-col justify-start items-start gap-1'>
            <div className='text-neutral-800 text-base font-medium truncate'>
              {dataSpace.title ? dataSpace.title : 'Null title'}
            </div>
            <div className='flex justify-between'>
              <div className='text-zinc-500 text-sm font-medium'>
                {dataSpace.workflows?.length} workflows
              </div>
              {isPopoverVisible && (
                <Popover
                  placement='bottom'
                  content={<PopoverContent />}
                  trigger='click'
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <EllipsisOutlined
                      style={{ fontSize: '16px', color: '#000000' }}
                    />
                  </div>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </Card>
      <ModalInviteOfSpaceCard
        visible={isInviteModalVisible}
        onClose={() => {
          setIsInviteModalVisible(false);
          setIsPopoverVisible(true);
        }}
        dataSpace={dataSpace}
      />
      <ModalDeleteSpace
        visible={isDeleteModalVisible}
        onClose={() => {
          setIsDeleteModalVisible(false);
          setIsPopoverVisible(true);
        }}
        dataSpace={dataSpace}
      />
      <ModalChangeWorkSpace
        visible={isChangeInfoModalVisible}
        onClose={() => {
          setIsChangeInfoModalVisible(false);
          setIsPopoverVisible(true);
        }}
        dataSpace={dataSpace}
      />
    </>
  );
};

export default SpaceCard;
