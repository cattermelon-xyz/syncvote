import { Modal, Button, Select } from 'antd';
import { TextEditor } from 'rich-text-editor';
import { useEffect, useState } from 'react';
import { IDoc } from 'directed-graph';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { insertDocInput } from '@dal/data';
import { useDispatch } from 'react-redux';

interface Props {
  open: boolean;
  onClose: () => void;
  currentCheckpointData: any;
  missionData: any;
  setSubmission: any;
  submission: any;
}

const ModalUpdateDocInput: React.FC<Props> = ({
  open,
  onClose,
  currentCheckpointData,
  missionData,
  setSubmission,
  submission,
}) => {
  const dispatch = useDispatch();
  const [templateOfDoc, setTemplateOfDoc] = useState<any>('');
  const [optionDocs, setOptionDocs] = useState<any>([]);
  const [value, setValue] = useState<string>();
  const [editorValue, setEditorValue] = useState<string>('');
  const [docsOfMission, setDocsOfMission] = useState(
    missionData.data.docs || []
  );
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [editorValues, setEditorValues] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    if (missionData && currentCheckpointData) {
      const checkpointDocs = currentCheckpointData.data.docs;
      const missionDocs: IDoc[] = missionData.data.docs;
      setDocsOfMission(missionDocs);

      // filteredDocs is only contain docs in missionDocs have the same id with doc in checkpointDocs
      const filteredDocs = missionDocs.filter((missionDoc) =>
        checkpointDocs.some(
          (checkpointDoc: any) => checkpointDoc.id === missionDoc.id
        )
      );

      setOptionDocs(filteredDocs);
    }
  }, [currentCheckpointData, missionData]);

  const handleOk = () => {
    onClose();
  };

  const handleInsertDocInput = async (optionDocId: string) => {
    const content = editorValues[optionDocId] || '';
    console.log('prepare content', content);
    insertDocInput({
      content,
      onSuccess: (res: any) => {
        console.log(res);
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: error,
        });
      },
      dispatch,
    });
  };

  return (
    <>
      <Modal
        title={'Update documents'}
        open={open}
        onOk={handleOk}
        onCancel={() => {
          onClose();
        }}
        okText='Ok'
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className='flex flex-col gap-7 mt-5'>
          {optionDocs &&
            optionDocs.map((optionDoc: any, index: any) => {
              return (
                <div key={index}>
                  <div
                    className={` flex justify-between ${
                      expandedDocId ? 'mb-7' : ''
                    }`}
                  >
                    <p>{optionDoc?.title}</p>
                    {expandedDocId === optionDoc.id ? (
                      <DownOutlined onClick={() => setExpandedDocId(null)} />
                    ) : (
                      <UpOutlined
                        onClick={() => setExpandedDocId(optionDoc.id)}
                      />
                    )}
                  </div>
                  {expandedDocId === optionDoc.id && (
                    <div className='flex flex-col gap-2'>
                      <TextEditor
                        value={
                          editorValues[optionDoc.id] || optionDoc?.template
                        }
                        id={`text-editor-${optionDoc.id}`}
                        setValue={(newValue: any) => {
                          setEditorValues((prevValues) => ({
                            ...prevValues,
                            [optionDoc.id]: newValue,
                          }));
                        }}
                      />
                      <Button
                        type='primary'
                        className='w-full'
                        onClick={() => handleInsertDocInput(optionDoc.id)}
                      >
                        Update
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdateDocInput;
