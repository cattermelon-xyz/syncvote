import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Button, Input, Modal, Space } from 'antd';
import { CollapsiblePanel } from 'directed-graph';
import { useState } from 'react';

const VariableDialog = ({
  open,
  setShowDialog,
  setVersion,
  version,
}: {
  open: any;
  setShowDialog: any;
  setVersion: any;
  version: any;
}) => {
  const [variableName, setVariableName] = useState('');
  return (
    <Modal
      title='New Variable'
      open={open}
      onCancel={() => {
        setVariableName('');
        setShowDialog(false);
      }}
      onOk={() => {
        setVariableName('');
        setShowDialog(false);
        const newVersion = { ...version };
        const newVariables = newVersion.data?.variables
          ? [...newVersion.data?.variables]
          : [];
        setVersion({
          ...newVersion,
          data: {
            ...newVersion.data,
            variables: [...newVariables, variableName],
          },
        });
      }}
    >
      <Input
        placeholder='Variable name'
        value={variableName}
        onChange={(e) => setVariableName(e.target.value)}
      />
    </Modal>
  );
};

const VariableList = ({
  version,
  setVersion,
}: {
  version: any;
  setVersion: any;
}) => {
  const variables = version.data?.variables ? [...version.data?.variables] : [];
  const [showDialog, setShowDialog] = useState(false);
  return (
    <CollapsiblePanel
      title={
        <span>
          <InfoCircleOutlined title='Raw data kept on-chain' className='mr-1' />
          Variable
        </span>
      }
      className='w-full'
    >
      <VariableDialog
        open={showDialog}
        setShowDialog={setShowDialog}
        setVersion={setVersion}
        version={version}
      />
      <Space className='w-full' size='middle' direction='vertical'>
        <div className='w-full flex items-center justify-between'>
          <Button icon={<PlusOutlined />} onClick={() => setShowDialog(true)}>
            New Variable
          </Button>
        </div>
        <Space direction='vertical' size='small'>
          {variables.map((v: any, idx: number) => {
            const newVariables = [...variables];
            return (
              <div key={v} className='flex flex-row items-center gap-2'>
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    newVariables.splice(idx, 1);
                    setVersion({
                      ...version,
                      data: {
                        ...version.data,
                        variables: newVariables,
                      },
                    });
                  }}
                  danger
                />
                <div>{v}</div>
              </div>
            );
          })}
        </Space>
      </Space>
    </CollapsiblePanel>
  );
};

export default VariableList;
