import { GraphViewMode, IToken } from '../../interface';
import { Select, Space } from 'antd';
import AllowedByIdentity from './fragment/AllowedByIdentity';
import AllowedByToken from './fragment/AllowedByToken';
import { useContext } from 'react';
import { GraphPanelContext } from '../../context';
import { FiUserCheck } from 'react-icons/fi';
import { TbAtom } from 'react-icons/tb';
import CollapsiblePanel from '../../components/CollapsiblePanel';

const VotingPartipation = () => {
  const {
    data: allData,
    selectedNodeId,
    onChange,
    viewMode,
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
    <Space direction='vertical' size='small' className='w-full'>
      <div className='text-sm'>Voter</div>
      <Select
        disabled={!(viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION)}
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
            label: (
              <div className='flex items-center'>
                <FiUserCheck className='mr-2' />
                Other identity
              </div>
            ),
            value: 'identity',
          },
          // choosing this option would engage Votemachine
          {
            key: 'token',
            label: (
              <div className='flex items-center'>
                <TbAtom className='mr-2' />
                Token/NFT holder
              </div>
            ),
            value: 'token',
          },
        ]}
      />
      {type ? <div className='py-1'>{/* <hr /> */}</div> : null}
      {type === 'identity' ? (
        <></>
      ) : // <AllowedByIdentity
      //   editable={viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION || false}
      //   identity={identity}
      //   setIdentity={(newIdentity: string[]) => {
      //     onChange({
      //       participation: {
      //         type: 'identity',
      //         data: newIdentity,
      //       },
      //     });
      //   }}
      // />
      null}
      {type === 'token' ? (
        <AllowedByToken
          editable={viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION || false}
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
  );
};

export default VotingPartipation;
