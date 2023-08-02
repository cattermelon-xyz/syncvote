import React, { useState } from 'react';
import { Avatar, Card, Modal, Popover, Space } from 'antd';
import './AntCard.css';
import { useNavigate } from 'react-router-dom';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  ImportOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { createIdString, getImageUrl } from '@utils/helpers';
import Banner from '@components/Banner/Banner';
import ChangeNameWorkflowModal from '../../pages/Workflow/fragments/ChangeNameWorkflowModal';
import DeleteWorkflowModal from '../../pages/Workflow/fragments/DeleteWorkflowModal';
import DuplicateWorkflowModal from '../../pages/Workflow/fragments/DuplicateWorkflowModal';
import MoveWorkflowModal from '../../pages/Workflow/fragments/MoveWorkflowModal';
import MoveToWorkflowModal from '../../pages/Workflow/fragments/MoveToWorkflowModal';
import { useDispatch } from 'react-redux';
import ShareModal from '@pages/Workflow/Version/fragment/ShareModal';
import { upsertWorkflowVersion } from '@middleware/data';

interface WorkflowCardProps {
  dataWorkflow: any;
  isListHome?: boolean;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  dataWorkflow,
  isListHome,
}) => {
  const dispatch = useDispatch();
  const [openModalChangeName, setOpenModalChangeName] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalDuplicate, setOpenModalDuplicate] = useState(false);
  const [openModalMove, setOpenModalMove] = useState(false);
  const [openModalMoveTo, setOpenModalMoveTo] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(true);
  const [orgTo, setOrgTo] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const navigate = useNavigate();
  const PopoverContent: React.FC = () => (
    <div className='cursor-pointer w-[196px]'>
      <div
        style={{ borderBottom: '1px solid #E3E3E2' }}
        className='h-9 flex items-center hover:bg-gray-100'
      >
        <div className='px-2'>
          <EyeOutlined /> Preview
        </div>
      </div>
      <div className='flex-col'>
        <div
          className='h-9 flex items-center hover:bg-gray-100'
          onClick={(e: any) => {
            e.stopPropagation();
            setOpenModalMove(true);
            setIsPopoverVisible(false);
          }}
        >
          <div className='px-2'>
            <ImportOutlined /> Move to...
          </div>
        </div>
        <div
          className='h-9 flex items-center hover:bg-gray-100'
          onClick={(e: any) => {
            e.stopPropagation();
            setShowShareModal(true);
            setIsPopoverVisible(false);
          }}
        >
          <div className='px-2'>
            <ShareAltOutlined /> Invite
          </div>
        </div>
        <div
          className='h-9 flex items-center hover:bg-gray-100'
          style={{ borderBottom: '1px solid #E3E3E2' }}
          onClick={(e: any) => {
            e.stopPropagation();
            setOpenModalChangeName(true);
            setIsPopoverVisible(false);
          }}
        >
          <div className='px-2'>
            <EditOutlined /> Change name
          </div>
        </div>
      </div>

      <div
        className='h-9 flex items-center hover:bg-gray-100'
        style={{ borderBottom: '1px solid #E3E3E2' }}
        onClick={(e: any) => {
          e.stopPropagation();
          setOpenModalDuplicate(true);
          setIsPopoverVisible(false);
        }}
      >
        <div className='px-2'>
          <CopyOutlined /> Duplicate
        </div>
      </div>

      <div
        className='h-9 flex items-center hover:bg-gray-100'
        onClick={(e: any) => {
          e.stopPropagation();
          setOpenModalDelete(true);
          setIsPopoverVisible(false);
        }}
      >
        <div className='px-2'>
          <DeleteOutlined /> Delete
        </div>
      </div>
    </div>
  );

  const handleWorkflowStatusChanged = async ({
    versionId,
    status,
    onSuccess,
    onError,
  }: {
    versionId: number;
    status: string;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
  }) => {
    const workflowId = dataWorkflow.id;
    const workflowVersion = {
      versionId,
      workflowId,
      status,
    };
    await upsertWorkflowVersion({
      dispatch,
      mode: 'info',
      workflowVersion,
      onSuccess: (data) => {
        onSuccess(data);
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: 'Failed to update workflow status',
        });
        onError(error);
      },
    });
  };
  let workflow = dataWorkflow;
  workflow.workflow_version = dataWorkflow.versions;
  return (
    <>
      <ShareModal
        workflow={workflow}
        showShareModal={showShareModal}
        setShowShareModal={setShowShareModal}
        handleWorkflowStatusChanged={handleWorkflowStatusChanged}
        onClose={() => {
          setIsPopoverVisible(true);
        }}
      />
      <MoveToWorkflowModal
        open={openModalMoveTo}
        onClose={() => {
          setOpenModalMoveTo(false);
          setIsPopoverVisible(true);
        }}
        workflow={dataWorkflow}
        dispatch={dispatch}
        orgTo={orgTo}
      />

      <MoveWorkflowModal
        open={openModalMove}
        onClose={() => {
          setOpenModalMove(false);
          setIsPopoverVisible(true);
        }}
        workflow={dataWorkflow}
        dispatch={dispatch}
        openMoveToModal={(data: any) => {
          setOrgTo(data);
          setOpenModalMoveTo(true);
        }}
      />

      <DeleteWorkflowModal
        open={openModalDelete}
        onClose={() => {
          setOpenModalDelete(false);
          setIsPopoverVisible(true);
        }}
        workflow={dataWorkflow}
        dispatch={dispatch}
      />

      <ChangeNameWorkflowModal
        open={openModalChangeName}
        onClose={() => {
          setOpenModalChangeName(false);
          setIsPopoverVisible(true);
        }}
        workflow={dataWorkflow}
        dispatch={dispatch}
      />
      <DuplicateWorkflowModal
        open={openModalDuplicate}
        onClose={() => {
          setOpenModalDuplicate(false);
          setIsPopoverVisible(true);
        }}
        workflow={dataWorkflow}
        dispatch={dispatch}
      />
      <Card
        hoverable={true}
        style={{ position: 'relative' }}
        className='w-[256px] h-[176px] relative rounded-xl'
        onClick={() => {
          if (isListHome) {
            navigate(
              `/public/${createIdString(
                dataWorkflow?.infoOrg.title,
                dataWorkflow?.owner_org_id.toString()
              )}/${createIdString(
                dataWorkflow?.title,
                dataWorkflow?.id
              )}/${dataWorkflow?.versions[0].id.toString()}`
            );
          } else {
            navigate(
              `/${createIdString(
                dataWorkflow?.org_title,
                dataWorkflow?.owner_org_id.toString()
              )}/${createIdString(
                dataWorkflow?.title,
                dataWorkflow?.id
              )}/${dataWorkflow?.versions[0].id.toString()}`
            );
          }
        }}
      >
        {
          <Banner
            bannerUrl={dataWorkflow.banner_url}
            className='w-full h-[86px] rounded-lg m-0'
          />
        }
        {dataWorkflow.icon_url ? (
          <Avatar
            src={getImageUrl({
              filePath: dataWorkflow?.icon_url?.replace('preset:', ''),
              isPreset: dataWorkflow?.icon_url?.indexOf('preset:') === 0,
              type: 'icon',
            })}
            style={{
              position: 'absolute',
              top: '78px',
              left: '24px',
              zIndex: 10,
            }}
          />
        ) : (
          <Avatar
            shape='circle'
            style={{
              backgroundColor: '#D3D3D3',
              position: 'absolute',
              top: '78px',
              left: '24px',
              zIndex: 10,
            }}
          />
        )}
        <p className='text-xs text-[#252422] mt-[18px] mb-2 truncate'>
          {dataWorkflow.title}
        </p>
        <div className='flex justify-between'>
          <div className='flex'>
            {dataWorkflow?.owner_workflow_icon_url ? (
              <Avatar
                src={getImageUrl({
                  filePath: dataWorkflow?.owner_workflow_icon_url?.replace(
                    'preset:',
                    ''
                  ),
                  isPreset:
                    dataWorkflow?.owner_workflow_icon_url?.indexOf(
                      'preset:'
                    ) === 0,
                  type: 'icon',
                })}
                className='w-[16px] h-[16px]'
              />
            ) : (
              <Avatar
                shape='circle'
                className='w-[16px] h-[16px]'
                style={{
                  backgroundColor: '#D3D3D3',
                  position: 'absolute',
                }}
              />
            )}
            {dataWorkflow?.owner_workflow_name ? (
              <p className='text-xs text-[#575655] self-center ml-[4px]'>
                {dataWorkflow?.owner_workflow_name}
              </p>
            ) : (
              <p></p>
            )}
          </div>
          {isPopoverVisible && (
            <Popover
              placement='bottom'
              content={<PopoverContent />}
              trigger='click'
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <EllipsisOutlined
                  style={{ fontSize: '16px', color: '#000000' }}
                />
              </div>
            </Popover>
          )}
        </div>
      </Card>
    </>
  );
};

export default WorkflowCard;
