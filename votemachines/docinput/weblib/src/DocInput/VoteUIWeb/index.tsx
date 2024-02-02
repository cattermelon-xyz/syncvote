import React from 'react';
import { useState, useEffect } from 'react';
import { Card, Button, Radio, Input, Tag, Divider } from 'antd';
import { IDoc } from 'directed-graph';
import { getTimeRemainingToEnd } from '../funcs';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { TextEditor } from 'rich-text-editor';
import ShowDescription from './ShowDescription';
import { IVoteUIWebProps } from 'directed-graph';

// How to find all historical version of a doc?

const VoteUIWeb = (props: IVoteUIWebProps): JSX.Element => {
  const { onSubmit, missionData, checkpointData } = props;
  const variables = missionData.props?.variables || [];
  const dataOfAllDocs = missionData?.data?.docs || [];
  // TODO: later acquire this through PDA-style design
  const listVersionDocs: any[] = [];
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [expandedDocIds, setExpandedDocIds] = useState<string[]>([]);
  const [expandVoteForDocInput, setExpandVoteForDocInput] =
    useState<boolean>(true);
  const [editorValues, setEditorValues] = useState<{ [key: string]: string }>(
    {}
  );
  const optionDocs: any[] = [];
  if (checkpointData && dataOfAllDocs && listVersionDocs && missionData) {
    const checkpointDocs = checkpointData.data.docs;
    const missionDocs: IDoc[] = missionData.data.docs;

    const filteredDocs = missionDocs
      .filter((missionDoc) =>
        checkpointDocs?.some(
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
    // const finalValues = Object.keys(editorValues).reduce((acc: any, docId) => {
    //   const optionDoc = optionDocs.find((doc: any) => doc.id === docId);
    //   if (optionDoc.action === 'Append ') {
    //     acc[docId] = optionDoc.template + editorValues[docId];
    //   } else {
    //     acc[docId] = editorValues[docId];
    //   }
    //   return acc;
    // }, {});
    const finalValues = {
      submission: variableValues,
      option: [selectedOption],
    };
    onSubmit(finalValues);
  };

  const [variableValues, setVariableValues] = useState<{
    [key: string]: string;
  }>({});

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 flex justify-center overflow-auto'>
        <div className='w-full flex flex-col' style={{ maxWidth: '700px' }}>
          <p className='text-base text-gray-500 mb-1'>
            Input value
          </p>
          <div className='flex flex-col gap-2 w-full mb-2'>
            {variables?.map((v: any) => (
              <div className='w-full flex-col items-center justify-between' key={v}>
                <h1 className='mb-6'>{v}</h1>
                <Input
                  value={variableValues[v] || ''}
                  className='w-full h-12'
                  onChange={(e) => {
                    variableValues[v] = e.target.value;
                    setVariableValues({ ...variableValues });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='w-full'>
        <Divider className='my-1' />
        <div className='w-full flex pt-2 pb-3 pr-5 items-center' style={{flexDirection: 'row-reverse'}}>
          {expandVoteForDocInput &&
            checkpointData.data.options.map((option: any, index: any) => (
              <Button
                key={index}
                type={index === 1 ? 'primary' : 'default'}
                className={`mx-2 ${
                  selectedOption === (option === 'Abstain' ? -1 : index)
                    ? 'selected-button-class'
                    : 'normal-button-class'
                }`}
                style={{ order: index === 1 ? -1 : 0 }} // This line ensures primary button is on the right
                onClick={() => {
                  setSelectedOption(option === 'Abstain' ? -1 : index);
                  handleConfirm();
                }}
              >
                {option}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default VoteUIWeb;
