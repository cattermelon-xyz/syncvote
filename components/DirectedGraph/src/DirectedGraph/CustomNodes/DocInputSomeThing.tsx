import { useContext, useEffect } from 'react';
import { GraphContext } from '../context';
import { Button, Select } from 'antd';
import { useState } from 'react';
import { TextEditor } from 'rich-text-editor';
import { IDoc } from '../../..';

const DocInputSomeThing = ({ data }: { data: any }) => {
  const [desc, setDesc] = useState('Dit con me may luon');
  const docs: IDoc[] = data.docs || [];

  useEffect(() => {
    if (docs) {
      setOptions(
        docs.map((doc) => ({
          key: doc.id,
          label: <div className='flex items-center'>{doc.title}</div>,
          value: doc.id,
        }))
      );
    }
  }, [docs]);

  const [options, setOptions] = useState([
    {
      key: 'identity',
      label: <div className='flex items-center'>Dit con me may</div>,
      value: 'identity',
    },
  ]);

  return (
    <>
      <div className='text-sm text-[#575655] mb-2'>Select docs</div>
      <div className='relative mb-2'>
        <Select className='w-3/4' options={options} defaultValue={options[0]} />
        <Button className='absolute inset-y-0 right-0 mb-2'>
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
