import { Card, Empty } from 'antd';
import ModalHistoryOfADoc from './ModalHistoryOfADoc';
import { useEffect, useState } from 'react';

interface Props {
  titleDescription: string;
  missionData: any;
}

const ProposalDocuments: React.FC<Props> = ({
  titleDescription,
  missionData,
}) => {
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [currentDoc, setCurrentDoc] = useState<any>();
  const [listVersionDocs, setListVersionDocs] = useState<any[]>();
  const [versionOfADoc, setVersionOfADoc] = useState<any[]>();

  useEffect(() => {
    const currentDoc = missionData?.data?.docs.find(
      (doc: any) => doc.id === currentDocId
    );
    setCurrentDoc(currentDoc);
  }, [currentDocId, listVersionDocs]);

  useEffect(() => {
    const listVersionDocs = missionData?.progress.flatMap((progress: any) => {
      return progress?.tallyResult?.submission || [];
    });
    setListVersionDocs(listVersionDocs);
  }, [missionData]);

  useEffect(() => {
    if (listVersionDocs && currentDocId) {
      const versions = listVersionDocs.filter(
        (version: any) => version[currentDocId] !== undefined
      );
      setVersionOfADoc(versions);
    }
  }, [listVersionDocs, currentDocId]);

  return (
    <>
      <Card className='p-3'>
        <div className='flex flex-col gap-6'>
          <div className='flex justify-between'>
            <p className='text-xl font-medium'>{titleDescription}</p>
          </div>
          {missionData?.data?.docs.length !== 0 ? (
            <div className='flex flex-col gap-6'>
              {missionData?.data?.docs.map((doc: any, index: any) => (
                <div className='flex justify-between w-full' key={index}>
                  <div>{doc?.title}</div>
                  <p
                    className='text-[#6200EE] cursor-pointer'
                    onClick={() => setCurrentDocId(doc.id)}
                  >
                    View
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex justify-center items-center w-full h-[100px]'>
              <Empty />
            </div>
          )}
        </div>
      </Card>
      {currentDoc && (
        <ModalHistoryOfADoc
          docTitle={currentDoc.title}
          open={!!currentDocId}
          onClose={() => setCurrentDocId(null)}
          versionOfADoc={versionOfADoc}
        />
      )}
    </>
  );
};

export default ProposalDocuments;
