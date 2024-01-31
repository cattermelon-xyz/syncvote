import { GraphContext } from '../context';
import { Button, Drawer, Input, Space } from 'antd';
import { useContext, useState } from 'react';
import { IDoc } from '../interface';
import { TextEditor } from 'rich-text-editor';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { emptyDoc } from '../empty';

const DocsConfigPanel = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { data, onAddNewDoc, onDeleteDoc, onChangeDoc } =
    useContext(GraphContext);
  const docs: IDoc[] = data.docs || [];
  const [showEditModal, setShowEditDrawer] = useState(false);
  const [id, setId] = useState(emptyDoc.id);
  const [title, setTitle] = useState(emptyDoc.title);
  const [description, setDescription] = useState(emptyDoc.description);
  const [template, setTemplate] = useState(emptyDoc.template);
  const reset = () => {
    setId(emptyDoc.id);
    setTitle(emptyDoc.title);
    setDescription(emptyDoc.description);
    setTemplate(emptyDoc.template);
    setShowEditDrawer(false);
  };
  return (
    <Drawer open={open} onClose={onClose} title='Documents type'>
      <Space direction='vertical' className='w-full'>
        <Space direction='horizontal' className='flex justify-between w-full'>
          <div className='font-bold text-gray-400'>List of document</div>
          <Button
            icon={<PlusOutlined />}
            type='default'
            title='New Document Type'
            shape='circle'
            onClick={() => {
              setShowEditDrawer(true);
            }}
          />
        </Space>

        {docs.map((doc: IDoc) => {
          return (
            <div
              key={doc.id}
              className='flex justify-between items-center hover:cursor-pointer hover:bg-violet-100 p-2'
              onClick={() => {
                setId(doc.id);
                setTitle(doc.title);
                setDescription(doc.description);
                setTemplate(doc.template);
                setShowEditDrawer(true);
              }}
            >
              <div>{doc.title}</div>
              <EditOutlined />
            </div>
          );
        })}
      </Space>
      <Drawer
        open={showEditModal}
        onClose={() => {
          setShowEditDrawer(false);
          reset();
        }}
        title={id === '' ? 'New Document' : 'Edit'}
      >
        <Space direction='vertical' size='middle' className='w-full'>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Space direction='vertical' size='small' className='w-full'>
            <div className='text-gray-400 font-bold'>
              Guideline & Description
            </div>
            <TextEditor
              value={description}
              setValue={(val: string) => {
                setDescription(val);
              }}
            />
          </Space>
          <Space direction='vertical' size='small' className='w-full'>
            <div className='text-gray-400 font-bold'>Template</div>
            <TextEditor
              value={template}
              setValue={(val: string) => {
                setTemplate(val);
              }}
            />
          </Space>

          <Space direction='horizontal' className='flex w-full justify-between'>
            {onAddNewDoc && onChangeDoc ? (
              <Button
                type='primary'
                onClick={() => {
                  if (id === '') {
                    onAddNewDoc
                      ? onAddNewDoc({ id, title, description, template })
                      : null;
                  } else {
                    onChangeDoc
                      ? onChangeDoc({ id, title, description, template })
                      : null;
                  }
                  reset();
                }}
              >
                {id !== '' ? 'Save' : 'New'}
              </Button>
            ) : null}

            <Space direction='horizontal' size='small'>
              {id !== '' && onDeleteDoc ? (
                <Button
                  type='default'
                  onClick={() => {
                    onDeleteDoc(id);
                    setShowEditDrawer(false);
                    reset();
                  }}
                  danger
                >
                  Delete
                </Button>
              ) : null}
            </Space>
          </Space>
        </Space>
      </Drawer>
    </Drawer>
  );
};

export default DocsConfigPanel;
