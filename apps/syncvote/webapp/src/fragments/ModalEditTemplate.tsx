import { config } from '@dal/config';
import { IOrgInfo, ITag } from '@types';
import { Modal, Space, Select, Input, SelectProps } from 'antd';
import { Banner } from 'banner';
import Icon from 'icon/src/Icon';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextEditor } from 'rich-text-editor';
import { useGetDataHook, useSetData } from 'utils';
import { newTag } from '@dal/data/tag';
import AddAndRemoveTag from './AddAndRemoveTag';
import { queryATemplate } from '@dal/data/template';

//TODO: Add 1 more column workflow desc

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
  workflow?: any;
};

// templateId === -1 => create new template
const ModalEditTemplate = ({
  onSaved = () => {},
  open = false,
  onCancel,
  templateId = -1,
  template = {},
  selectedOrgId,
  workflow,
}: ModalEditTemplateProps) => {
  const [title, setTitle] = useState(template.title || '');
  const [desc, setDesc] = useState(template.desc || '');
  const [iconUrl, setIconUrl] = useState(template.icon_url || '');
  const [bannerUrl, setBannerUrl] = useState(template.banner_url || '');
  const [orgId, setOrgId] = useState<number | undefined>(selectedOrgId);
  const [workflowId, setWorkflowId] = useState<number | undefined>(
    workflow?.id || undefined
  );
  const [optionTags, setOptionTags] = useState<ITag[]>();
  const [tagsForNewTemplate, setTagsForNewTemplate] =
    useState<(string | number)[]>();
  const [workflowVersionId, setWorkflowVersionId] = useState(-1);
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  const presetBanners = useGetDataHook({
    configInfo: config.queryPresetBanners,
  }).data;

  const orgs = useGetDataHook({
    configInfo: config.queryOrgs,
  }).data;

  const modalTitle =
    templateId === -1
      ? 'Publish a workflow template'
      : `Edit "${template.title}" template`;

  const reset = () => {
    if (templateId === -1) {
      if (!workflow) {
        setIconUrl('');
        setBannerUrl('');
        setTitle('');
        setOrgId(selectedOrgId);
        setWorkflowId(undefined);
      }
      setDesc('');
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
      if (workflow) {
        const w = { ...workflow };
        const versions = w.workflow_version || [];

        for (var i = 0; i < versions.length; i++) {
          if (
            versions[i].status === 'PUBLISHED' ||
            versions[i].status === 'PUBLIC_COMMUNITY'
          ) {
            w.published_version_id = versions[i].id;
            break;
          }
        }

        setWorkflowVersionId(w?.published_version_id || -1);
        setIconUrl(w?.icon_url ? w.icon_url : '');
        setBannerUrl(w?.banner_url ? w.banner_url : '');
        setTitle('Template of ' + w?.title);
      }
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

  const onTagsChange = (tags: any) => {
    setTagsForNewTemplate(tags);
  };

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

        console.log(workflowVersionId);

        onCancel();

        await useSetData({
          params: toSaveData,
          configInfo: config.upsertTemplate,
          dispatch: dispatch,
          onSuccess: async (data: any) => {
            setData(data);
            const templateIdAfterCreated = data[0].id;
            if (templateId === -1 && tagsForNewTemplate && optionTags) {
              const allTagsToInsert = [];
              for (const tagId of tagsForNewTemplate) {
                if (typeof tagId === 'number') {
                  const label = optionTags.find(
                    (tag: any) => tag.value === tagId
                  )?.label;
                  if (label) {
                    allTagsToInsert.push({
                      value: tagId,
                      label,
                    });
                  }
                }
                if (typeof tagId === 'string') {
                  const { data: newTagData } = await newTag({
                    dispatch,
                    tag: tagId,
                  });
                  if (newTagData) {
                    allTagsToInsert.push(newTagData);
                  }
                }
              }
              const { data: dataATemplate, error } = await queryATemplate({
                dispatch,
                templateId: templateIdAfterCreated,
              });

              await useSetData({
                params: {
                  template: { ...dataATemplate, status: true },
                  newTags: allTagsToInsert,
                },
                configInfo: config.updateATemplateTag,
                dispatch: dispatch,
                onSuccess: () => {
                  setTagsForNewTemplate([]);
                  setOptionTags([]);
                },
              });
            }
          },
          onError: (error: any) => {
            setError(error);
          },
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
              disabled={workflowId !== undefined}
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
            <AddAndRemoveTag
              templateId={templateId}
              onTagsChange={onTagsChange}
              setOptionTags={setOptionTags}
            />
          </Space>
        </Space>
      </Space>
    </Modal>
  );
};

export default ModalEditTemplate;
