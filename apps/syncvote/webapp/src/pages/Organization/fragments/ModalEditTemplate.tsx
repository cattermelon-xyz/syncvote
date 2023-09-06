import { Modal, Space, Select, Input } from 'antd';
import { Banner } from 'banner';
import Icon from 'icon/src/Icon';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { TextEditor } from 'rich-text-editor';
import { getImageUrl } from 'utils';

type OrgSelectOption = {
  value: number;
  label: string;
};
type WorkflowSelectOption = {
  value: number;
  label: string;
  owner_org_id: number;
  icon_url: string;
  banner_url: string;
  published_version_id?: number;
};
type ModalEditTemplateProps = {
  onSave: (toSaveData: any) => void;
  open: boolean;
  onCancel: () => void;
  templateId?: number;
  template?: any;
  options?: {
    workflows?: WorkflowSelectOption[];
    orgs?: OrgSelectOption[];
  };
};

// templateId === -1 => create new template
const ModalEditTemplate = ({
  onSave,
  open = false,
  onCancel,
  templateId = -1,
  template = {},
  options = {
    workflows: [],
    orgs: [],
  },
}: ModalEditTemplateProps) => {
  const [title, setTitle] = useState(template.title || '');
  const [desc, setDesc] = useState(template.desc || '');
  const [iconUrl, setIconUrl] = useState(template.icon_url || '');
  const [bannerUrl, setBannerUrl] = useState(template.banner_url || '');
  const [orgId, setOrgId] = useState<number | null>(null);
  const [workflowId, setWorkflowId] = useState<number | null>(null);
  const [workflowVersionId, setWorkflowVersionId] = useState(-1);
  const { presetIcons, presetBanners } = useSelector((state: any) => state.ui);
  const modalTitle =
    templateId === -1
      ? 'Publish a workflow template'
      : `Edit ${template.title} template`;
  const reset = () => {
    setIconUrl('');
    setBannerUrl('');
    setTitle('');
    setDesc('');
    setOrgId(null);
    setWorkflowId(null);
  };

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={() => {
        onCancel();
        reset();
      }}
      onOk={() => {
        onSave({
          templateId,
          orgId,
          workflowId,
          title,
          desc,
          iconUrl,
          bannerUrl,
          workflowVersionId,
        });
        // reset();
        // onCancel();
      }}
      okText={templateId === -1 ? 'Publish' : 'Save'}
    >
      <Space direction='vertical' size='middle' className='w-full'>
        <Space direction='vertical' size='small' className='w-full'>
          <div>Choose a workspace</div>
          {template.owner_org_id ? (
            <Input value={template.org_title} disabled className='w-full' />
          ) : (
            <Select
              options={options.orgs}
              className='w-full'
              onChange={(value: number) => {
                setOrgId(value);
                setWorkflowId(null);
              }}
              value={orgId}
            />
          )}
        </Space>
        {template.owner_org_id === undefined ? (
          <Space direction='vertical' size='small' className='w-full'>
            <div>Choose a workflow</div>
            <Select
              options={options.workflows?.filter(
                (w: any) => w.owner_org_id === orgId
              )}
              className='w-full'
              onChange={(value: number) => {
                setWorkflowId(value);
                const w = options.workflows?.find(
                  (w: any) => w.value === value
                );
                console.log(w);
                setWorkflowVersionId(w?.published_version_id || -1);
                setIconUrl(w?.icon_url ? w.icon_url : '');
                setBannerUrl(w?.banner_url ? w.banner_url : '');
                setTitle('Template of ' + w?.label);
              }}
              value={workflowId}
            />
          </Space>
        ) : null}
        <Banner
          bannerUrl={bannerUrl}
          presetBanners={presetBanners}
          onChange={(e: any) => {
            const { filePath, isPreset } = e;
            const url = isPreset ? 'preset:' + filePath : filePath;
            setBannerUrl(url);
          }}
          editable
        />
        <Space
          direction='horizontal'
          size='small'
          className='w-full items-start'
        >
          <Icon
            iconUrl={iconUrl}
            presetIcon={presetIcons}
            onUpload={(e) => {
              const { filePath, isPreset } = e;
              const url = isPreset ? 'preset:' + filePath : filePath;
              setIconUrl(url);
            }}
            editable
          />
          <Space direction='vertical' size='middle' className='w-full'>
            <Space direction='vertical' size='middle' className='w-full'>
              <div>
                Template name <span className='text-red'>*</span>
              </div>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Space>
            <Space direction='vertical' size='small' className='w-full'>
              <div>Template description</div>
              <TextEditor
                value={desc}
                setValue={(str: string) => setDesc(str)}
              />
            </Space>
          </Space>
        </Space>
      </Space>
    </Modal>
  );
};

export default ModalEditTemplate;
