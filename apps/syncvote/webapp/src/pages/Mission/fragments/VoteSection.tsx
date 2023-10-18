import { useEffect, useState } from 'react';
import { Card, Button, Radio } from 'antd';
import { getTimeRemainingToEnd } from '@utils/helpers';
import { IDoc } from 'directed-graph';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { TextEditor } from 'rich-text-editor';

interface Props {
  currentCheckpointData: any;
  onSelectedOption: any;
  setOpenModalVoterInfo: any;
  missionData: any;
  setSubmission: any;
  submission: any;
}

const VoteSection: React.FC<Props> = ({
  currentCheckpointData,
  onSelectedOption,
  setOpenModalVoterInfo,
  missionData,
  setSubmission,
  submission,
}) => {
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  const [docsOfMission, setDocsOfMission] = useState(
    missionData.data.docs || []
  );
  const [optionDocs, setOptionDocs] = useState<any>([]);
  const [expandedDocIds, setExpandedDocIds] = useState<string[]>([]);
  const [editorValues, setEditorValues] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    if (selectedOption) {
      onSelectedOption(selectedOption);
    }
    if (missionData && currentCheckpointData) {
      const checkpointDocs = currentCheckpointData.data.docs;
      const missionDocs: IDoc[] = missionData.data.docs;
      // setDocsOfMission(missionDocs);

      // filteredDocs is only contain docs in missionDocs have the same id with doc in checkpointDocs
      const filteredDocs = missionDocs.filter((missionDoc) =>
        checkpointDocs.some(
          (checkpointDoc: any) => checkpointDoc.id === missionDoc.id
        )
      );

      setOptionDocs(filteredDocs);
    }

    console.log('editorValues', editorValues);
  }, [selectedOption, currentCheckpointData, missionData, editorValues]);

  return (
    <div className='flex flex-col gap-4'>
      {currentCheckpointData?.vote_machine_type === 'DocInput' && (
        <>
          <p className='text-xl font-medium'>Checkpoint requirements</p>
          <div className='flex flex-col gap-7 mt-5'>
            {optionDocs &&
              optionDocs.map((optionDoc: any, index: any) => {
                return (
                  <div key={index}>
                    <div
                      className={` flex justify-between ${
                        expandedDocIds.includes(optionDoc.id) ? 'mb-7' : ''
                      }`}
                    >
                      <p>{optionDoc?.title}</p>
                      {expandedDocIds.includes(optionDoc.id) ? (
                        <DownOutlined
                          onClick={() =>
                            setExpandedDocIds((prevIds) =>
                              prevIds.filter((id) => id !== optionDoc.id)
                            )
                          }
                        />
                      ) : (
                        <UpOutlined
                          onClick={() =>
                            setExpandedDocIds((prevIds) => [
                              ...prevIds,
                              optionDoc.id,
                            ])
                          }
                        />
                      )}
                    </div>
                    {expandedDocIds.includes(optionDoc.id) && (
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
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </>
      )}

      <Card className='p-4'>
        <div className='flex flex-col gap-6'>
          <p className='text-xl font-medium'>Vote</p>
          {currentCheckpointData.data.options.map((option: any, index: any) => (
            <Card className='w-full' key={index}>
              {/* selectedOption === index + 1 because 0 === false can't not check radio button */}
              <Radio
                checked={
                  selectedOption === (option === 'Abstain' ? -1 : index + 1)
                }
                onChange={() =>
                  setSelectedOption(option === 'Abstain' ? -1 : index + 1)
                }
              >
                {`${index + 1}. ${option}`}
              </Radio>
            </Card>
          ))}
          <Button
            type='primary'
            className='w-full'
            onClick={() => {
              setSubmission(editorValues);
              setOpenModalVoterInfo(true);
            }}
            disabled={
              selectedOption &&
              getTimeRemainingToEnd(currentCheckpointData.endToVote) !=
                'expired'
                ? false
                : true
            }
          >
            Vote
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VoteSection;
