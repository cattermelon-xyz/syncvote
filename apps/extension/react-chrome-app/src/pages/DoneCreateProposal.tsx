import React from 'react';
import { PAGE_ROUTER } from '@constants/common';
import Success from '@assets/icons/Success';
import { Button } from 'antd';
import { useEffect } from 'react';
import { openMissionPage, resetLastProposalId } from '../utils';
import { CheckOutlined, ExportOutlined } from '@ant-design/icons';

interface Props {
  setPage: any;
  currentProposalData: any;
}

const DoneCreateProposal: React.FC<Props> = ({
  setPage,
  currentProposalData,
}) => {
  useEffect(() => {
    resetLastProposalId();
  });
  return (
    <div className='flex flex-col text-center h-full justify-between'>
      <div className='flex flex-col justify-center items-center mt-[68px] '>
        <div className='flex rounded-full h-[80px] w-[80px]  justify-center items-center bg-[#1D713E]'>
          <CheckOutlined className='text-white text-3xl' />
        </div>
        <p className='text-base mt-[12px] text-[#1D713E]'>Create successful</p>
        <div className='mt-[70px]'>
          <div className='text-bold text-xl'>
            {currentProposalData ? currentProposalData.m_title : `Loading ...`}
          </div>
          <div
            className='flex flex-row items-center justify-center mt-4'
            onClick={() =>
              openMissionPage(
                currentProposalData?.org_id,
                currentProposalData?.mission_id
              )
            }
          >
            <ExportOutlined className='mr-1' />
            {`View on voting page`}
          </div>
        </div>
      </div>
      <Button
        className='w-full bg-[#000] mb-[64px]'
        type='primary'
        size='large'
        onClick={() => {
          setPage(PAGE_ROUTER.VOTING);
        }}
      >
        Done
      </Button>
    </div>
  );
};

export default DoneCreateProposal;
