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
  const [selectedOption, setSelectedOption] = useState<number>();
  const [optionDocs, setOptionDocs] = useState<any>([]);
  const [expandedDocIds, setExpandedDocIds] = useState<string[]>([]);
  const [expandVoteForDocInput, setExpandVoteForDocInput] = useState<boolean>();
  const [editorValues, setEditorValues] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    if (selectedOption) {
      onSelectedOption(selectedOption);
    }
    if (currentCheckpointData?.vote_machine_type === 'DocInput') {
      const checkpointDocs = currentCheckpointData.data.docs;
      const missionDocs: IDoc[] = missionData.data.docs;

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
          <div className='flex flex-col gap-4 mt-5'>
            {optionDocs &&
              optionDocs.map((optionDoc: any, index: any) => {
                return (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      expandedDocIds.includes(optionDoc.id)
                        ? 'items-start'
                        : 'items-center'
                    }`}
                  >
                    <div className='w-12 h-12 rounded-full bg-[#F6F6F6] flex items-center justify-center'>
                      {index + 1}
                    </div>
                    <div className='w-full'>
                      <div
                        className={` flex justify-between ${
                          expandedDocIds.includes(optionDoc.id) ? 'mb-7' : ''
                        }`}
                      >
                        <div className='flex flex-col gap-2 mt-1'>
                          <p>status</p>
                          <p>{optionDoc?.title}</p>
                        </div>
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
                        <div>
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
                  </div>
                );
              })}
          </div>
        </>
      )}

      {currentCheckpointData?.vote_machine_type === 'DocInput' ? (
        <div
          className={`flex gap-3 ${
            expandVoteForDocInput ? 'items-start' : 'items-start'
          }`}
        >
          <div className='w-12 h-12 rounded-full bg-[#F6F6F6] flex items-center justify-center'>
            {optionDocs.length + 1}
          </div>
          <div className='flex flex-col gap-6 w-full'>
            <div className={` flex justify-between`}>
              <div className='flex flex-col gap-2 mt-1'>
                <p>Navigate to</p>
                <p className='text-base font-semibold'>Next action</p>
              </div>
              {expandVoteForDocInput ? (
                <DownOutlined onClick={() => setExpandVoteForDocInput(false)} />
              ) : (
                <UpOutlined onClick={() => setExpandVoteForDocInput(true)} />
              )}
            </div>
            {expandVoteForDocInput &&
              currentCheckpointData.data.options.map(
                (option: any, index: any) => (
                  <Card className='w-full' key={index}>
                    {/* selectedOption === index + 1 because 0 === false can't not check radio button */}
                    <Radio
                      checked={
                        selectedOption ===
                        (option === 'Abstain' ? -1 : index + 1)
                      }
                      onChange={() =>
                        setSelectedOption(option === 'Abstain' ? -1 : index + 1)
                      }
                    >
                      {`${index + 1}. ${option}`}
                    </Radio>
                  </Card>
                )
              )}
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
              Confirm
            </Button>
          </div>
        </div>
      ) : (
        <Card className='p-4'>
          <div className='flex flex-col gap-6'>
            <p className='text-xl font-medium'>Vote</p>
            {currentCheckpointData.data.options.map(
              (option: any, index: any) => (
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
              )
            )}
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
      )}
    </div>
  );
};

export default VoteSection;
