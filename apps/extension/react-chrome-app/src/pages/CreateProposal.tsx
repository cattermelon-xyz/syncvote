import { Button, Select, Space } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import Input from 'antd/es/input/Input';
import { useEffect, useState } from 'react';
import { PAGE_ROUTER } from '@constants/common';
import { createProposalDemo } from '@data/org';
import { resetLastProposalId } from '../utils';

interface Props {
  setPage: any;
  setCurrentProposalId: any;
}

const CreateProposal: React.FC<Props> = ({ setPage, setCurrentProposalId }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState();
  const isButtonDisabled = !inputValue || !selectValue;

  const handleCreateProposal = async () => {
    createProposalDemo({
      title: inputValue,
      onSuccess: (data) => {
        console.log('create proposal success', data);
        setCurrentProposalId(data?.id);
      },
      onError: (error) => {
        console.log('error', error);
      },
    });
  };

  useEffect(() => {
    resetLastProposalId();
  });

  return (
    <div>
      <LeftOutlined
        onClick={() => {
          setPage(PAGE_ROUTER.HOME_PAGE);
        }}
      />
      <div>
        <Space>
          <p style={{ width: 236, marginTop: 16, marginBottom: 68 }}>
            Create a proposal
          </p>
        </Space>

        <div className='flex flex-col gap-3 mb-[68px] '>
          <Input
            className='h-[49px] w-full'
            placeholder='Enter proposal name'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Select
            className='h-[49px] w-full'
            showSearch
            style={{ width: 236 }}
            placeholder='Select proposal process'
            optionFilterProp='children'
            filterOption={(input, option) =>
              (option?.label ?? '').includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            value={selectValue}
            onChange={setSelectValue}
            options={[
              {
                value: '1',
                label: 'Idle DAO governance process',
              },
            ]}
          />
        </div>

        <Button
          className='h-[4px] w-full'
          type='primary'
          size='large'
          disabled={isButtonDisabled}
          onClick={async () => {
            await handleCreateProposal();
            setPage(PAGE_ROUTER.DONE_CREATE_PROPOSAL);
          }}
        >
          Comfirm
        </Button>
      </div>
    </div>
  );
};

export default CreateProposal;
