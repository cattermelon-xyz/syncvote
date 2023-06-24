import { ArrowRightOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  Drawer, Space, Input, Select, Button,
} from 'antd';

type NewOptionDrawerProps = {
  showAddOptionDrawer: boolean;
  setShowNewOptionDrawer: (data: any) => void;
  newOption: any;
  setNewOption: (data:any) => void;
  posibleOptions: any;
  addNewOptionHandler: (data:any) => void;
};

const NewOptionDrawer = (props: NewOptionDrawerProps) => {
  const {
    showAddOptionDrawer, setShowNewOptionDrawer, newOption, setNewOption, posibleOptions,
    addNewOptionHandler,
  } = props;
  return (
    <Drawer
      open={showAddOptionDrawer}
      title="Add New Option"
      onClose={() => setShowNewOptionDrawer(false)}
    >
      <Space direction="vertical" className="w-full">
        <Space direction="horizontal" className="w-full flex justify-between">
          <div>Option Title:</div>
          <Input
            type="text"
            value={newOption.title}
            prefix=""
            style={{ width: '200px' }}
            onChange={(e) => setNewOption({
              ...newOption,
              title: e.target.value,
            })}
          />
        </Space>
        <Space direction="horizontal" className="w-full flex justify-between">
          <Space direction="horizontal" size="small">
            <div>Connect</div>
            <ArrowRightOutlined className="flex" />
          </Space>
          <Select
            value={newOption.id}
            style={{ width: '200px' }}
            options={posibleOptions.map((p:any) => {
              return {
                value: p.id,
                label: p.title ? p.title : p.id,
              };
            })}
            className="w-full"
            onChange={(value) => {
              setNewOption({
                ...newOption,
                id: value,
              });
            }}
          />
        </Space>
        <Button
          type="default"
          className="inline-flex items-center text-center justify-center w-full mt-4"
          icon={<PlusCircleOutlined />}
          onClick={() => {
            addNewOptionHandler(newOption);
            setNewOption({
              id: '', title: '',
            });
            setShowNewOptionDrawer(false);
          }}
        >
          Add
        </Button>
      </Space>
    </Drawer>
  );
};

export default NewOptionDrawer;
