import React, { useEffect, useState } from 'react';
import { Modal, Card } from 'antd';
import { useDispatch } from 'react-redux';
import { queryDocInput } from '@dal/data';
import parse from 'html-react-parser';

interface Props {
  open: boolean;
  onClose: () => void;
  docTitle?: string;
  versionOfADoc?: any;
}

const ModalHistoryOfADoc: React.FC<Props> = ({
  open,
  onClose,
  docTitle,
  versionOfADoc,
}) => {
  const dispatch = useDispatch();
  const [dataVersionOfDoc, setDataVersionOfDoc] = useState<any[]>([]);
  const [contentOfVersion, setContentOfVersion] = useState<string>();

  useEffect(() => {
    console.log('versionOfADoc', versionOfADoc);
    if (versionOfADoc) {
      versionOfADoc?.map((versionItem: any) => {
        const idDocInput = versionItem[Object.keys(versionItem)[0]];
        queryDocInput({
          idDocInput,
          onSuccess: (data: any) => {
            setDataVersionOfDoc((prevData) => [...prevData, data]);
          },
          onError: (error) => {
            Modal.error({
              title: 'Error',
              content: error,
            });
          },
          dispatch,
        });
      });
    }
  }, [versionOfADoc]);

  useEffect(() => {
    console.log('dataVersionOfDoc', dataVersionOfDoc);
  }, [dataVersionOfDoc]);

  const handleOk = async () => {
    onClose();
  };

  return (
    <>
      <Modal
        title={docTitle}
        open={open}
        onOk={handleOk}
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() => {
          onClose();
        }}
        width={1000}
      >
        {dataVersionOfDoc && (
          <div className='flex w-full gap-3'>
            <Card className='w-4/5'>
              {contentOfVersion && <div>{parse(contentOfVersion)}</div>}
            </Card>
            <Card className='w-1/5'>
              {dataVersionOfDoc.map((aVersionData: any, index: any) => (
                <p
                  key={index}
                  onClick={() => setContentOfVersion(aVersionData?.content)}
                >
                  {aVersionData?.created_at}
                </p>
              ))}
            </Card>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ModalHistoryOfADoc;
