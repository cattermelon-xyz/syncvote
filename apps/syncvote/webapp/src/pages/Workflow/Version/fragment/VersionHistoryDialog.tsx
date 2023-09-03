import { CiCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import {Icon} from 'icon';
import { queryVersionHistory } from '@middleware/data';
import { Divider, Modal, Space } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type VersionHistoryDialogProps = {
  workflow: any;
  visible: boolean;
  onCancel: (visible: any) => void;
};

const VersionHistoryDialog = (props: VersionHistoryDialogProps) => {
  const { workflow, visible, onCancel } = props;
  const [historicalVersions, setHistoricalVersions] = useState([]);
  const dispatch = useDispatch();
  const { presetIcons } = useSelector((state: any) => state.ui);
  useEffect(() => {
    const versionId = workflow?.workflow_version[0]?.id;
    if (versionId) {
      queryVersionHistory({
        versionId: versionId,
        dispatch,
        onSuccess: (data: any) => {
          setHistoricalVersions(data);
        },
        onError: (err: any) => {},
      });
    }
  }, [workflow]);
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      title={
        <Space direction='horizontal' size='small'>
          <ClockCircleOutlined />
          History
        </Space>
      }
    >
      {historicalVersions?.length === 0 ? 'No history' : null}
      <Space direction='vertical' size='large' className='mt-4'>
        {historicalVersions?.map((version: any) => {
          return (
            <div className='flex flex-col gap-0' key={version.id}>
              <Space direction='horizontal' className='flex items-center'>
                <div className='w-[14px] h-[14px] rounded-full border-2 border-violet-500'></div>
                <div>{moment(version.created_at).fromNow()}</div>
              </Space>
              <Space direction='horizontal' className='flex items-center'>
                <Divider type='vertical' />
                <Icon
                  presetIcon={presetIcons}
                  iconUrl={version.icon_url}
                  size='small'
                />
                <div>{version.full_name}</div>
              </Space>
            </div>
          );
        })}
      </Space>
    </Modal>
  );
};

export default VersionHistoryDialog;
