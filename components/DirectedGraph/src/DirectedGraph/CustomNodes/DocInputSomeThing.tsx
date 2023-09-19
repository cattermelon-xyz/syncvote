import { useContext, useEffect } from 'react';
import { Button, Select } from 'antd';
import { useState } from 'react';
import { TextEditor } from 'rich-text-editor';
import { IDoc } from '../../..';
import { useParams } from 'react-router-dom';

export const DocInputSomeThing = ({ data }: { data: any }) => {
  const [desc, setDesc] = useState('');
  const docs: IDoc[] = data.docs || [];
  const { orgIdString, workflowIdString, versionIdString } = useParams();
  const [value, setValue] = useState();
  const [optionDocs, setOptionDocs] = useState<any>([]);

  useEffect(() => {
    if (docs) {
      setOptionDocs(
        docs.map((doc) => ({
          key: doc.id,
          label: <div className='flex items-center'>{doc.title}</div>,
          value: doc.id,
        }))
      );

      setValue(optionDocs[0]?.key);
    }
  }, [docs]);

  return (
    <>
      <div className='text-sm text-[#575655] mb-2'>Select docs</div>
      <div className='relative mb-2'>
        <Select
          className='w-3/4'
          options={optionDocs}
          defaultValue={optionDocs[0] || ''}
          disabled={optionDocs ? false : true}
        />
        <Button
          className='absolute inset-y-0 right-0 mb-2'
          disabled={optionDocs ? false : true}
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
        <TextEditor value={desc} setValue={(val: any) => setDesc(val)} />
      </div>
    </>
  );
};

export default DocInputSomeThing;
