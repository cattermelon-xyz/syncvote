import { Modal, Button, Select } from 'antd';
import { TextEditor } from 'rich-text-editor';
import { useEffect, useState } from 'react';
import { IDoc } from 'directed-graph';

interface Props {
  open: boolean;
  onClose: () => void;
  currentCheckpointData: any;
  missionData: any;
}

const ModalUpdateDocInput: React.FC<Props> = ({
  open,
  onClose,
  currentCheckpointData,
  missionData,
}) => {
  const [templateOfDoc, setTemplateOfDoc] = useState<any>('');
  const [optionDocs, setOptionDocs] = useState<any>([]);
  const [value, setValue] = useState<string>();
  const [docsOfMission, setDocsOfMission] = useState(
    missionData.data.docs || []
  );

  useEffect(() => {
    if (missionData && currentCheckpointData) {
      const checkpointDocs = currentCheckpointData.data.docs;
      const missionDocs: IDoc[] = missionData.data.docs;

      // filteredDocs is only contain docs in missionDocs have the same id with doc in checkpointDocs
      const filteredDocs = missionDocs.filter((missionDoc) =>
        checkpointDocs.some(
          (checkpointDoc: any) => checkpointDoc.id === missionDoc.id
        )
      );

      const optionDocs = filteredDocs.map((doc) => ({
        key: doc.id,
        label: <div className='flex items-center'>{doc.title}</div>,
        value: doc.id,
        template: doc.template,
      }));
      setOptionDocs(optionDocs);
    }
  }, [currentCheckpointData, missionData]);

  const handleOk = () => {
    onClose();
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
      >
        <div className='text-sm text-[#575655] mb-2'>Select docs</div>
        <div className='relative mb-2'>
          <Select
            className='w-full'
            options={optionDocs}
            onChange={(val) => {
              setValue(val);
              console.log(val, docsOfMission);

              const doc = docsOfMission.find((doc: any) => doc.id === val);
              setTemplateOfDoc(doc?.template);
            }}
          />
        </div>
        <TextEditor
          value={templateOfDoc}
          setValue={(val: any) => {
            setTemplateOfDoc(val);
            console.log(value);

            if (value) {
              const updatedDocs = [...docsOfMission];
              const docIndex = updatedDocs.findIndex((doc) => doc.id === value);
              if (docIndex !== -1) {
                updatedDocs[docIndex].template = val;
                setDocsOfMission(updatedDocs);
              } else {
                console.log('Không tìm thấy tài liệu với id được chỉ định.');
              }
            }
          }}
          id='text-editor'
        />
      </Modal>
    </>
  );
};

export default ModalUpdateDocInput;
