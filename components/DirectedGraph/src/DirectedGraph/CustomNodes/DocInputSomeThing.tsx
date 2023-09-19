import { useEffect } from 'react';
import { Button, Select } from 'antd';
import { useState } from 'react';
import { TextEditor } from 'rich-text-editor';
import { IDoc } from '../../..';
import { useParams } from 'react-router-dom';

export const DocInputSomeThing = ({ data }: { data: any }) => {
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

  return (
    <>
      <div className='text-sm text-[#575655] mb-2'>Select docs</div>
      <div className='relative mb-2'>
        <Select
          className='w-3/4'
          options={optionDocs}
          onChange={(value) => {
            setValue(value);
            const doc = filtered_docs.find((doc: any) => doc.id === value);
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
      <div className='text-sm text-[#575655] mb-2'>Proposal content</div>
      <div>
        <TextEditor
          value={desc}
          setValue={(val: any) => setDesc(val)}
          id='text-editor'
        />
      </div>
    </>
  );
};

export default DocInputSomeThing;
