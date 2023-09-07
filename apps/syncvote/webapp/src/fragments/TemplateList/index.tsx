import { useFilteredData } from '@utils/hooks/useFilteredData';
import { ListItem } from 'list-item';
import { useEffect, useState } from 'react';
import { TemplateCard } from './TemplateCard';
import { useNavigate } from 'react-router-dom';
import { Button, Empty, Space, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ModalEditTemplate from '@fragments/ModalEditTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTemplate, upsertTemplate } from '@middleware/data/template';

// interface ITemplate {
//   id?: number;
//   title?: string;
//   desc?: string;
//   icon_url?: string;
//   banner_url?: string;
//   owner_org_id?: number;
//   current_version_id?: number;
//   // status: string;
// }
type TemplateListProps = {
  templates: any[];
  orgId?: number;
};
interface SortProps {
  by: string;
  type: 'asc' | 'des';
}
/*
 * This component include both list of TemplateCard and PublishTemplate button
 */
const TemplateList = ({ templates, orgId }: TemplateListProps) => {
  const { orgs } = useSelector((state: any) => state.orginfo);
  const [sortTemplateOptions, setSortTemplateOptions] = useState<SortProps>({
    by: 'Last modified',
    type: 'des',
  });
  const filterTemplateByOptions = useFilteredData(
    templates || [],
    sortTemplateOptions
  );
  const navigate = useNavigate();
  const [editingTemplateId, setEditingTemplateId] = useState(-1);
  const [showModalEditTemplate, setShowModalEditTemplate] = useState(false);
  const [canPublishTemplate, setCanPublishTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>({});
  const dispatch = useDispatch();
  const handleSortTemplate = (options: SortProps) => {
    setSortTemplateOptions(options);
  };
  useEffect(() => {
    for (var i = 0; i < orgs.length; i++) {
      if (orgs[i].role === 'ADMIN') {
        for (var j = 0; j < orgs[j].workflows.length; j++) {
          for (var k = 0; k < orgs[j].workflows[k].versions.length; k++) {
            if (
              ['PUBLIC_COMMUNITY', 'PUBLISHED'].indexOf(
                orgs[j].workflows[j].versions[k]?.status
              ) !== -1
            ) {
              setCanPublishTemplate(true);
              break;
            }
          }
        }
      }
    }
  }, [orgs]);
  return (
    <>
      <ModalEditTemplate
        templateId={editingTemplateId}
        open={showModalEditTemplate}
        onCancel={() => {
          setShowModalEditTemplate(false);
        }}
        template={selectedTemplate}
        selectedOrgId={orgId}
      />
      {filterTemplateByOptions && filterTemplateByOptions.length > 0 ? (
        <ListItem
          handleSort={handleSortTemplate}
          items={
            filterTemplateByOptions &&
            filterTemplateByOptions?.map((template, index) => (
              <TemplateCard
                template={template}
                navigate={navigate}
                editClickHandler={() => {
                  setEditingTemplateId(template.id);
                  setSelectedTemplate(template);
                  setShowModalEditTemplate(true);
                }}
                deleteClickHandler={() => {
                  Modal.confirm({
                    title: `Delete "${template.title}" template"`,
                    content: `Are you sure you want to delete this template? This action cannot be undone and all associated data will be permanently removed from the system.`,
                    okText: 'Delete',
                    onOk: () => {
                      deleteTemplate({
                        dispatch,
                        templateId: template.id,
                        orgId: template.owner_org_id,
                      });
                    },
                    icon: <></>,
                    okButtonProps: { danger: true },
                  });
                }}
                unpublishClickHandler={() => {
                  Modal.confirm({
                    title: `Unpublish "${template.title}" template"`,
                    content: `Are you sure you want to unpublish this template? This action cannot be undone, and all related data will be hidden from public view. Confirm to proceed or cancel to keep the template published.`,
                    okText: 'Unpublish',
                    icon: <></>,
                    okButtonProps: { className: 'bg-violet-700' },
                    onOk: () => {
                      upsertTemplate({
                        dispatch,
                        templateId: template.id,
                        orgId: template.owner_org_id,
                        status: false,
                      });
                    },
                  });
                }}
                publishClickHandler={() => {
                  upsertTemplate({
                    dispatch,
                    templateId: template.id,
                    orgId: template.owner_org_id,
                    status: true,
                  });
                }}
              />
            ))
          }
          columns={{ sm: 2, md: 3, xl: 3, '2xl': 3 }}
          extra={
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => setShowModalEditTemplate(true)}
              disabled={!canPublishTemplate}
            >
              New Template
            </Button>
          }
        />
      ) : (
        <Space className='w-full' direction='vertical'>
          <div className='w-full flex flex-col items-end'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => setShowModalEditTemplate(true)}
              disabled={!canPublishTemplate}
            >
              New Template
            </Button>
          </div>
          <Empty />
        </Space>
      )}
    </>
  );
};

export default TemplateList;
