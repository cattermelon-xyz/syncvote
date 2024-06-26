import React, { useEffect, useState } from 'react';
import { Avatar, Card, Modal, Popover } from 'antd';
// import './AntCard.css';
import '@components/Card/AntCard.css';
import { useNavigate } from 'react-router-dom';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  ImportOutlined,
  LogoutOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { createIdString, getImageUrl, useGetDataHook, useSetData } from 'utils';
import { Banner } from 'banner';
import ChangeNameWorkflowModal from './ChangeNameWorkflowModal';
import DeleteWorkflowModal from './DeleteWorkflowModal';
import DuplicateWorkflowModal from './DuplicateWorkflowModal';
import MoveWorkflowModal from './MoveWorkflowModal';
import MoveToWorkflowModal from './MoveToWorkflowModal';
import { useDispatch } from 'react-redux';
import ShareModal from '../Version/fragment/ShareModal';
import PreviewWorkflowModal from './PreviewWorkflowModal';
import { config } from '@dal/config';

interface WorkflowCardProps {
  dataWorkflow: any;
  isListHome?: boolean;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  dataWorkflow,
  isListHome,
}) => {
  const isMyWorkSpacePage = location.pathname === '/my-workspaces';
  const isSharedWorkSpacePage = location.pathname === '/shared-workspaces';

  const presetBanners = useGetDataHook({
    configInfo: config.queryPresetBanners,
  }).data;

  const dispatch = useDispatch();
  const [openModalChangeName, setOpenModalChangeName] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalPreview, setOpenModalPreview] = useState(false);
  const [openModalDuplicate, setOpenModalDuplicate] = useState(false);
  const [openModalMove, setOpenModalMove] = useState(false);
  const [openModalMoveTo, setOpenModalMoveTo] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(true);
  const [orgTo, setOrgTo] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMyWorkSpacePage && !isSharedWorkSpacePage) {
      setIsPopoverVisible(false);
    }
  }, []);

  const PopoverContent: React.FC = () => (
    <>
      {isMyWorkSpacePage ? (
        <div className='cursor-pointer w-[196px]'>
          <div
            style={{ borderBottom: '1px solid #E3E3E2' }}
            className='h-9 flex items-center hover:bg-gray-100'
            onClick={(e: any) => {
              e.stopPropagation();
              setOpenModalPreview(true);
              setIsPopoverVisible(false);
            }}
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
      ) : (
        <>
          {isSharedWorkSpacePage && (
            <div className='cursor-pointer w-[196px]'>
              <div
                style={{ borderBottom: '1px solid #E3E3E2' }}
                className='h-9 flex items-center hover:bg-gray-100'
                onClick={(e: any) => {
                  e.stopPropagation();
                  setOpenModalPreview(true);
                  setIsPopoverVisible(false);
                }}
              >
                <div className='px-2'>
                  <EyeOutlined /> Preview
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
                  // e.stopPropagation();
                  // setOpenModalDelete(true);
                  // setIsPopoverVisible(false);
                }}
              >
                <div className='px-2'>
                  <LogoutOutlined /> Leave workflow
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
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

    await useSetData({
      params: {
        versionId,
        workflowId,
        status,
        mode: 'info',
      },
      configInfo: config.upsertWorkflowVersion,
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
      dispatch: dispatch,
    });
  };

  let workflow = dataWorkflow;
  workflow.workflow_version = dataWorkflow.versions;

  return (
    <>
      <PreviewWorkflowModal
        open={openModalPreview}
        onClose={() => {
          setOpenModalPreview(false);
          setIsPopoverVisible(true);
        }}
        workflow={dataWorkflow}
      />

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
        orgTo={orgTo}
      />

      <MoveWorkflowModal
        open={openModalMove}
        onClose={() => {
          setOpenModalMove(false);
          setIsPopoverVisible(true);
        }}
        workflow={dataWorkflow}
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
      />

      <ChangeNameWorkflowModal
        open={openModalChangeName}
        onClose={() => {
          setOpenModalChangeName(false);
          setIsPopoverVisible(true);
        }}
        workflow={dataWorkflow}
      />

      <DuplicateWorkflowModal
        open={openModalDuplicate}
        onClose={() => {
          setOpenModalDuplicate(false);
          setIsPopoverVisible(true);
        }}
        workflow={dataWorkflow}
      />

      <Card
        hoverable={true}
        style={{ position: 'relative' }}
        className='w-[256px] h-[176px] relative rounded-xl'
        onClick={() => {
          if (isListHome) {
            navigate(
              `/public/${createIdString(
                dataWorkflow?.org_title,
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
            presetBanners={presetBanners}
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
