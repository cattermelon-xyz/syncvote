import { Alert, Button, Input, Popover, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CommentOutlined, LockFilled, UnlockOutlined } from '@ant-design/icons';
import { validateWorkflow, validateMission } from '@middleware/logic';
import {
  ICheckPoint,
  IWorkflowVersionLayout,
  IWorkflowVersionLayoutMarker,
} from '@types';
import TextEditor from '@components/Editor/TextEditor';
import { getVoteMachine } from '../voteMachine';
import { emptyLayout } from '../empty';
import { Markers } from './markers';

const ContextTab = ({
  selectedNode = {},
  onChange,
  editable,
  selectedLayout = { ...emptyLayout },
  onChangeLayout,
}: {
  selectedNode?: any;
  onChange: (changedData: ICheckPoint) => void;
  editable?: boolean;
  selectedLayout?: IWorkflowVersionLayout;
  onChangeLayout?: (changedData: IWorkflowVersionLayout) => void;
}) => {
  const layoutNode = selectedLayout?.nodes?.find(
    (node: any) => node.id === selectedNode?.id
  ) || {
    style: {
      title: {
        backgroundColor: '#fff',
      },
    },
  };
  const style = layoutNode?.style;
  const markers = selectedLayout?.markers || [];
  const summary = getVoteMachine(selectedNode.vote_machine_type)?.explain({
    checkpoint: selectedNode,
    data: selectedNode.data,
  });
  const vmValidation = getVoteMachine(selectedNode.vote_machine_type)?.validate(
    {
      checkpoint: selectedNode,
    }
  ) || {
    isValid: true,
  };
  const locked = selectedNode?.locked ? selectedNode?.locked : {};
  let validation;
  // TODO: change edible to workflow or mission state!
  if (editable) {
    // this is workflow
    validation = validateWorkflow({ checkPoint: selectedNode });
  } else {
    // this is mission
    validation = validateMission({ checkPoint: selectedNode });
  }
  const renderValidation = (params: any) => {
    let rs = null;
    if (!params.isValid) {
      rs = (
        <>
          {params.message.map((msg: string) => {
            return <Alert key={msg} message={msg} type="error" />;
          })}
        </>
      );
    }
    return rs;
  };
  return (
    <Space direction="vertical" size="large" className="w-full">
      {/* <Space.Compact className="w-full">
        <Input
          value={selectedNode?.title ? selectedNode.title : selectedNode.id}
          onChange={(e) => {
            const newNode = structuredClone(selectedNode);
            newNode.title = e.target.value;
            onChange(newNode);
          }}
          disabled={locked.title}
        />
        <Button
          icon={locked.title ? <LockFilled /> : <UnlockOutlined />}
          onClick={() => {
            const newLocked = { ...locked, title: !locked.title };
            const newNode = structuredClone(selectedNode);
            newNode.locked = newLocked;
            onChange(newNode);
          }}
          disabled={!editable}
        />
      </Space.Compact> */}
      <Space
        direction="vertical"
        size="small"
        className="w-full bg-white rounded-lg"
      >
        {/* <Space direction="horizontal" className="justify-between w-full">
          <span>Information supporting the decision</span>
          <Button
            icon={locked.description ? <LockFilled /> : <UnlockOutlined />}
            onClick={() => {
              const newLocked = { ...locked, description: !locked.description };
              const newNode = structuredClone(selectedNode);
              newNode.locked = newLocked;
              onChange(newNode);
            }}
            disabled={!editable}
          />
        </Space> */}
        <TextEditor
          value={selectedNode?.description}
          setValue={(value: any) => {
            const newNode = structuredClone(selectedNode);
            newNode.description = value;
            onChange(newNode);
          }}
          heightEditor={200}
          // disabled={locked.description}
        />
      </Space>
      <Space direction="vertical" className="w-full p-4 bg-white rounded-lg">
        <div className="text-gray-400">Voting location</div>
        <Input
          value={selectedNode?.votingLocation}
          onChange={(e) => {
            const val = e.target.value || ' ';
            const newNode = structuredClone(selectedNode);
            newNode.votingLocation = val;
            onChange(newNode);
          }}
          placeholder="Discourse Forum"
        />
      </Space>
      <Space direction="vertical" className="w-full p-4 bg-white rounded-lg">
        <div className="text-gray-400">Checkpoint color & label</div>
        <Input
          prefix={
            <Popover
              content={
                <Space direction="horizontal">
                  {Markers.map((marker: any) => {
                    return (
                      <div
                        key={marker.title.backgroundColor}
                        className="w-[16px] h-[16px] border-2 cursor-pointer"
                        style={{
                          backgroundColor: marker.title.backgroundColor,
                        }}
                        onClick={() => {
                          const tmp = structuredClone(selectedLayout);
                          const nodes = tmp?.nodes;
                          const markers = tmp?.markers;
                          const style = {
                            title: { ...marker.title },
                            content: { ...marker.content },
                          };
                          const newMarker = {
                            color: marker.title.backgroundColor,
                            title: marker.markerTitle,
                          };
                          if (!markers) {
                            tmp.markers = [];
                            tmp.markers.push(newMarker);
                          } else {
                            const idx = markers.findIndex(
                              (marker: any) =>
                                marker.title.backgroundColor === newMarker.color
                            );
                            if (idx === -1) {
                              markers.push(newMarker);
                            }
                          }
                          if (!nodes) {
                            tmp.nodes = [];
                            tmp.nodes.push({
                              id: selectedNode?.id,
                              style,
                            });
                          } else {
                            const idx = nodes.findIndex(
                              (node: any) => node.id === selectedNode?.id
                            );
                            if (idx === -1) {
                              nodes.push({
                                id: selectedNode?.id,
                                style,
                              });
                            } else {
                              nodes[idx].style = {
                                ...nodes[idx].style,
                                ...style,
                              };
                            }
                          }
                          onChangeLayout
                            ? onChangeLayout({
                                ...tmp,
                              })
                            : null;
                        }}
                      ></div>
                    );
                  })}
                </Space>
              }
            >
              <div
                className="w-[24px] h-[24px] rounded-md border cursor-pointer mr-2"
                style={{
                  backgroundColor: style?.title.backgroundColor,
                }}
              ></div>
            </Popover>
          }
          className="w-full"
          value={
            markers.find(
              (marker: any) => marker.color === style?.title?.backgroundColor
            )?.title || ''
          }
          placeholder="Write a label"
          onChange={(e) => {
            const label = e.target.value;
            const tmp = structuredClone(selectedLayout);
            const idx = markers?.findIndex(
              (marker: any) => marker.color === style?.title?.backgroundColor
            );
            if (idx !== -1) {
              markers[idx].title = label;
            }
            onChangeLayout
              ? onChangeLayout({
                  ...tmp,
                  markers: [...markers],
                })
              : null;
          }}
          disabled={style?.title?.backgroundColor === '#fff'}
        />
      </Space>
      {!selectedNode?.isEnd && selectedNode.vote_machine_type ? (
        <>
          <Space
            direction="vertical"
            className="p-4 rounded-lg bg-white border-1 w-full"
          >
            <div className="flex items-center text-lg font-bold">
              <CommentOutlined className="mr-2" />
              Summary
            </div>
            {summary}
          </Space>
        </>
      ) : (
        <></>
      )}
      <Space direction="vertical" size="middle" className="w-full">
        {renderValidation(validation)}
        {renderValidation(vmValidation)}
      </Space>
    </Space>
  );
};

export default ContextTab;
