import { PlusOutlined } from '@ant-design/icons';
import { config } from '@dal/config';
import { queryWorkflowVersionData } from '@dal/data';
import { L } from '@utils/locales/L';
import { Modal, Radio, RadioChangeEvent, Space } from 'antd';
import Icon from 'icon/src/Icon';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createIdString, useGetDataHook, useSetData } from 'utils';
// TODO: should merge with DuplicationWorkflowModal to avoid code duplication
const ModalWorkflowFromTemplate = ({
  template,
  open,
  onClose,
}: {
  template: any;
  open: boolean;
  onClose: any;
}) => {
  const modalTitle = `Duplicate "${template?.title}"`;

  const orgs = useGetDataHook({
    configInfo: config.queryOrgs,
  }).data;

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;


  const orgs = useGetDataHook({
    configInfo: config.queryOrgs,
  }).data;

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const dispatch = useDispatch();
  const handleOk = async () => {
    const org = orgs.find((org: any) => org.id === orgId);
    const orgIdString = createIdString(`${org.title}`, `${org.id}`);
    onClose();
    const { data, error } = await queryCurrentTemplateVersion({
      dispatch,
      current_version_id: template?.current_version_id,
    });

    if (data) {
      const versionData = data?.data;
      const props = {
        title: 'Duplicate of ' + template?.title,
        desc: template?.desc,
        owner_org_id: orgId,
        emptyStage: versionData,
        iconUrl: template.icon_url,
        authority: user.id,
      };

      await useSetData({
        params: props,
        configInfo: config.insertWorkflowAndVersion,
        dispatch: dispatch,
        onError: (error) => {
          Modal.error({ content: error.message });
        },
        onSuccess: (data) => {
          const { versions, insertedId } = data;
          navigate(`/${orgIdString}/${insertedId}/${versions[0].id}`);
        },
      });

      // insertWorkflowAndVersion({
      //   dispatch: dispatch,
      //   props: props,
      //   onError: (error) => {
      //     Modal.error({ content: error.message });
      //   },
      //   onSuccess: (versions, insertedId) => {
      //     navigate(`/${orgIdString}/${insertedId}/${versions[0].id}`);
      //   },
      // });
    } else {
      Modal.error({ content: error?.message });
    }
  };
  const [orgId, setOrgId] = useState(null);
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const onChange = (e: RadioChangeEvent) => {
    setOrgId(e.target.value);
  };
  return (
    <Modal
      title={modalTitle}
      onOk={handleOk}
      open={open}
      onCancel={onClose}
      okText='Duplicate'
      okButtonProps={{ disabled: orgId === null }}
      cancelButtonProps={{ style: { display: 'none' } }}
      className='create-new'
    >
      <Space className='flex'>
        <div style={{ color: '#575655' }} className='text-sm not-italic	mb-3'>
          Select a workspace to contain your new workflow{' '}
        </div>
      </Space>

      <Space className='h-60 w-full overflow-y-scroll' direction='vertical'>
        <Radio.Group onChange={onChange} value={orgId} className='w-full'>
          {orgs
            .filter((org: any) => org.role === 'ADMIN')
            .map((org: any, index: any) => (
              <div
                className='flex h-12 items-center radio'
                key={index}
                style={{ backgroundColor: org.id === orgId ? '#f6f6f6' : '' }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                {hovered === index || org.id === orgId ? (
                  <Space className='p-3'>
                    <Radio value={org.id} className='w-6 h-6' />
                    <div className='text-base'>{org?.title}</div>
                  </Space>
                ) : (
                  <Space className='p-3'>
                    <Icon
                      presetIcon={[]}
                      iconUrl={org.icon_url ? org.icon_url : ''}
                      size='medium'
                    />
                    <div className='ml-2 text-base'>{org?.title}</div>
                  </Space>
                )}
              </div>
            ))}
        </Radio.Group>
      </Space>

      <Space className='flex'>
        <a
          className='p-4'
          style={{ color: '#6d28d9' }}
          onClick={() => {
            navigate('/?action=new-workspace');
          }}
        >
          <PlusOutlined /> {L('createANewSpace')}
        </a>
      </Space>
    </Modal>
  );
};

export default ModalWorkflowFromTemplate;
