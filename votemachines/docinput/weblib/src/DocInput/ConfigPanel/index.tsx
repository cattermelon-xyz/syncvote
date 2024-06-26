import { Space, Switch, Button, Alert, Input, Select, Modal, Tag } from 'antd';
import { useContext, useState } from 'react';
import {
  GraphContext,
  ICheckPoint,
  IDoc,
  IVoteMachineConfigProps,
} from 'directed-graph';
import {
  DelayUnit,
  NavConfigPanel,
  INavPanelNode,
  CollapsiblePanel,
  SideNote,
} from 'directed-graph';
import NewOptionDrawer from './NewOptionDrawer';
import { PlusOutlined } from '@ant-design/icons';
import '../styles.scss';
import { DocInput, DocInput as Interface } from '../interface';
import { TextEditor } from 'rich-text-editor';
import parse from 'html-react-parser';
import { MdDeleteOutline } from 'react-icons/md';
import NewDocActionDrawer from './NewDocActionDrawer';
import { FaInfo } from 'react-icons/fa6';

// TODO: DocInput do not require voting quorum

/**
 *
 * @param IVoteMachineConfigProps
 * note: editable === true -> then locked item is disabled too
 * @returns ConfigPanel:JSX.Element
 */
export default (props: IVoteMachineConfigProps) => {
  // delayUnits: [], // 1 byte (8) to decide the unit (minute, hour, day, week, month, year)
  // delays: [], // 2 bytes (65,536) for the actual value
  // delayNotes: [], // do not comit this data to blockchain
  // includedAbstain: false,
  // resultDescription: '',
  // quorum: 0,
  // optionsDescription: '',
  const {
    currentNodeId = '',
    votingPowerProvider = '',
    whitelist = [], //eslint-disable-line
    data = {
      options: [],
      docs: [],
      variables: [],
    },
    onChange = (data: ICheckPoint) => {},
    children = [],
    allNodes = [], //eslint-disable-line
    includedAbstain,
    quorum,
    optionsDescription,
    resultDescription,
  } = props;
  const allVariables = props?.raw?.variables || [];
  const { docs, options } = data;
  const variables = data.variables || [];
  const { data: graphData } = useContext(GraphContext);
  const predefinedDocs: IDoc[] = graphData.docs || [];
  const delays = props.delays || Array(options?.length).fill(0);
  const delayUnits =
    props.delayUnits || Array(options?.length).fill(DelayUnit.MINUTE);
  const delayNotes = props.delayNotes || Array(options?.length).fill('');
  const posibleOptions: ICheckPoint[] = [];
  const [showAddOptionDrawer, setShowNewOptionDrawer] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState('');
  allNodes.forEach((child) => {
    if (child.id !== currentNodeId && !children.includes(child.id)) {
      posibleOptions.push(child);
    }
  });
  const [newOption, setNewOption] = useState<Interface.IOption>({
    id: '',
    title: '',
    delay: 0,
    delayUnit: DelayUnit.MINUTE,
    delayNote: '',
  });
  const addNewOptionHandler = (newOptionData: any) => {
    if (newOptionData.id && newOptionData.title) {
      const opts = options ? [...options] : [];
      const chds = children ? [...children] : [];
      onChange({
        data: {
          ...data,
          options: [...opts, newOptionData.title],
        },
        children: [...chds, newOptionData.id],
        delays: [...delays, newOptionData.delay],
        delayUnits: [...delayUnits, newOptionData.delayUnit],
        delayNotes: [...delayNotes, newOptionData.delayNote],
      });
    }
  };
  const deleteOptionHandler = (index: number) => {
    onChange({
      data: {
        options: [...options.slice(0, index), ...options.slice(index + 1)],
        docs,
      },
      children: [...children.slice(0, index), ...children.slice(index + 1)],
      delays: [...delays.slice(0, index), ...delays.slice(index + 1)],
      delayUnits: [
        ...delayUnits.slice(0, index),
        ...delayUnits.slice(index + 1),
      ],
      delayNotes: [
        ...delayNotes.slice(0, index),
        ...delayNotes.slice(index + 1),
      ],
    });
  };
  const changeOptionDelay = (value: any, index: number) => {
    const newDelays = [...delays];
    const newDelayUnits = [...delayUnits];
    const newDelayNotes = [...delayNotes];
    newDelays[index] = value.delay;
    newDelayUnits[index] = value.delayUnit;
    newDelayNotes[index] = value.delayNote;
    onChange({
      delays: structuredClone(newDelays),
      delayUnits: structuredClone(newDelayUnits),
      delayNotes: structuredClone(newDelayNotes),
    });
  };
  const changeOptionLabel = (value: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange({ data: { ...data, options: structuredClone(newOptions) } });
  };
  const replaceOption = (
    newOptionData: { id: string; title: string },
    index: number
  ) => {
    if (newOptionData.id && newOptionData.title) {
      const newOptions = options
        ? [
            ...options.slice(0, index),
            newOptionData.title,
            ...options.slice(index + 1),
          ]
        : [];
      const newChildren = children
        ? [
            ...children.slice(0, index),
            newOptionData.id,
            ...children.slice(index + 1),
          ]
        : [];
      onChange({
        data: {
          options: structuredClone(newOptions),
        },
        children: structuredClone(newChildren),
      });
    }
  };
  const [isShownDocumentAction, setIsShownDocumentAction] = useState(false);
  return (
    <>
      <Space direction='vertical' size='large' className='w-full single-choice'>
        {/* <Space direction="vertical" size="small" className="w-full">
      <div className="bg-slate-100 p-2 w-full">
        <span className="mr-0.5">Everyone choose ONE option until one option reach</span>
        {getMaxText()}
      </div>
    </Space> */}
        <CollapsiblePanel title='Options & navigation'>
          <>
            <hr className='my-2' />
            <Alert
              type='success'
              message='Set up logic for your workflow'
              description='If option X is choosen then workflow will navigage to Y checkpoint'
              closable
            />
            <Space direction='vertical' size='small' className='w-full'>
              {options?.map((option: string, index: number) => {
                const currentNode = allNodes.find(
                  (node) => node.id === children[index]
                );
                return (
                  <NavConfigPanel
                    title={`Option ${index + 1}`}
                    key={option}
                    index={index}
                    navLabel={option}
                    currentNode={currentNode as INavPanelNode}
                    changeDelayHandler={changeOptionDelay}
                    changeLabelHandler={changeOptionLabel}
                    deleteHandler={deleteOptionHandler}
                    possibleNodes={posibleOptions as INavPanelNode[]}
                    replaceHandler={replaceOption}
                    delay={delays[index] || 0}
                    delayUnit={delayUnits[index] || 0}
                    delayNote={delayNotes[index] || ''}
                  />
                );
              })}
            </Space>
            <Button
              type='link'
              icon={<PlusOutlined />}
              className='w-full flex items-center justify-start pl-0 my-2'
              onClick={() => setShowNewOptionDrawer(true)}
            >
              Add a new option & navigation
            </Button>
            <NewOptionDrawer
              showAddOptionDrawer={showAddOptionDrawer}
              setShowNewOptionDrawer={setShowNewOptionDrawer}
              newOption={newOption}
              setNewOption={setNewOption}
              posibleOptions={posibleOptions}
              addNewOptionHandler={addNewOptionHandler}
            />
            <SideNote
              value={optionsDescription}
              setValue={(val: string) => {
                onChange({
                  optionsDescription: val,
                });
              }}
            />
          </>
        </CollapsiblePanel>
        <CollapsiblePanel title='Variables'>
          <div>Data will be stored in following variables</div>
          <div className='mt-2 flex flex-col gap-1'>
            {variables.map((v: any, index: number) => {
              return (
                <div key={index} className='flex justify-between items-center'>
                  <Tag className='v'>{v}</Tag>
                  <Button
                    icon={<MdDeleteOutline />}
                    type='link'
                    danger
                    onClick={() => {
                      const newVariables = [...variables];
                      newVariables.splice(index, 1);
                      onChange({
                        data: {
                          ...data,
                          variables: newVariables,
                        },
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className='flex w-full items-center justify-between'>
            <Select
              options={allVariables
                .filter((v: any) => variables.indexOf(v) === -1)
                .map((v: any) => ({ label: v, value: v }))}
              className='w-1/2'
              value={selectedVariable}
              onChange={(v: any) => setSelectedVariable(v)}
            />
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                const newVariables = [...variables, selectedVariable];
                onChange({
                  data: {
                    ...data,
                    variables: newVariables,
                  },
                });
              }}
            >
              Add new
            </Button>
          </div>
        </CollapsiblePanel>
        {/* <CollapsiblePanel title='Document Action'>
          <Space direction='vertical' className='w-full' size='large'>
            {docs?.map((doc: DocInput.IDoc, index: number) => {
              const predefinedDoc: any =
                predefinedDocs.find((p: any) => p.id === doc.id) || {};
              return (
                <Space
                  direction='horizontal'
                  className='flex w-full items-center justify-between p-2'
                  key={index}
                >
                  <div className='px-1 flex items-center'>
                    {doc.action}{' '}
                    <Button
                      type='link'
                      className='ml-2'
                      onClick={() =>
                        Modal.info({
                          title: 'Document description & Guideline',
                          content: parse(predefinedDoc.description),
                        })
                      }
                    >
                      {predefinedDoc.title ? predefinedDoc.title : doc.id}
                    </Button>
                  </div>
                  <Space direction='horizontal' size='large'>
                    <Button
                      danger
                      shape='circle'
                      icon={<MdDeleteOutline />}
                      onClick={() => {
                        const docs = structuredClone(data.docs);
                        docs.splice(index, 1);
                        onChange({
                          data: {
                            ...data,
                            docs,
                          },
                        });
                      }}
                    />
                    <Button
                      shape='circle'
                      icon={<FaInfo />}
                      onClick={() =>
                        Modal.info({
                          title: 'Description',
                          content: parse(doc.description),
                        })
                      }
                      disabled={!doc.description}
                    />
                  </Space>
                </Space>
              );
            })}
            <Button
              type='primary'
              onClick={() => setIsShownDocumentAction(true)}
            >
              Add new document action
            </Button>
          </Space>
          <NewDocActionDrawer
            open={isShownDocumentAction}
            onCancel={() => setIsShownDocumentAction(false)}
            data={data}
            onChange={onChange}
          />
        </CollapsiblePanel> */}
      </Space>
    </>
  );
};
