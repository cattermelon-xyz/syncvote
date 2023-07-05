import { ICheckPoint, IToken } from '@types';
import { Divider, Select, Space } from 'antd';
import AllowedByIdentity from './fragment/AllowedByIdentity';
import AllowedByToken from './fragment/AllowedByToken';
import { useContext } from 'react';
import { GraphPanelContext } from '@components/DirectedGraph/context';

const VotingPartipation = () => {
  const {
    data: allData,
    selectedNodeId,
    onChange,
    editable,
  } = useContext(GraphPanelContext);
  const selectedNode = allData.checkpoints?.find(
    (chk: any) => chk.id === selectedNodeId
  );
  const participation = selectedNode?.participation || {};
  const type = participation?.type;
  const data = participation?.data;
  const identity = type === 'identity' && data ? (data as string[]) : [];
  const tokenData = type === 'token' && data ? (data as IToken) : {};
  return (
    <Space
      direction="vertical"
      size="large"
      className="w-full rounded-lg bg-white p-4"
    >
      <Space direction="vertical" size="small" className="w-full">
        <div className="text-sm">Voter allowed by</div>
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
        <div className="py-2">
          <hr />
        </div>
        {type === 'identity' ? (
          <AllowedByIdentity
            editable={editable || false}
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
        ) : null}
        {type === 'token' ? (
          <AllowedByToken
            editable={editable || false}
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
        ) : null}
      </Space>
    </Space>
  );
};

export default VotingPartipation;
