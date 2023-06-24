import { DeleteOutlined, GoogleOutlined, TwitterOutlined } from '@ant-design/icons';
import Discord from '@assets/icons/svg-icons/Discord';
import { Button, Space } from 'antd';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { extractIdFromIdString } from '@utils/helpers';
import { IWeb2Integration } from '@types';

const { TWITTER_CLIENT_ID, TWITTER_BASE_URL } = import.meta.env;

const Twitter = ({
  username, refresh_token_expires_at, updated_at, id, onDelete,
}: {
username: string;
refresh_token_expires_at: number;
updated_at: string;
id: string;
onDelete: (id: string) => void;
}) => {
return (
  <Space direction="horizontal" className="rounded border px-4 py-2 w-full justify-between" size="large">
    <Space direction="horizontal" className="flex items-center" size="large">
      <TwitterOutlined className="text-4xl text-blue-500" />
      <Space direction="vertical">
        <div>
          <a
            href={`https://twitter.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            @
            {username}
          </a>
          <div className="text-xs inline bg-slate-100 p-1 rounded ml-2">
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
      className="flex items-center mr-2"
      icon={<DeleteOutlined />}
      type="text"
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
  integrations, onDelete,
}: {
  integrations: any[];
  onDelete: (id: string) => void;
}) => {
  const { orgIdString } = useParams();
  const orgId = extractIdFromIdString(orgIdString);
  const codeChallenge = 'code_challenge';
  const twitterUrl = 'https://twitter.com/i/oauth2/authorize' +
  '?response_type=code' +
  `&client_id=${encodeURIComponent(TWITTER_CLIENT_ID)}` +
  `&redirect_uri=${encodeURIComponent(TWITTER_BASE_URL)}` +
  '&scope=tweet.read%20users.read%20tweet.write%20offline.access' +
  `&state=${orgId}&code_challenge=${codeChallenge}` +
  '&code_challenge_method=plain';
  return (
    <div className="mt-4 contaner pl-8 pr-8 w-full">
      <Space
        direction="vertical"
        size="large"
        className="w-full"
      >
        <div>
          <h2>Integrations</h2>
          <div className="mt-2">
            <Space
              direction="horizontal"
            >
              <Button
                icon={<TwitterOutlined />}
                type="dashed"
                className="flex items-center"
                onClick={() => {
                  window.open(twitterUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                Connect
              </Button>
              <Button
                icon={<GoogleOutlined />}
                type="dashed"
                className="flex items-center"
                disabled
              >
                Connect
              </Button>
              <Button
                icon={<Discord />}
                type="dashed"
                className="flex items-center"
                disabled
              >
                Connect
              </Button>
            </Space>
          </div>
        </div>
        <div>
          <h3>Active authentication</h3>
          <div className="mt-2">
            {
              integrations.map((integration:IWeb2Integration) => {
                return (integration.provider === 'twitter' ?
                    (
                      <div key={integration.id}>
                        <Twitter
                          id={integration.id}
                          username={integration.username}
                          refresh_token_expires_at={integration.refresh_token_expires_at}
                          updated_at={integration.updated_at}
                          onDelete={onDelete}
                        />
                      </div>
                    )
                    :
                    null
                );
              })
            }
          </div>
        </div>
      </Space>
    </div>
  );
};

export default Integration;
