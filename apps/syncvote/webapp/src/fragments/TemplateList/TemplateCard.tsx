import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { config } from '@dal/config';
import { Button, Card, Popover, Space } from 'antd';
import { Banner } from 'banner';
import Icon from 'icon/src/Icon';
import { createIdString, useGetDataHook } from 'utils';

export const TemplateCard = ({
  template,
  navigate,
  editClickHandler = () => {},
  deleteClickHandler = () => {},
  unpublishClickHandler = () => {},
  publishClickHandler = () => {},
}: {
  template: any;
  navigate: any;
  editClickHandler?: any;
  deleteClickHandler?: any;
  unpublishClickHandler?: any;
  publishClickHandler?: any;
}) => {
  const { title, id, icon_url, banner_url, owner_org_id, status } = template;

  const orgs = useGetDataHook({
    configInfo: config.queryOrgs,
  }).data;

  const canEdit =
    orgs.find((org: any) => org.id === owner_org_id)?.role === 'ADMIN';
  return (
    <>
      <Card
        hoverable={true}
        style={{ position: 'relative' }}
        className='w-[256px] h-[176px] relative rounded-xl cursor-default'
      >
        <div
          onClick={() => {
            navigate('/template/' + createIdString(title, id.toString()));
          }}
          className='cursor-pointer -mb-2'
        >
          <Banner
            presetBanners={[]}
            bannerUrl={banner_url}
            className='w-full h-[86px] rounded-lg m-0'
          />
          <Icon
            iconUrl={icon_url}
            size='medium'
            presetIcon={[]}
            className='-top-2 left-2'
          />
        </div>
        <div className='flex items-center justify-between w-full my-1'>
          <div className='w-2/3 flex'>
            <div
              className='text-xs text-[#252422] truncate-2-lines cursor-pointer hover:text-violet-500'
              onClick={() => {
                navigate('/template/' + createIdString(title, id.toString()));
              }}
            >
              {title}
            </div>
            {status === false ? (
              <EyeInvisibleOutlined className='ml-1' />
            ) : null}
          </div>
          {canEdit ? (
            <Popover
              content={
                <Space direction='vertical' size='middle'>
                  <Space
                    direction='horizontal'
                    size='small'
                    className='cursor-pointer hover:text-violet-500'
                    onClick={editClickHandler}
                  >
                    <EditOutlined />
                    Edit
                  </Space>
                  {template.status === true ? (
                    <Space
                      direction='horizontal'
                      size='small'
                      className='cursor-pointer hover:text-violet-500 border-0 border-solid border-b border-gray-200 pb-1'
                      onClick={unpublishClickHandler}
                    >
                      <EyeInvisibleOutlined />
                      UnPublish
                    </Space>
                  ) : (
                    <Space
                      direction='horizontal'
                      size='small'
                      className='cursor-pointer hover:text-violet-500 border-0 border-solid border-b border-gray-200 pb-1'
                      onClick={publishClickHandler}
                    >
                      <EyeOutlined />
                      Publish
                    </Space>
                  )}
                  <Space
                    direction='horizontal'
                    size='small'
                    className='cursor-pointer hover:text-red-500'
                    onClick={deleteClickHandler}
                  >
                    <DeleteOutlined />
                    Delete
                  </Space>
                </Space>
              }
            >
              <Button type='text' icon={<EllipsisOutlined />} />
            </Popover>
          ) : null}
        </div>
      </Card>
    </>
  );
};
