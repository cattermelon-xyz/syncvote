import { ICheckPoint, IToken } from '@types';
import { Select, Space } from 'antd';
import AllowedByIdentity from './fragment/AllowedByIdentity';
import AllowedByToken from './fragment/AllowedByToken';

const VotingPartipation = ({
  selectedNode, onChange, editable,
}: {
  selectedNode: ICheckPoint,
  onChange: (changeData: any) => void,
  editable: boolean,
}) => {
  const { participation } = selectedNode;
  const type = participation?.type;
  const data = participation?.data;
  const identity = type === 'identity' && data ? data as string[] : [];
  const tokenData = type === 'token' && data ? data as IToken : {};
  return (
    <Space direction="vertical" size="large" className="w-full">
      <Space direction="vertical" size="small" className="w-full">
        <div className="text-sm">Allowed by</div>
        <Select
          disabled={!editable}
          value={type}
          style={{ width: '100%' }}
          onChange={(value) => {
            onChange({
              participation: {
                type: value,
              },
            });
          }}
          options={[
            {
              key: 'identity',
              label: 'Identity',
              value: 'identity',
            },
            // choosing this option would engage Votemachine
            {
              key: 'token',
              label: 'Token',
              value: 'token',
            },
          ]}
        />
        {
          type === 'identity' ?
          (
            <AllowedByIdentity
              editable={editable}
              identity={identity}
              setIdentity={(newIdentity: string[]) => {
                onChange({
                  participation: {
                    type: 'identity',
                    data: newIdentity,
                  },
                });
              }}
            />
          ) : null
        }
        {
          type === 'token' ?
          (
            <AllowedByToken
              editable={editable}
              address={tokenData?.address}
              setAddress={(address: string) => {
                onChange({
                  participation: {
                    type: 'token',
                    data: {
                      address,
                      min: tokenData?.min,
                    },
                  },
                });
              }}
              min={tokenData?.min}
              setMin={(min: number) => {
                onChange({
                  participation: {
                    type: 'token',
                    data: {
                      min,
                      address: tokenData?.address,
                    },
                  },
                });
              }}
            />
          ) : null
        }
      </Space>
    </Space>
  );
};

export default VotingPartipation;
