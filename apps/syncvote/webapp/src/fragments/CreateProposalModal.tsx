import { Button, Input, Modal, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { IDoc, emptyStage } from 'directed-graph';

import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
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
  onUpdateProposals?: any;
}

export const CreateProposalModal = ({
  open,
  onCancel,
  workflow,
  workflowVersion,
  missionId = -1,
  onUpdateProposals,
}: CreateProposalModalProps) => {
  const dispatch = useDispatch();
  const { orgIdString } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const data = workflowVersion?.data || emptyStage;

  const [isWarning, setIsWarning] = useState(false);

  const [missionDesc, setMissionDesc] = useState<any>('');

  const [optionWorkflows, setOptionWorkflows] = useState<any>([]);

  useEffect(() => {
    if (missionId !== -1) {
      queryAMission({
        missionId: missionId,
        onLoad: (data: any) => {
          const mission = data[0];
          setName(mission?.title);
          setMissionDesc(mission?.desc);
        },
        dispatch,
      });
    }
  }, [missionId]);

  useEffect(() => {
    if (workflow) {
      setOptionWorkflows([
        {
          key: workflow.id,
          label: <div className='flex items-center'>{workflow.title}</div>,
          value: workflow.id,
        },
      ]);
    }
  }, [workflow]);

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
          desc: missionDesc,
        };

        await updateMission({
          missionId: missionId,
          missionData: missionData,
          onSuccess: () => {
            Modal.success({
              title: 'Success',
              content: 'Edit proposal successfully',
              onOk:
                status === 'PUBLIC'
                  ? () => {
                      window.location.reload();
                    }
                  : () => {},
            });
            onUpdateProposals((prevProposals: any) => {
              const newProposals = prevProposals.map((proposal: any) => {
                if (proposal?.id === missionId) {
                  return { ...proposal, title: name, desc: missionDesc };
                }
                return proposal;
              });
              return newProposals;
            });
          },
          onError: (msg) => {
            Modal.error({
              title: 'Error',
              content: msg,
            });
          },
          dispatch,
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
          desc: missionDesc,
        };
        // if checkpoint is not validated => can't create mission
        await createMission({
          missionData,
          onSuccess: () => {
            Modal.success({
              title: 'Success',
              content: 'Create a new proposal successfully',
              onOk: () => {
                navigate(`/${orgIdString}`);
              },
            });
          },
          onError: (msg) => {
            Modal.error({
              title: 'Error',
              content: msg,
            });
          },
          dispatch,
        });
      }

      // reset();
      onCancel();
    }
  };

  // const reset = () => {
  //   setName('');
  // const reset = () => {
  //   setName('');

  //   const doc = filtered_docs.find((doc: any) => doc.id === value);
  //   setTemplateOfDoc(doc?.template);
  //   setDocsOfMission(data?.docs);
  // };

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
                {missionId === -1 && (
                  <>
                    <div className='text-sm text-[#575655]'>Workflow</div>
                    <div>
                      {optionWorkflows.length > 0 && (
                        <Select
                          className='w-full'
                          options={optionWorkflows}
                          defaultValue={optionWorkflows[0]?.value}
                          disabled
                        />
                      )}
                    </div>
                  </>
                )}
                <div className='text-sm text-[#575655] mb-2'>
                  Proposal description
                </div>
                <div>
                  <TextEditor
                    value={missionDesc}
                    setValue={(val: any) => {
                      setMissionDesc(val);
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
