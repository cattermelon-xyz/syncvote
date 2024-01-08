import { Button, Select, Space } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import Input from 'antd/es/input/Input';
import { useEffect, useState } from 'react';
import { PAGE_ROUTER } from '@constants/common';
import { resetLastProposalId } from '../utils';
import { createMission } from '@axios/createMission';

interface Props {
  setPage: any;
  setCurrentProposalId: any;
  currentOrgData: any;
  user: any;
}

const CreateProposal: React.FC<Props> = ({
  setPage,
  setCurrentProposalId,
  currentOrgData,
  user,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [currentWorkflowData, setCurrentWorkflowData] = useState<any>();
  const isButtonDisabled = !inputValue || !currentWorkflowData;
  const [workflowsOption, setWorkflowsOption] = useState<any>();

  const handleCreateProposal = async () => {
    const missionData = {
      creator_id: user.id,
      status: 'PUBLIC',
      title: inputValue,
      data: currentWorkflowData?.versions[0]?.data,
      icon_url: currentWorkflowData?.icon_url,
      start: currentWorkflowData?.versions[0]?.data?.start,
      workflow_version_id: currentWorkflowData?.versions[0]?.id,
    };

    createMission({
      missionData,
      onSuccess: (response) => {
        console.log('create proposal success', response);
        setCurrentProposalId(response.data[0]?.id);
      },
      onError: (error) => {
        console.log('error', error);
      },
      author: user?.email,
    });
  };

  useEffect(() => {
    resetLastProposalId();
  });

  useEffect(() => {
    if (currentOrgData) {
      const sortedData = currentOrgData?.workflows.sort((a: any, b: any) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();
        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }
        return 0;
      });

      const filteredData = sortedData?.map((workflowData: any) => {
        return {
          value: workflowData?.id,
          label: workflowData?.title,
        };
      });

      setWorkflowsOption(filteredData);
    }
  }, [currentOrgData]);

  const handleChangeWorkflow = (value: string) => {
    console.log(`selected ${value}`);
    const selectedDataWorkflow = currentOrgData?.workflows?.filter(
      (dataOrg: any) => dataOrg?.id === value
    );
    setCurrentWorkflowData(selectedDataWorkflow[0]);
  };

  useEffect(() => {
    console.log('currentWorkflowData', currentWorkflowData);
  }, [currentWorkflowData]);

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
            style={{ width: 236 }}
            placeholder='Select proposal process'
            onChange={handleChangeWorkflow}
            options={workflowsOption}
            dropdownStyle={{ maxHeight: '120px', overflow: 'auto' }}
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
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default CreateProposal;
