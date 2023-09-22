import { Button, Input, Modal, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { IDoc, emptyStage } from 'directed-graph';

import { insertMission } from '@dal/data';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TextEditor } from 'rich-text-editor';
import { useGetDataHook } from 'utils';
import { config } from '@dal/config';

export const CreateProposalModal = ({
  open,
  onCancel,
  workflow,
  workflowVersion,
}: {
  open: boolean;
  workflow: any;
  onCancel: () => void;
  workflowVersion: any;
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');

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
  }, []);

  const handleClick = async () => {
    if (!name) {
      setIsWarning(true);
      setTimeout(() => {
        setIsWarning(false);
      }, 2000);
    } else {
      // const textEditorElement = document.getElementById('text-editor');
      // if (textEditorElement) {
      //   const qlEditorElement = textEditorElement.querySelector('.ql-editor');
      //   if (qlEditorElement) {
      //     const qlEditorHTML = qlEditorElement.innerHTML;

      //   }
      // }

      await insertMission({
        dispatch: dispatch,
        params: {
          title: name,
          desc: desc,
          data: data,
          status: 'DRAFT',
          workflow_version_id: workflowVersion.id,
          creator_id: user.id,
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
          onOk={() => {
            handleClick();
          }}
          title={'Create a proposal'}
          width={628}
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