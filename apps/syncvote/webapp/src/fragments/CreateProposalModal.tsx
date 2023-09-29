import { Button, Input, Modal, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { IDoc, emptyStage } from 'directed-graph';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TextEditor } from 'rich-text-editor';
import { useGetDataHook } from 'utils';
import { config } from '@dal/config';
import { createMission, updateMission } from '@axios/createMission';
import { queryAMission } from '@dal/data';

interface CreateProposalModalProps {
  open: boolean;
  workflow: any;
  onCancel: () => void;
  workflowVersion: any;
  missionId?: number;
}

export const CreateProposalModal = ({
  open,
  onCancel,
  workflow,
  workflowVersion,
  missionId = -1,
}: CreateProposalModalProps) => {
  const dispatch = useDispatch();
  const [mission, setMission] = useState<any>({});
  const [name, setName] = useState('');
  const [status, setStatus] = useState('DRAFT');

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const data = workflowVersion?.data || emptyStage;

  const [isWarning, setIsWarning] = useState(false);

  const [desc, setDesc] = useState<any>('');

  const root_docs = data.checkpoints[0].data.docs || [];
  let docs: IDoc[] = data.docs || [];

  const root_doc_ids = root_docs.map((doc: any) => doc.id);
  const filtered_docs = docs.filter((doc) => root_doc_ids.includes(doc.id));

  const { orgIdString, workflowIdString, versionIdString } = useParams();
  const [value, setValue] = useState<string>();
  const [optionDocs, setOptionDocs] = useState<any>([]);

  useEffect(() => {
    if (docs) {
      const optionDocs = filtered_docs.map((doc) => ({
        key: doc.id,
        label: <div className='flex items-center'>{doc.title}</div>,
        value: doc.id,
        desc: doc.template,
      }));

      setOptionDocs(optionDocs);
    }
    if (missionId) {
      queryAMission({
        missionId: missionId,
        onLoad: (data: any) => {
          const mission = data[0];
          setMission(mission);
          setName(mission.title);
          setDesc(mission.desc);
        },
        dispatch,
      });
    }
  }, []);

  const handleClick = async (kind: string) => {
    if (!name) {
      setIsWarning(true);
      setTimeout(() => {
        setIsWarning(false);
      }, 2000);
    } else {
      // create mission
      if (kind === 'Edit') {
        let missionData = {
          status: status,
          title: name,
          desc: desc,
        };

        await updateMission({
          missionId: missionId,
          missionData: missionData,
          workflowVersion: workflowVersion,
          onSuccess: () => {
            Modal.success({
              title: 'Success',
              content: 'Edit proposal successfully',
            });
          },
          onError: () => {
            Modal.error({
              title: 'Error',
              content: 'Error to edit a proposal',
            });
          },
        });
      } else if (kind === 'New') {
        const missionData = {
          creator_id: user.id,
          status: status,
          title: name,
          desc: desc,
          data: data,
          icon_url: workflow.icon_url,
          workflow_version_id: workflowVersion.id,
        };

        await createMission({
          missionData,
          workflowVersion,
          onSuccess: () => {
            Modal.success({
              title: 'Success',
              content: 'Create a new proposal successfully',
            });
          },
          onError: () => {
            Modal.error({
              title: 'Error',
              content: 'Error to create a proposal',
            });
          },
        });
      }

      reset();
      onCancel();
    }
  };

  const reset = () => {
    setName('');

    const doc = filtered_docs.find((doc: any) => doc.id === value);
    setDesc(doc?.template);
  };

  const [optionWorkflows, setOptionWorkflows] = useState<any>([
    {
      key: workflow.id,
      label: <div className='flex items-center'>{workflow.title}</div>,
      value: workflow.id,
    },
  ]);

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}>
        <Modal
          open={open}
          onCancel={onCancel}
          title={!missionId ? 'Create a proposal' : 'Edit a proposal'}
          width={628}
          footer={[
            <Button key='back' onClick={onCancel}>
              Cancel
            </Button>,
            <Button
              key='save-draft'
              type='primary'
              onClick={() => {
                if (missionId) {
                  handleClick('Edit');
                } else {
                  handleClick('New');
                }
              }}
            >
              Save Draft
            </Button>,
            <Button
              key='publish'
              type='primary'
              onClick={() => {
                setStatus('PUBLIC');
                if (missionId) {
                  handleClick('Edit');
                } else {
                  handleClick('New');
                }
              }}
            >
              Publish
            </Button>,
          ]}
        >
          <div className='flex'>
            <div style={{ width: 580 }}>
              <Space direction='vertical' className='w-full'>
                <div className='text-sm text-[#575655]'>Proposal name </div>
                <div>
                  <Input
                    className='w-full'
                    placeholder={'Governance revision'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={isWarning ? { borderColor: 'red' } : undefined}
                  />
                  {isWarning && (
                    <div className='text-red-500'>
                      Please fill in the proposal name
                    </div>
                  )}
                </div>
                <div className='text-sm text-[#575655]'>Workflow</div>
                <div>
                  <Select
                    className='w-full'
                    options={optionWorkflows}
                    defaultValue={optionWorkflows[0]}
                    disabled
                  ></Select>
                </div>
                <div className='text-sm text-[#575655] mb-2'>Select docs</div>
                <div className='relative mb-2'>
                  <Select
                    className='w-3/4'
                    options={optionDocs}
                    onChange={(value) => {
                      setValue(value);
                      const doc = filtered_docs.find(
                        (doc: any) => doc.id === value
                      );
                      setDesc(doc?.template);
                    }}
                  />
                  <Button
                    className='absolute inset-y-0 right-0 mb-2'
                    disabled={value ? false : true}
                    onClick={() => {
                      window.open(
                        `/doc/${orgIdString}/${workflowIdString}/${versionIdString}/${value}`,
                        '_blank',
                        'noopener,noreferrer'
                      );
                    }}
                  >
                    View doc details
                  </Button>
                </div>
                <div className='text-sm text-[#575655] mb-2'>
                  Proposal content
                </div>
                <div>
                  <TextEditor
                    value={desc}
                    setValue={(val: any) => setDesc(val)}
                    id='text-editor'
                  />
                </div>
              </Space>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
