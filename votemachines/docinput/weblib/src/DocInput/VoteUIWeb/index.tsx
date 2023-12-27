import React from 'react';
import { useState, useEffect } from 'react';
import { Card, Button, Radio } from 'antd';
import { IDoc } from 'directed-graph';
import { getTimeRemainingToEnd } from '../funcs';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { TextEditor } from 'rich-text-editor';
import ShowDescription from './ShowDescription';
import { IVoteUIWebProps } from 'directed-graph';

// How to find all historical version of a doc?

const VoteUIWeb = (props: IVoteUIWebProps): JSX.Element => {
  const { onSubmit, missionData, checkpointData } = props;
  console.log('missionData: ', missionData);
  console.log('checkpointData: ', checkpointData);
  const dataOfAllDocs = missionData?.data?.docs || [];
  // TODO: later acquire this through PDA-style design
  const listVersionDocs: any[] = [];
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [expandedDocIds, setExpandedDocIds] = useState<string[]>([]);
  const [expandVoteForDocInput, setExpandVoteForDocInput] = useState<boolean>();
  const [editorValues, setEditorValues] = useState<{ [key: string]: string }>(
    {}
  );
  const optionDocs: any[] = [];
  if (checkpointData && dataOfAllDocs && listVersionDocs && missionData) {
    const checkpointDocs = checkpointData.data.docs;
    const missionDocs: IDoc[] = missionData.data.docs;

    const filteredDocs = missionDocs
      .filter((missionDoc) =>
        checkpointDocs.some(
          (checkpointDoc: any) => checkpointDoc.id === missionDoc.id
        )
      )
      .map((filteredDoc) => {
        const correspondingCheckpointDoc = checkpointDocs.find(
          (checkpointDoc: any) => checkpointDoc.id === filteredDoc.id
        );

        // Check if the doc exists in listVersionDocs
        const versionDocEntry = listVersionDocs.find(
          (entry: any) => entry[correspondingCheckpointDoc.id]
        );

        // If exists, get the content from dataOfAllDocs with the latest created_at
        if (versionDocEntry) {
          const latestDocVersion = dataOfAllDocs
            .filter(
              (doc: any) => doc.doc_input_id === correspondingCheckpointDoc.id
            )
            .sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0];

          if (latestDocVersion) {
            filteredDoc.template = latestDocVersion.content;
          }
        }

        return {
          ...filteredDoc,
          action: correspondingCheckpointDoc?.action,
        };
      });
    optionDocs.push(...filteredDocs);
  }

  const handleConfirm = () => {
    const finalValues = Object.keys(editorValues).reduce((acc: any, docId) => {
      const optionDoc = optionDocs.find((doc: any) => doc.id === docId);
      if (optionDoc.action === 'Append ') {
        acc[docId] = optionDoc.template + editorValues[docId];
      } else {
        acc[docId] = editorValues[docId];
      }
      return acc;
    }, {});
    console.log('confirm: ', finalValues);
  };

  return (
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
                      <p>{optionDoc?.action}</p>
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
                  {expandedDocIds.includes(optionDoc.id) &&
                    (optionDoc?.action === 'Append ' ? (
                      <>
                        <ShowDescription
                          titleDescription={''}
                          description={optionDoc.template}
                          isAppendDocInput={true}
                          bgColor='bg-[#F6F6F6]'
                        />
                        <div className='mt-4'>
                          <TextEditor
                            value={editorValues[optionDoc.id]}
                            id={`text-editor-${optionDoc.id}`}
                            setValue={(newValue: any) => {
                              setEditorValues((prevValues) => ({
                                ...prevValues,
                                [optionDoc.id]: newValue,
                              }));
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <TextEditor
                        value={editorValues[optionDoc.id] || optionDoc.template}
                        id={`text-editor-${optionDoc.id}`}
                        setValue={(newValue: any) => {
                          setEditorValues((prevValues) => ({
                            ...prevValues,
                            [optionDoc.id]: newValue,
                          }));
                        }}
                      />
                    ))}
                </div>
              </div>
            );
          })}
      </div>
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
            checkpointData.data.options.map((option: any, index: any) => (
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
            onClick={handleConfirm}
            disabled={
              selectedOption &&
              getTimeRemainingToEnd(checkpointData.endToVote) != 'expired'
                ? false
                : true
            }
          >
            Confirm
          </Button>
        </div>
      </div>
    </>
  );
};

export default VoteUIWeb;
