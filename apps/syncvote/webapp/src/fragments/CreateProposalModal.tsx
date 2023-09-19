import { Button, Input, Modal, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { IDoc, emptyStage } from 'directed-graph';

import parse from 'html-react-parser';
import { TextEditor } from 'rich-text-editor';
import { useParams } from 'react-router-dom';
import { insertMission } from '@dal/data';
import { useDispatch } from 'react-redux';

export const CreateProposalModal = ({
  open,
  onCancel,
  workflow,
  workflowVersion,
  docInputSomething,
}: {
  open: boolean;
  workflow: any;
  onCancel: () => void;
  workflowVersion: any;
  docInputSomething: JSX.Element;
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState(workflow?.desc);
  const [width, setWidth] = useState(628);
  const [zoom, setZoom] = useState(false);

  const data = workflowVersion?.data || emptyStage;
  const docs: IDoc[] = data.docs || [];

  const [isWarning, setIsWarning] = useState(false);

  const handleClick = async () => {
    if (!name) {
      setIsWarning(true);
      setTimeout(() => {
        setIsWarning(false);
      }, 2000);
    } else {
      await insertMission({
        dispatch: dispatch,
        params: {
          title: name,
          desc: desc,
          data: data,
          status: 'DRAFT',
          workflow_version_id: workflowVersion.id,
        },
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

      onCancel();
    }
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
          onOk={() => {
            // onCancel();
            handleClick();
          }}
          title={'Create a proposal'}
          width={width}
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
                {docInputSomething}
                {/* <div className='text-sm text-[#575655]'>Select docs</div>
                <div className='relative'>
                  <Select
                    className='w-3/4'
                    options={optionDocs}
                    defaultValue={optionDocs[0]}
                    onChange={(docId) => {
                      setValue(docId);
                    }}
                  />
                  <Button
                    className='absolute inset-y-0 right-0'
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
                <div className='text-sm text-[#575655]'>Proposal content</div>
                <div>
                  <TextEditor
                    value={desc}
                    setValue={(val: any) => setDesc(val)}
                  />
                </div> */}
              </Space>
              <Button
                onClick={() => {
                  if (width === 628) {
                    setWidth(width * 2);
                    setZoom(true);
                  } else {
                    setWidth(width / 2);
                    setZoom(false);
                  }
                }}
              >
                Phong to
              </Button>
            </div>

            {zoom && (
              <div
                className='ml-6'
                style={{
                  borderLeft: '1px solid #E3E3E2',
                  width: 580,
                  height: 660,
                }}
              >
                <div className='ml-6 overflow-scroll h-full'>
                  <div>{parse(desc || '')}</div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
};
