import { DeleteOutlined, ClockCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import {
  Space, Button, Input, Select,
} from 'antd';
import { useState } from 'react';

export const Option = ({
  index, currentNode, option, deleteOptionHandler, changeOptionHandler,
  editable = false, possibleOptions, addAndDeleteOptionHandler,
}:{
  index: number;
  currentNode: any;
  option: string;
  deleteOptionHandler: (index:number) => void;
  changeOptionHandler: (value:any, index:number) => void;
  editable?: boolean;
  possibleOptions: any[];
  addAndDeleteOptionHandler: (newOptionData:any, index:number) => void;
}) => {
  const [label, setLabel] = useState(option);
  return (
    <Space direction="vertical" className="w-full flex justify-between">
      <div className="w-full flex justify-between">
        <div className="w-6/12 flex pt-1 justify-between items-center">
          <span className="text-gray-400">{`Option ${index + 1}`}</span>
          <Button
            type="link"
            className="flex items-center text-violet-600"
            icon={<DeleteOutlined />}
            disabled={!editable}
            onClick={() => deleteOptionHandler(index)}
          >
            Remove
          </Button>
        </div>
        <Space direction="horizontal" className="w-6/12 flex pt-1 justify-between items-center">
          <span className="text-gray-400">Navigate to</span>
          <span className="text-violet-400 flex items-center gap-1">
            <ClockCircleOutlined />
            <span>Deplay 7h</span>
          </span>
        </Space>
      </div>
      <div className="w-full flex justify-between">
        <div className="w-6/12 flex pt-0.25 justify-between items-center pr-2.5">
          <Input
            className="w-full"
            value={label}
            onChange={(e:any) => { setLabel(e.target.value); }}
            onBlur={() => { changeOptionHandler(label, index); }}
          />
        </div>
        <div className="w-6/12 flex pt-0.25 justify-between items-center gap-2">
          <ArrowRightOutlined />
          <Select
            value={currentNode?.title || currentNode?.id}
            options={possibleOptions?.map((p:any) => {
              return {
                value: p.id,
                label: p.title ? p.title : p.id,
              };
            })}
            className="w-full"
            onChange={(value) => {
              addAndDeleteOptionHandler({
                id: value,
                title: label,
              }, index);
            }}
          />
        </div>
      </div>
    </Space>
  );
};
