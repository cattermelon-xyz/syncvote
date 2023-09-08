import { upsertTemplate } from '@middleware/data/template';
import { IOrgInfo } from '@types';
import { Modal, Space, Select, Input } from 'antd';
import { Banner } from 'banner';
import Icon from 'icon/src/Icon';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextEditor } from 'rich-text-editor';

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
  onSaved?: (data: any) => void;
  open: boolean;
  onCancel: () => void;
  templateId?: number;
  template?: any;
  selectedOrgId?: number;
};

// templateId === -1 => create new template
const ModalEditTemplate = ({
  onSaved = () => {},
  open = false,
  onCancel,
  templateId = -1,
  template = {},
  selectedOrgId,
}: ModalEditTemplateProps) => {
  const [title, setTitle] = useState(template.title || '');
  const [desc, setDesc] = useState(template.desc || '');
  const [iconUrl, setIconUrl] = useState(template.icon_url || '');
  const [bannerUrl, setBannerUrl] = useState(template.banner_url || '');
  const [orgId, setOrgId] = useState<number | undefined>(selectedOrgId);
  const [workflowId, setWorkflowId] = useState<number | undefined>(undefined);
  const [workflowVersionId, setWorkflowVersionId] = useState(-1);
  const { presetIcons, presetBanners } = useSelector((state: any) => state.ui);
  const { orgs } = useSelector((state: any) => state.orginfo);
  const dispatch = useDispatch();
  const modalTitle =
    templateId === -1
      ? 'Publish a workflow template'
      : `Edit "${template.title}" template`;
  const reset = () => {
    if (templateId === -1) {
      setIconUrl('');
      setBannerUrl('');
      setTitle('');
      setDesc('');
      setOrgId(selectedOrgId);
      setWorkflowId(undefined);
    }
  };
  const [options, setOptions] = useState<{
    workflows: WorkflowSelectOption[];
    orgs: OrgSelectOption[];
  }>({
    workflows: [],
    orgs: [],
  });
  const setupOptions = async () => {
    if (orgs) {
      let adminOrgsData = [];
      adminOrgsData = orgs.filter((org: any) => org.role === 'ADMIN');
      const workflows = adminOrgsData.flatMap((adminOrg: any) =>
        adminOrg.workflows.map((workflow: any) => ({
          ...workflow,
          org_title: adminOrg.title,
        }))
      );
      workflows.map((workflow: any) => {
        const versions = workflow.versions || [];
        for (var i = 0; i < versions.length; i++) {
          if (
            versions[i].status === 'PUBLISHED' ||
            versions[i].status === 'PUBLIC_COMMUNITY'
          ) {
            workflow.published_version_id = versions[i].id;
            break;
          }
        }
      });
      // Querry from org
      setOptions({
        workflows: workflows
          .filter((w: any) => w.published_version_id !== undefined)
          .map((w: any) => ({
            value: w.id || -1,
            label: w.title || '',
            owner_org_id: w.owner_org_id || -1,
            icon_url: w.icon_url || '',
            banner_url: w.banner_url || '',
            published_version_id: w.published_version_id || -1,
          })),
        orgs: orgs.map((o: IOrgInfo) => ({ value: o.id, label: o.title })),
      });
    } else {
      // TODO: query orgs here!
    }
  };
  useEffect(() => {
    setTitle(template.title || '');
    setIconUrl(template.icon_url || '');
    setBannerUrl(template.banner_url || '');
    setDesc(template.desc || '');
  }, [template]);
  useEffect(() => {
    setupOptions();
  }, [orgs]);
  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={() => {
        onCancel();
        reset();
      }}
      onOk={async () => {
        const toSaveData = {
          templateId,
          orgId: orgId || template.owner_org_id,
          workflowId,
          title,
          desc,
          iconUrl,
          bannerUrl,
          workflowVersionId,
        };
        onCancel();
        const { data, error } = await upsertTemplate({
          dispatch,
          ...toSaveData,
        });
        if (error) {
          Modal.error({
            title: 'Error',
            content: error.toString(),
          });
        } else {
          Modal.success({
            title: 'Success',
            content: templateId
              ? 'Your template has been saved!'
              : 'Your template has been published!',
          });
          onSaved(data);
        }
        reset();
      }}
      okText={templateId === -1 ? 'Publish' : 'Save'}
    >
      <Space direction='vertical' size='middle' className='w-full'>
        <Space direction='vertical' size='small' className='w-full'>
          {template.owner_org_id ? (
            <></>
          ) : (
            <>
              <div>Choose a workspace</div>
              <Select
                options={options.orgs}
                className='w-full'
                onChange={(value: number) => {
                  setOrgId(value);
                  setWorkflowId(undefined);
                }}
                value={orgId}
                disabled={selectedOrgId !== undefined}
              />
            </>
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