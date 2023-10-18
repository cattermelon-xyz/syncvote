import { useNavigate, useParams } from 'react-router-dom';
import LogoSyncVote from '@assets/icons/svg-icons/LogoSyncVote';
import AvatarAndNoti from '@layout/fragments/AvatarAndNoti';
import { Button, Space } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useContext, useState } from 'react';
import { AuthContext } from '@layout/context/AuthContext';
import { extractIdFromIdString, useGetDataHook } from 'utils';
import { config } from '@dal/config';
import ModalWorkflowFromTemplate from '@fragments/ModalWorkflowFromTemplate';

function Header() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { templateIdString } = useParams();
  const id = extractIdFromIdString(templateIdString);

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const templates = useGetDataHook({
    configInfo: config.queryTemplate,
  }).data;

  const template = templates.find((tmpl: any) => tmpl.id === id);

  const { isAuth } = useContext(AuthContext);
  return (
    <>
      <ModalWorkflowFromTemplate
        template={template}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
      <div
        className={`flex justify-between items-center px-[32px] md:px-p_1 h-20 w-full border-b-b_1 border-gray-normal font-sans z-20 bg-white drop-shadow-md`}
      >
        <Space
          className='flex items-center'
          direction='horizontal'
          size='middle'
        >
          <div
            onClick={() => {
              navigate('/');
            }}
          >
            <div className='flex items-center cursor-pointer gap-2'>
              <LogoSyncVote />
            </div>
          </div>
        </Space>
        <Space
          className='flex items-center justify-end'
          direction='horizontal'
          size='small'
        >
          <Button
            type='primary'
            icon={<CopyOutlined />}
            disabled={!isAuth}
            title={!isAuth ? 'Login to create workflow' : ''}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Duplicate this workflow
          </Button>
          <AvatarAndNoti user={user} />
        </Space>
      </div>
    </>
  );
}

export default Header;
