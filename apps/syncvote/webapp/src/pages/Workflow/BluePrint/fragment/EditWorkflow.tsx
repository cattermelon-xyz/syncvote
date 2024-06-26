import { Banner } from 'banner';
import { TextEditor } from 'rich-text-editor';
import { Icon } from 'icon';
import { newTag } from '@dal/data/tag';
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
import { useDispatch } from 'react-redux';
import { useGetDataHook, useSetData } from 'utils';
import { config } from '@dal/config';
import SaveOutlined from '@ant-design/icons/lib/icons/SaveOutlined';

const EditWorkflow = ({
  open,
  setOpen,
  workflow,
  onSave,
  onStatusChange,
  handleSave,
}: {
  open: boolean;
  setOpen: (data: boolean) => void;
  workflow: IWorkflow;
  onSave: ({
    title,
    desc,
    iconUrl,
    bannerUrl,
  }: {
    title?: string | undefined;
    desc?: string | undefined;
    iconUrl?: string | undefined;
    bannerUrl?: string | undefined;
  }) => Promise<void>;
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
  handleSave: (mode: 'data' | 'info' | undefined, changedData?: any) => void;
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
  const [tempBannerUrl, setTempBannerUrl] = useState(
    workflow?.banner_url || ''
  );
  const [tempIconUrl, setTempIconUrl] = useState(workflow?.icon_url || '');
  const [tempTitle, setTempTitle] = useState(workflowTitle);
  const [tempDesc, setTempDesc] = useState(workflowDesc);

  const presetBanners = useGetDataHook({
    configInfo: config.queryPresetBanners,
  }).data;

  const tags: ITag[] = useGetDataHook({
    configInfo: config.queryTag,
  }).data;

  const dispatch = useDispatch();

  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  const handleSaveChanges = async () => {
    setOpen(false);
    await onSave({
      title: tempTitle,
      desc: tempDesc,
      bannerUrl: tempBannerUrl,
      iconUrl: tempIconUrl,
    });
    setTitle(tempTitle);
    setDesc(tempDesc);
    setOpen(true);
  };

  useEffect(() => {
    setTitle(workflow?.title);
    setDesc(workflow?.desc);
    setIconUrl(workflow?.icon_url);
    setStatus(workflow?.workflow_version[0]?.status);
    setExistedTags(workflow?.tags || []);
  }, [open]);

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

    await useSetData({
      params: { workflow: workflow, newTags: newTags },
      configInfo: config.updateAWorkflowTag,
      dispatch: dispatch,
      onSuccess: () => {
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
      size='large'
      bodyStyle={{ padding: '0px', backgroundColor: '#f6f6f6', width: '100%' }}
    >
      <div className='relative w-full'>
        <Banner
          presetBanners={presetBanners}
          bannerUrl={tempBannerUrl || workflow?.banner_url || ''}
          onChange={({ filePath, isPreset }) => {
            const newBannerUrl = isPreset ? `preset:${filePath}` : filePath;
            setTempBannerUrl(newBannerUrl);
          }}
          editable
        />
        <div className='absolute -bottom-[30px] left-[16px]'>
          <Icon
            presetIcon={presetIcons}
            size='xlarge'
            iconUrl={tempIconUrl || iconUrl}
            editable
            onUpload={({ filePath, isPreset }) => {
              const newIconUrl = isPreset ? `preset:${filePath}` : filePath;
              setTempIconUrl(newIconUrl);
            }}
          />
        </div>
      </div>
      <Space direction='vertical' size='large' className='px-4 py-10 w-full'>
        <Space
          direction='vertical'
          size='small'
          className='p-4 rounded-lg bg-white w-full'
        >
          <Space direction='vertical' size='small' className='w-full'>
            <div>Workflow name</div>
            <Input
              value={tempTitle || workflow?.title}
              onChange={(e) => setTempTitle(e.target.value)}
            />
          </Space>
          <Space direction='vertical' size='small' className='w-full'>
            <div>Description</div>
            <TextEditor
              value={tempDesc || workflow?.desc}
              setValue={(val: any) => setTempDesc(val)}
            />
          </Space>
        </Space>
        <Space
          direction='vertical'
          size='small'
          className='p-4 rounded-lg bg-white w-full'
        >
          {/* <Space
            direction='horizontal'
            className='px-2 py-2 bg-zinc-100 flex justify-between rounded-lg'
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
          <Space direction='vertical' className='w-full'>
            <div>Tags</div>
            <Select
              className='w-full'
              mode='tags'
              options={options}
              onChange={onChangeTagValue}
              value={existedTags}
            />
          </Space> */}
        </Space>
        <Button
          type='default'
          className='w-full'
          icon={<SaveOutlined />}
          onClick={async () => {
            setOpen(false);
            await onSave({ title: tempTitle, desc: tempDesc, bannerUrl: tempBannerUrl, iconUrl: tempIconUrl });
            setTitle(tempTitle);
            setOpen(true);
            handleSave('data');
          }}
        >
          Save
        </Button>
      </Space>
    </Drawer>
  );
};

export default EditWorkflow;
