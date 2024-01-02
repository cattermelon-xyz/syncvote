import { Card, Empty } from 'antd';
import ModalHistoryOfADoc from './ModalHistoryOfADoc';
import { useEffect, useState } from 'react';
import { formatDate } from '@utils/helpers';

interface Props {
  titleDescription: string;
  missionData: any;
  listVersionDocs: any;
  dataOfAllDocs: any;
}

const ProposalDocuments: React.FC<Props> = ({
  titleDescription,
  missionData,
  listVersionDocs,
  dataOfAllDocs,
}) => {
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [currentDoc, setCurrentDoc] = useState<any>();
  const [versionOfADoc, setVersionOfADoc] = useState<any[]>();
  const [latestCreatedAt, setLatestCreatedAt] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const currentDoc = missionData?.data?.docs.find(
      (doc: any) => doc.id === currentDocId
    );
    setCurrentDoc(currentDoc);
  }, [currentDocId, listVersionDocs]);

  useEffect(() => {
    if (listVersionDocs && currentDocId) {
      const versions = listVersionDocs.filter(
        (version: any) => version[currentDocId] !== undefined
      );
      setVersionOfADoc(versions);
    }
  }, [listVersionDocs, currentDocId]);

  const getLatestCreatedAtForEachDoc = (
    listVersionDocs: any[],
    dataOfAllDocs: any[]
  ): Record<string, string> => {
    const docIds: Record<string, number[]> = {};
    console.log('listVersionDocs: ', listVersionDocs);
    listVersionDocs.forEach((doc: any) => {
      console.log('doc: ', doc);
      const [docInput, id] = Object.entries(doc)[0];
      docIds[docInput] = [...(docIds[docInput] || []), Number(id)];
    });

    const latestCreatedAt: Record<string, string> = {};

    Object.keys(docIds).forEach((docInput) => {
      let latestDoc: any = null;
      docIds[docInput].forEach((id: number) => {
        const currentDoc = dataOfAllDocs.find((doc: any) => doc.id === id);
        if (
          currentDoc &&
          (!latestDoc ||
            new Date(currentDoc.created_at) > new Date(latestDoc.created_at))
        ) {
          latestDoc = currentDoc;
        }
      });
      if (latestDoc) {
        latestCreatedAt[docInput] = latestDoc.created_at;
      }
    });

    return latestCreatedAt;
  };

  useEffect(() => {
    const latestCreatedAtResults = getLatestCreatedAtForEachDoc(
      listVersionDocs,
      dataOfAllDocs
    );
    setLatestCreatedAt(latestCreatedAtResults);
  }, [listVersionDocs, dataOfAllDocs]);

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
                <div className='flex w-full' key={index}>
                  <div className='w-3/5'>{doc?.title}</div>
                  <p className='w-1/5'>
                    {latestCreatedAt[doc.id]
                      ? formatDate(latestCreatedAt[doc.id])
                      : 'N/A'}
                  </p>
                  <p
                    className='text-[#6200EE] cursor-pointer w-1/5 text-right'
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
          dataOfAllDocs={dataOfAllDocs}
        />
      )}
    </>
  );
};

export default ProposalDocuments;
