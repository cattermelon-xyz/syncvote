import { Button, Input, Modal, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { IDoc, emptyStage } from 'directed-graph';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TextEditor } from 'rich-text-editor';
import { useGetDataHook, useSetData } from 'utils';
import { config } from '@dal/config';
import { createMission, updateMission } from '@axios/createMission';
import { queryAMission } from '@dal/data';

interface CreateProposalModalProps {
  open: boolean;
  workflow: any;
  onCancel: () => void;
  workflowVersion?: any;
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
  const [name, setName] = useState('');

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const data = workflowVersion?.data || emptyStage;

  const [isWarning, setIsWarning] = useState(false);

  const [templateOfDoc, setTemplateOfDoc] = useState<any>('');

  // To do: check if mission dont have doc
  const root_docs = data.checkpoints[0]?.data?.docs || [];
  let docs: IDoc[] = data.docs || [];
  const [docsOfMission, setDocsOfMission] = useState(data.docs || []);

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
        template: doc.template,
      }));

      setOptionDocs(optionDocs);
    }
    if (missionId !== -1) {
      queryAMission({
        missionId: missionId,
        onLoad: (data: any) => {
          const mission = data[0];
          setName(mission.title);
          setTemplateOfDoc(mission.docs[0]?.template);
          setDocsOfMission(mission.docs);
        },
        dispatch,
      });
    }
  }, []);

  const handleClick = async (kind: string, status: string) => {
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
          docs: docsOfMission,
        };

        await updateMission({
          missionId: missionId,
          missionData: missionData,
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
          data: data,
          icon_url: workflow.icon_url,
          start: data.start,
          workflow_version_id: workflowVersion.id,
          docs: docsOfMission,
        };

        await createMission({
          missionData,
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

      // reset();
      onCancel();
    }
  };

  // const reset = () => {
  //   setName('');

  //   const doc = filtered_docs.find((doc: any) => doc.id === value);
  //   setTemplateOfDoc(doc?.template);
  //   setDocsOfMission(data?.docs);
  // };

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
          title={missionId === -1 ? 'Create a proposal' : 'Edit a proposal'}
          width={628}
          footer={[
            <Button key='back' onClick={onCancel}>
              Cancel
            </Button>,
            <Button
              key='save-draft'
              type='primary'
              onClick={() => {
                if (missionId !== -1) {
                  handleClick('Edit', 'DRAFT');
                } else {
                  handleClick('New', 'DRAFT');
                }
              }}
            >
              Save Draft
            </Button>,
            <Button
              key='publish'
              type='primary'
              onClick={() => {
                if (missionId !== -1) {
                  handleClick('Edit', 'PUBLIC');
                } else {
                  handleClick('New', 'PUBLIC');
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
                    onChange={(val) => {
                      setValue(val);
                      console.log(val, docsOfMission);

                      const doc = docsOfMission.find(
                        (doc: any) => doc.id === val
                      );
                      setTemplateOfDoc(doc?.template);
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
                    value={templateOfDoc}
                    setValue={(val: any) => {
                      setTemplateOfDoc(val);
                      console.log(value);

                      if (value) {
                        const updatedDocs = [...docsOfMission];
                        const docIndex = updatedDocs.findIndex(
                          (doc) => doc.id === value
                        );
                        if (docIndex !== -1) {
                          updatedDocs[docIndex].template = val;
                          setDocsOfMission(updatedDocs);
                        } else {
                          console.log(
                            'Không tìm thấy tài liệu với id được chỉ định.'
                          );
                        }
                      }
                    }}
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
