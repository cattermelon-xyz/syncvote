import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import {
  DirectedGraph, ICheckPoint, getVoteMachine, renderVoteMachineConfigPanel,
} from '@components/DirectedGraph';
import { useState } from 'react';
import {
  Button, Drawer, Modal, Space,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import MissionMeta from './MissionMeta';

const Data = ({
  currentMission, onPublish, onUnPublish, onDelete,
  setCurrentMissionData, web2IntegrationsState,
}: {
  currentMission: any;
  onPublish: () => void;
  onUnPublish: () => void;
  onDelete: () => void;
  setCurrentMissionData: (data:any) => void;
  web2IntegrationsState: any;
}) => {
  const [open, setOpen] = useState(false);
  const versionData = currentMission.data || { checkpoints: [] };
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
  const editable = false;
  const setVersionData = (data:any) => {
    setCurrentMissionData(data);
  };
  const [showEditInfo, setShowEditInfo] = useState(false);
  return (
    <div className="w-full h-full">
      <div className="flex w-full h-full">
        <Modal
          open={open}
          onOk={() => { setOpen(false); }}
          onCancel={() => { setOpen(false); }}
        >
          <TextArea
            className="w-full"
            value={
              JSON.stringify(versionData)
            }
            rows={10}
            onChange={(e) => {
              setVersionData(JSON.parse(e.target.value));
            }}
          />
        </Modal>
        <Drawer
          title="Edit Info"
          open={showEditInfo}
          onClose={() => { setShowEditInfo(false); }}
        >
          <MissionMeta
            currentMission={currentMission}
            setCurrentMission={setCurrentMissionData}
          />
        </Drawer>
        {renderVoteMachineConfigPanel({
            editable,
            web2Integrations: web2IntegrationsState,
            versionData,
            selectedNodeId,
            onChange: (changedData:any) => {
              const newData = structuredClone(versionData);
              // TODO: this code viloted the DRY principle
              newData.checkpoints.forEach((v:ICheckPoint, index:number) => {
                if (v.id === selectedNodeId) {
                  newData.checkpoints[index].data = {
                    ...changedData.data,
                  };
                  if (changedData.children) {
                    newData.checkpoints[index].children = changedData.children;
                  }
                  if (changedData.title) {
                    newData.checkpoints[index].title = changedData.title;
                  }
                  if (changedData.description) {
                    newData.checkpoints[index].description = changedData.description;
                  }
                  if (changedData.locked) {
                    newData.checkpoints[index].locked = changedData.locked;
                  }
                  if (changedData.triggers) {
                    newData.checkpoints[index].triggers = changedData.triggers;
                  }
                  if (changedData.duration) {
                    newData.checkpoints[index].duration = changedData.duration;
                  }
                  newData.checkpoints[index].isEnd = changedData.isEnd === true;
                  if (changedData.isEnd === true) {
                    newData.checkpoints[index].children = [];
                    delete newData.checkpoints[index].vote_machine_type;
                    delete newData.checkpoints[index].data;
                  }
                }
              });
              setVersionData(newData);
            },
            onDelete: (id) => {
              if (id === versionData.start) {
                Modal.error({
                  title: 'Error',
                  content: 'Cannot delete start node',
                });
              } else {
                const newData = structuredClone(versionData);
                const index = newData.checkpoints.findIndex((v:any) => v.id === id);
                newData.checkpoints?.forEach((_node:any, cindex: number) => {
                  if (_node.children?.includes(id)) {
                    const newChkpData = getVoteMachine(_node.vote_machine_type)
                    ?.deleteChildNode(
                      _node.data, _node.children, id,
                    ) || _node.data;
                    newData.checkpoints[cindex].data = newChkpData;
                    if (_node.children) {
                      _node.children.splice(_node.children.indexOf(id));
                    }
                  }
                });
                newData.checkpoints.splice(index, 1);
                setVersionData(newData);
                setSelectedNodeId('');
              }
            },
            onClose: () => { setSelectedNodeId(''); },
          },
        )}
        <DirectedGraph
          navPanel={(
            <Space direction="vertical">
              <div className="flex justify-between px-4 font-bold">{currentMission.title}</div>
              <Space className="flex justify-between px-4">
                <Button
                  type="default"
                  onClick={() => { setShowEditInfo(true); }}
                >
                  Edit Info
                </Button>
                {currentMission.status === 'PUBLISHED' ?
                (
                  <div>
                    <span className="mr-4">Development Only:</span>
                    <Button
                      type="default"
                      onClick={onUnPublish}
                    >
                      Unpublish
                    </Button>
                  </div>
                )
                :
                null
                }
                <Button
                  type="default"
                  icon={<UploadOutlined />}
                  disabled={currentMission.status === 'PUBLISHED'}
                  onClick={onPublish}
                >
                  Publish Mission
                </Button>
                <Button
                  type="default"
                  icon={<DeleteOutlined />}
                  onClick={onDelete}
                >
                  Detele Mission
                </Button>
              </Space>
            </Space>
          )}
          editable={editable}
          data={versionData}
          selectedNodeId={selectedNodeId}
          onNodeChanged={(changedNodes) => {
            const newData = structuredClone(versionData);
            newData.checkpoints?.forEach((v:any, index:number) => {
              const changedNode = changedNodes.find((cN:any) => cN.id === v.id);
              if (changedNode && changedNode.position) {
                newData.checkpoints[index].position = changedNode.position;
              }
            });
            setVersionData(newData);
          }}
          onNodeClick={(event, node) => {
            setSelectedNodeId(node.id);
          }}
          onPaneClick={() => {
            setSelectedNodeId('');
          }}
          onResetPosition={() => {
            const newData = structuredClone(versionData);
            newData.checkpoints.forEach((v:any, index:number) => {
              delete newData.checkpoints[index].position;
            });
            setVersionData(newData);
          }}
          onAddNewNode={() => {
            // TODO: should I delete this function? you cannot create new node in Mission mode
            const newData = structuredClone(versionData);
            const newId = `node-${new Date().getTime()}`;
            newData.checkpoints.push({
              id: newId,
              position: centerPos,
              isEnd: true,
            });
            setVersionData(newData);
            setSelectedNodeId(newId);
          }}
          onViewPortChange={(viewport) => {
            setCenterPos({
              x: (-viewport.x + 600) / viewport.zoom,
              y: (-viewport.y + 250) / viewport.zoom,
            });
          }}
        />
      </div>
    </div>
  );
};

export default Data;
