import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { queryWorkflow, updateAWorkflowInfo, upsertWorkflowVersion } from '@middleware/data';
import { createIdString, extractIdFromIdString, shouldUseCachedData } from '@utils/helpers';
import {
  Card, Button, Space, Tag, Popover, Modal, Divider,
} from 'antd';
import ZapIcon from '@assets/icons/svg-icons/ZapIcoin';
import {
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import Icon from '@components/Icon/Icon';
import NewVersion from './fragment/NewVersion';
import EditWorkflow from './fragment/EditWorkflow';

const BluePrint = () => {
  const navigate = useNavigate();
  const { orgIdString, workflowIdString } = useParams();
  const dispatch = useDispatch();
  const { workflows, lastFetch } = useSelector((state:any) => state.workflow);
  const workflowId = extractIdFromIdString(workflowIdString);
  const orgId = extractIdFromIdString(orgIdString);
  const [workflow, setWorkflow] = useState({
    id: -1,
    title: '',
    desc: '',
    icon_url: '',
    workflow_version: [],
  });
  const extractWorkflowFromList = (list:any[]) => {
    const wf = list.find((d:any) => d.id === workflowId);
    setWorkflow({
      ...structuredClone(wf),
    });
  };
  useEffect(() => {
    if (!shouldUseCachedData(lastFetch)) {
      queryWorkflow({
        orgId,
        onLoad: (data) => {
          extractWorkflowFromList(data);
        },
        dispatch,
      });
    } else if (workflows.length > 0) {
      extractWorkflowFromList(workflows);
    }
  }, [workflows, lastFetch]);
  const [openDupplicate, setOpenDupplicate] = useState(false);
  const [openWorkflowEdit, setOpenWorkflowEdit] = useState(false);
  const [versionToCopy, setVersionToCopy] = useState<any>();
  const renderTag = (status:string, recommended: boolean) => {
    let rs = <></>;
    if (recommended === true) {
      rs = <Tag style={{ border: 'none' }} color="purple">Recommended</Tag>;
    } else {
      switch (status) {
        case 'PUBLISHED':
          rs = <Tag style={{ border: 'none' }} color="green">Published</Tag>;
          break;
        case 'DRAFT':
          rs = <Tag style={{ border: 'none' }} color="gray">Draft</Tag>;
          break;
        default:
          rs = <Tag style={{ border: 'none' }}>{status}</Tag>;
          break;
      }
    }
    return rs;
  };
  const navigateToNewMission = (thisVersion:any) => {
    navigate(`/${orgIdString}/${createIdString(workflow.title, workflow.id.toString())}/${createIdString(thisVersion.version, thisVersion.id)}/new-mission`);
  };
  const navigateToVersion = (thisVersion:any) => {
    navigate(`/${orgIdString}/${createIdString(workflow.title, workflow.id.toString())}/${createIdString(thisVersion.version, thisVersion.id)}`);
  };
  const navigateToNewVersion = () => {
    navigate(`/${orgIdString}/${createIdString(workflow.title, workflow.id.toString())}/new-version`);
  };
  const handleNewVersion = async (title:string) => {
    if (title === '') {
      Modal.error({
        title: 'Error',
        content: 'Please enter a version title',
      });
      return;
    }
    const versionToSave = {
      workflowId,
      versionId: -1,
      version: title,
      status: 'DRAFT',
      versionData: versionToCopy?.data,
      recommended: false,
    };
    setOpenDupplicate(false);
    setVersionToCopy(undefined);
    await upsertWorkflowVersion({
      dispatch,
      workflowVersion: versionToSave,
      onSuccess: (data:any) => {
        const versionIdString = createIdString(data[0].version, data[0].id);
        navigate(`/${orgIdString}/${workflowIdString}/${versionIdString}`);
        Modal.success({
          maskClosable: true,
          content: 'Data saved successfully',
        });
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: error.message,
        });
      },
      mode: undefined,
    });
  };
  const handleSaveWorkflowInfo = async ({
    title, desc, iconUrl,
  }: {
    title?:string, desc?:string, iconUrl?: string,
  }) => {
    const toUpdate:any = {};
    if (title !== workflow.title) toUpdate.title = title;
    if (desc !== workflow.desc) toUpdate.desc = desc;
    if (iconUrl !== workflow.icon_url) toUpdate.iconUrl = iconUrl;
    updateAWorkflowInfo({
      info: {
        id: workflowId,
        ...toUpdate,
      },
      dispatch,
      onSuccess: () => {
        Modal.success({
          title: 'Success',
          content: 'Data saved successfully',
        });
      },
    });
  };
  return (
    <div className="container mx-auto relative">
      <EditWorkflow
        open={openWorkflowEdit}
        setOpen={(toOpen:boolean) => {
          setOpenWorkflowEdit(toOpen);
        }}
        workflowIcon={workflow?.icon_url}
        workflowTitle={workflow?.title}
        workflowDesc={workflow?.desc}
        onSave={(title:string, desc:string, iconUrl:string) => {
          handleSaveWorkflowInfo({
            title, desc, iconUrl,
          });
          setOpenWorkflowEdit(false);
        }}
      />
      <NewVersion
        open={openDupplicate}
        setOpen={(toOpen:boolean) => {
          setOpenDupplicate(toOpen);
          if (!toOpen) setVersionToCopy(undefined);
        }}
        versionTitle={`Copy of ${versionToCopy?.version}`}
        onSave={handleNewVersion}
      />
      <Space direction="vertical" className="w-full mt-8">
        <Space direction="horizontal">
          <Icon iconUrl={workflow.icon_url} size="medium" />
          {workflow.title}
        </Space>
        {workflow.desc}
        <Space direction="horizontal" className="flex justify-between">
          <Button
            type="link"
            onClick={() => setOpenWorkflowEdit(true)}
            icon={<EditOutlined />}
            className="text-violet-500 flex items-center p-0"
          >
            Edit workflow information
          </Button>
          <Space direction="horizontal">
            <Button
              type="default"
              className="flex items-center"
              icon={<PlusOutlined />}
              onClick={() => navigateToNewVersion()}
            >
              Create a new version
            </Button>
            {/* TODO: filter by workflow version! */}
            <Button
              type="default"
              icon={<PlusOutlined />}
              className="flex items-center bg-violet-500 text-white hover:text-white"
            >
              Create a new mission
            </Button>
          </Space>
        </Space>
      </Space>
      <Divider />
      <div className="flex items-center mb-6 container justify-between">
        <div className="text-gray-title font-semibold text-text_5 pl-1.5 flex flex-row items-center">
          <div className="flex flex-row items-center">
            <span className="inline-block">
              <ZapIcon />
            </span>
            <span className="ml-2 hover:text-slate-500 cursor-pointer">
              <span>
                Versions
              </span>
              <span className="mx-2">
                (
                {workflow.workflow_version.length}
                )
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-flow-row grid-cols-3 gap-4 justify-items-left">
        {workflow.workflow_version.map((version:any) => {
          return (
            <Card
              key={version.id}
              className={`w-[300px] ${versionToCopy?.id === version.id ? 'shadow-md shadow-violet-500' : null}`}
              onClick={() => navigateToVersion(version)}
              hoverable
              size="small"
            >
              <Space direction="vertical" size="large" className="w-full">
                {renderTag(version.status, version.recommended)}
                <Space direction="horizontal" size="large" className="flex justify-between w-full">
                  <Space direction="vertical" size="small" className="w-full">
                    <div className="font-bold">
                      {version.version}
                    </div>
                    <div className="text-xs">
                      Created on
                      <span className="mx-1">
                        {moment(version.created_at).format('YYYY-MM-DD HH:mm:ss')}
                      </span>
                    </div>
                  </Space>
                  <Popover
                    // trigger={['click']}
                    content={(
                      <Space direction="vertical" size="middle">
                        <Button
                          onClick={(e:any) => {
                            e.stopPropagation();
                            navigateToVersion(version);
                          }}
                          type="default"
                          className="w-full"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={(e:any) => {
                            e.stopPropagation();
                            setVersionToCopy(version);
                            setOpenDupplicate(true);
                          }}
                          type="default"
                          className="w-full"
                        >
                          Dupplicate
                        </Button>
                        {version.status === 'PUBLISHED' ?
                        (
                          <Button
                            type="default"
                            onClick={(e:any) => {
                              e.stopPropagation();
                              navigateToNewMission(version);
                            }}
                            className="w-full"
                          >
                            New Mission
                          </Button>
                        )
                        :
                        null
                      }
                      </Space>
                    )}
                  >
                    <Button
                      icon={<MoreOutlined />}
                      shape="circle"
                      className="flex items-center justify-center"
                    />
                  </Popover>
                </Space>
              </Space>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BluePrint;
