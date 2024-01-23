import { Button, Select, Space } from 'antd';
import { ExportOutlined, LeftOutlined } from '@ant-design/icons';
import Input from 'antd/es/input/Input';
import { useEffect, useState } from 'react';
import { PAGE_ROUTER } from '@constants/common';
import {
  openWorkflowPage,
  resetLastProposalId,
  shortenString,
  stripHTML,
} from '../utils';
import { createMission } from '@axios/createMission';

interface Props {
  setPage: any;
  setCurrentProposalId: any;
  currentOrgData: any;
  user: any;
  setLoading: any;
}

const CreateProposal: React.FC<Props> = ({
  setPage,
  setCurrentProposalId,
  currentOrgData,
  user,
  setLoading,
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
        setLoading(false);
        // TODO: fix loading
        setCurrentProposalId(response.data[0]?.id);
        setPage(PAGE_ROUTER.DONE_CREATE_PROPOSAL);
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
    const selectedDataWorkflow = currentOrgData?.workflows?.filter(
      (dataOrg: any) => dataOrg?.id === value
    );
    setCurrentWorkflowData(selectedDataWorkflow[0]);
  };

  useEffect(() => {
    console.log('currentWorkflowData', currentWorkflowData);
  }, [currentWorkflowData]);

  return (
    <div className='h-full w-full flex flex-col justify-between'>
      <div className='h-full'>
        <div className='w-full flex flex-row'>
          <LeftOutlined
            className='text-base'
            onClick={() => {
              setPage(PAGE_ROUTER.HOME_PAGE);
            }}
          />
        </div>
        <div>
          <p
            style={{
              width: 236,
              marginTop: 16,
              marginBottom: 68,
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            Create a proposal
          </p>
          <div className='flex flex-col gap-3 mb-[68px] w-full'>
            <Input
              className='h-[49px] w-full'
              placeholder='Enter proposal name'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Select
              className='h-[49px] w-full'
              placeholder='Select proposal process'
              onChange={handleChangeWorkflow}
              options={workflowsOption}
              dropdownStyle={{ maxHeight: '120px', overflow: 'auto' }}
            />
            {currentWorkflowData && (
              <div className='p-3 bg-white rounded w-full'>
                <div className='flex flex-row w-full justify-between items-center'>
                  <div className='text-sm text-gray-600'>Description</div>
                  <ExportOutlined
                    className='cursor-pointer'
                    onClick={() => {
                      openWorkflowPage(
                        currentOrgData?.id,
                        currentWorkflowData?.id,
                        currentWorkflowData?.versions[0]?.id
                      );
                    }}
                  />
                </div>
                <div className='text-sm mt-3 text-gray-700'>
                  {shortenString(stripHTML(currentWorkflowData?.desc), 245)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        className='h-[4px] w-full mb-[64px]'
        type='primary'
        size='large'
        disabled={isButtonDisabled}
        onClick={async () => {
          setLoading(true);
          await handleCreateProposal();
        }}
      >
        Confirm
      </Button>
    </div>
  );
};

export default CreateProposal;
