import React, { useEffect, useState } from 'react';
import { Modal, Card, Select, Empty } from 'antd';
import parse from 'html-react-parser';
import { formatDate } from '@utils/helpers';

interface Props {
  open: boolean;
  onClose: () => void;
  docTitle?: string;
  versionOfADoc?: any;
  dataOfAllDocs?: any;
}

const ModalHistoryOfADoc: React.FC<Props> = ({
  open,
  onClose,
  docTitle,
  versionOfADoc,
  dataOfAllDocs,
}) => {
  const [dataVersionOfDoc, setDataVersionOfDoc] = useState<any[]>([]);
  const [contentOfVersion, setContentOfVersion] = useState<string>();
  const [optionsData, setOptionsData] = useState<any[]>([]);

  useEffect(() => {
    if (versionOfADoc && dataOfAllDocs) {
      const ids = versionOfADoc.flatMap((doc: any) => Object.values(doc));

      const filteredData = dataOfAllDocs
        .filter((doc: any) => ids.includes(doc.id))
        .sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      setDataVersionOfDoc(filteredData);
    }
  }, [versionOfADoc, dataOfAllDocs]);

  useEffect(() => {
    if (dataVersionOfDoc) {
      const options = dataVersionOfDoc?.map((version: any, index: any) => {
        return {
          label:
            index !== 0
              ? formatDate(version?.created_at)
              : `${formatDate(version?.created_at)} (Last version)`,
          value: version.content,
        };
      });

      setOptionsData(options);
    }
  }, [dataVersionOfDoc]);

  useEffect(() => {
    if (optionsData && optionsData.length > 0) {
      setContentOfVersion(optionsData[0].value);
    }
  }, [optionsData]);

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
        width={670}
      >
        {dataVersionOfDoc.length === 0 ? (
          <Empty />
        ) : (
          optionsData.length > 0 && (
            <div className='flex flex-col w-full gap-3'>
              <Select
                defaultValue={optionsData[0]?.value}
                style={{ width: '50%' }}
                onChange={(value) => setContentOfVersion(value)}
                options={optionsData}
              />
              <Card className='w-full max-h-[486px] overflow-y-scroll bg-[#F6F6F6]'>
                {contentOfVersion && <div>{parse(contentOfVersion)}</div>}
              </Card>
            </div>
          )
        )}
      </Modal>
    </>
  );
};

export default ModalHistoryOfADoc;
