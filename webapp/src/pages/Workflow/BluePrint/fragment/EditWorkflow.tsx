import { SaveOutlined } from '@ant-design/icons';
import Banner from '@components/Banner/Banner';
import TextEditor from '@components/Editor/TextEditor';
import Icon from '@components/Icon/Icon';
import { updateAWorkflowTag } from '@middleware/data';
import { newTag, queryTag } from '@middleware/data/tag';
import { ITag, IWorkflow } from '@types';
import {
  Button,
  Drawer,
  Input,
  Select,
  SelectProps,
  Space,
  Switch,
} from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const EditWorkflow = ({
  open,
  setOpen,
  workflow,
  onSave,
  onStatusChange,
}: {
  open: boolean;
  setOpen: (data: boolean) => void;
  workflow: IWorkflow;
  onSave: ({
    title,
    desc,
    iconUrl,
  }: {
    title?: string | undefined;
    desc?: string | undefined;
    iconUrl?: string | undefined;
  }) => void;
  onStatusChange: ({
    status,
    versionId,
    onSuccess,
    onError,
  }: {
    status: string;
    versionId: number;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
  }) => void;
}) => {
  const {
    title: workflowTitle,
    desc: workflowDesc,
    icon_url: workflowIcon,
  } = workflow || {
    title: '',
    desc: '',
    icon_url: '',
  };
  const originalTitle = workflowTitle;
  const originalDesc = workflowDesc;
  const [title, setTitle] = useState(workflowTitle);
  const [desc, setDesc] = useState(workflowDesc);
  const [iconUrl, setIconUrl] = useState(workflowIcon);
  const [status, setStatus] = useState(workflow?.workflow_version[0]?.status);
  const tags: ITag[] = useSelector((state: any) => state.ui.tags) || [];
  const dispatch = useDispatch();
  useEffect(() => {
    setTitle(workflow?.title);
    setDesc(workflow?.desc);
    setIconUrl(workflow?.icon_url);
    setStatus(workflow?.workflow_version[0]?.status);
    setExistedTags(workflow?.tags || []);
    if (tags.length === 0) {
      queryTag({ dispatch });
    }
  }, [open, tags]);
  const options: SelectProps['options'] = tags;
  const [existedTags, setExistedTags] = useState(workflow?.tags || []);
  const allTags = [...tags];
  existedTags.forEach((tag: any) => {
    tags.findIndex((t) => t.value === tag.value) === -1
      ? allTags.push(tag)
      : '';
  });
  const onChangeTagValue = async (tagIds: any[]) => {
    const newTags: ITag[] = [];
    setOpen(false);
    tagIds.forEach((tagId) => {
      if (typeof tagId === 'number') {
        const label = allTags.find((tag: any) => tag.value === tagId)?.label;
        if (label) {
          newTags.push({
            value: tagId,
            label,
          });
        }
      }
    });
    if (typeof tagIds[tagIds.length - 1] === 'string') {
      const { data: newTagData } = await newTag({
        dispatch,
        tag: tagIds[tagIds.length - 1],
      });
      if (newTagData) {
        newTags.push(newTagData);
      }
    }
    await updateAWorkflowTag({
      workflow,
      dispatch,
      newTags,
      onSuccess: (data) => {
        setOpen(true);
      },
    });
  };
  return (
    <Drawer
      headerStyle={{ display: 'none' }}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      size="large"
      bodyStyle={{ padding: '0px', backgroundColor: '#f6f6f6', width: '100%' }}
    >
      <div className="relative w-full">
        <Banner banner_url={workflow?.banner_url || ''} onSave={() => {}} />
        <div className="absolute -bottom-[30px] left-[16px]">
          <Icon
            size="xlarge"
            iconUrl={iconUrl}
            editable
            onUpload={async ({ filePath, isPreset }) => {
              const newIconUrl = isPreset ? `preset:${filePath}` : filePath;
              setOpen(false);
              await onSave({
                iconUrl: newIconUrl,
              });
              setOpen(true);
            }}
          />
        </div>
      </div>
      <Space direction="vertical" size="large" className="px-4 py-10 w-full">
        <Space
          direction="vertical"
          size="small"
          className="p-4 rounded-lg bg-white w-full"
        >
          <Space direction="vertical" size="small" className="w-full">
            <div>Workflow name</div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={async () => {
                if (title !== originalTitle) {
                  setOpen(false);
                  await onSave({
                    title,
                  });
                  setOpen(true);
                }
              }}
            />
          </Space>
          <Space direction="vertical" size="small" className="w-full">
            <div>Description</div>
            <TextEditor
              value={desc}
              setValue={(val: any) => setDesc(val)}
              heightEditor={200}
              onBlur={async () => {
                if (desc !== originalDesc) {
                  setOpen(false);
                  await onSave({
                    desc,
                  });
                  setOpen(true);
                }
              }}
            />
          </Space>
        </Space>
        <Space
          direction="vertical"
          size="small"
          className="p-4 rounded-lg bg-white w-full"
        >
          <Space
            direction="horizontal"
            className="px-2 py-2 bg-zinc-100 flex justify-between rounded-lg"
          >
            <div>Publish to Synvote community?</div>
            <Switch
              checked={status === 'PUBLIC_COMMUNITY'}
              onChange={async (checked) => {
                if (workflow.workflow_version[0].id) {
                  setOpen(false);
                  const status = checked ? 'PUBLIC_COMMUNITY' : 'DRAFT';
                  await onStatusChange({
                    status,
                    versionId: workflow.workflow_version[0].id,
                    onSuccess: (data: any) => {
                      setOpen(true);
                    },
                    onError: (error: any) => {},
                  });
                }
              }}
            />
          </Space>
          <Space direction="vertical" className="w-full">
            <div>Tags</div>
            <Select
              className="w-full"
              mode="tags"
              options={options}
              onChange={onChangeTagValue}
              value={existedTags}
            />
          </Space>
        </Space>
        {/* <Button
          type="default"
          className="w-full"
          icon={<SaveOutlined />}
          onClick={() => onSave(title, desc, iconUrl)}
        >
          Save
        </Button> */}
      </Space>
    </Drawer>
  );
};

export default EditWorkflow;
