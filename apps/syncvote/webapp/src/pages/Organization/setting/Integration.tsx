import { useEffect, useState } from 'react';
import {
  DeleteOutlined,
  GoogleOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import Discord from '@assets/icons/svg-icons/Discord';
import { Button, Space, Form, Input, Modal, Drawer, Card } from 'antd';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { extractIdFromIdString } from 'utils';
import { IWeb2Integration } from '@types';
import { upsertDiscourseIntegration } from '@dal/data';
import { useDispatch } from 'react-redux';

type LayoutType = Parameters<typeof Form>[0]['layout'];

const { TWITTER_CLIENT_ID, TWITTER_BASE_URL } = import.meta.env;

const Twitter = ({
  username,
  refresh_token_expires_at,
  updated_at,
  id,
  onDelete,
}: {
  username: string;
  refresh_token_expires_at: number;
  updated_at: string;
  id: string;
  onDelete: (id: string) => void;
}) => {
  return (
    <Space
      direction='horizontal'
      className='rounded border px-4 py-2 w-full justify-between'
      size='large'
    >
      <Space direction='horizontal' className='flex items-center' size='large'>
        <TwitterOutlined className='text-4xl text-blue-500' />
        <Space direction='vertical'>
          <div>
            <a
              href={`https://twitter.com/${username}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              @{username}
            </a>
            <div className='text-xs inline bg-slate-100 p-1 rounded ml-2'>
              <span>Acquired </span>
              {moment(updated_at).fromNow()}
            </div>
          </div>
          <div>
            <span>Expires </span>
            {moment(refresh_token_expires_at).fromNow()}
          </div>
        </Space>
      </Space>
      <Button
        className='flex items-center mr-2'
        icon={<DeleteOutlined />}
        type='text'
        onClick={() => {
          onDelete(id);
        }}
      >
        Delete
      </Button>
    </Space>
  );
};

const Integration = ({
  integrations,
  onDelete,
}: {
  integrations: any[];
  onDelete: (id: string) => void;
}) => {
  const { orgIdString } = useParams();
  const dispatch = useDispatch();
  const orgId = extractIdFromIdString(orgIdString);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [discourseData, setDiscourseData] = useState<any>();
  const codeChallenge = 'code_challenge';
  const twitterUrl =
    'https://twitter.com/i/oauth2/authorize' +
    '?response_type=code' +
    `&client_id=${encodeURIComponent(TWITTER_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(TWITTER_BASE_URL)}` +
    '&scope=tweet.read%20users.read%20tweet.write%20offline.access' +
    `&state=${orgId}&code_challenge=${codeChallenge}` +
    '&code_challenge_method=plain';
  const [form] = Form.useForm();

  useEffect(() => {
    const dataFiltered = integrations.filter(
      (intergration: any) => intergration.provider === 'discourse'
    );
    setDiscourseData(dataFiltered[0]);
  }, [integrations]);

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  const handleDiscourseInfo = async () => {
    try {
      const values = await form.validateFields();
      await upsertDiscourseIntegration({
        discourseData: {
          orgId,
          apiKey: values.apikey,
          username: values.username,
          categoryId: values.categoryid,
          discourseUrl: values.url,
        },
        onSuccess: (data: any) => {
          Modal.success({
            title: 'Success',
            content: 'Update discourse configuration successfully',
          });
          setDiscourseData((currentData: any) => ({
            ...currentData,
            id_string: values.url,
            access_token: values.apikey,
            username: values.username,
            category_id: values.categoryid,
          }));
          onClose();
        },
        onError: (error) => {
          Modal.error({
            title: 'Error',
            content: error,
          });
          onClose();
        },
        dispatch,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='mt-4 contaner pl-8 pr-8 w-full'>
      <Space direction='vertical' size='large' className='w-full'>
        <div>
          <h2>Integrations</h2>
          <div className='mt-2'>
            <Space direction='horizontal'>
              <Button
                icon={<TwitterOutlined />}
                type='dashed'
                className='flex items-center'
                onClick={() => {
                  window.open(twitterUrl, '_blank', 'noopener,noreferrer');
                }}
                disabled
              >
                Connect
              </Button>
              <Button
                icon={<GoogleOutlined />}
                type='dashed'
                className='flex items-center'
                disabled
              >
                Connect
              </Button>
              <Button
                icon={<Discord />}
                type='dashed'
                className='flex items-center'
                disabled
              >
                Connect
              </Button>
              <Button
                icon={<Discord />}
                type='dashed'
                className='flex items-center'
                onClick={showDrawer}
              >
                Discourse
              </Button>
            </Space>
          </div>
        </div>
        <div>
          <h3>Active authentication</h3>
          <div className='mt-2'>
            {integrations.map((integration: IWeb2Integration) => {
              return integration.provider === 'twitter' ? (
                <div key={integration.id}>
                  <Twitter
                    id={integration.id}
                    username={integration.username}
                    refresh_token_expires_at={
                      integration.refresh_token_expires_at
                    }
                    updated_at={integration.updated_at}
                    onDelete={onDelete}
                  />
                </div>
              ) : integration.provider === 'discourse' && discourseData ? (
                <Card className='w-1/2' key={integration.id}>
                  <div className='flex flex-col gap-2'>
                    <p>{`Your discourse URL: ${discourseData?.id_string}`}</p>
                    <p>{`Api key: ${discourseData?.access_token}`}</p>
                    <p>{`Username: ${discourseData?.username}`}</p>
                    <p>{`Category id: ${discourseData?.category_id}`}</p>
                  </div>
                </Card>
              ) : null;
            })}
          </div>
          <Drawer
            title='Discourse configuration'
            placement='right'
            onClose={onClose}
            open={openDrawer}
          >
            <Form
              form={form}
              layout='vertical'
              initialValues={{
                url: discourseData?.id_string,
                apikey: discourseData?.access_token,
                username: discourseData?.username,
                categoryid: discourseData?.category_id,
              }}
            >
              <Form.Item
                label='Your discourse URL'
                name='url'
                rules={[
                  {
                    required: true,
                    message: 'Please input your discourse URL',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label='Api Key'
                name='apikey'
                rules={[
                  {
                    required: true,
                    message: 'Please input your api key',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label='Username'
                name='username'
                rules={[
                  {
                    required: true,
                    message: 'Please input your username',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label='Category id'
                name='categoryid'
                rules={[
                  {
                    required: true,
                    message: 'Please input your category id',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={handleDiscourseInfo}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Drawer>
        </div>
      </Space>
    </div>
  );
};

export default Integration;
