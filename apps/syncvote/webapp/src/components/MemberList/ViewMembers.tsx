/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import CopyIcon from '@assets/icons/svg-icons/CopyIcon';
import Button from '@components/Button/Button';
import { L } from '@utils/locales/L';
import CommonSelectBox from '@components/SelectBox';
import { SelectBoxOption } from 'types/common';
import XCircle from '@assets/icons/svg-icons/XCircle';
import { sliceAddressToken, unsecuredCopyToClipboard } from '@utils/helpers';
import { Tooltip } from 'antd';
import { IMember, IRole } from '@types';

type Props = {
  closeModal?: () => void;
  content?: string;
  members?: IMember[];
  activeRole?: string | number;
  setActiveRole?: (value: string) => void;
  chosenRoles?: Array<SelectBoxOption> | IRole[];
  clickOnAddMember?: () => void;
  isReviewMode?: boolean;
};

const ViewMembers = ({
  closeModal = () => {},
  content,
  members = [],
  activeRole,
  setActiveRole = () => {},
  clickOnAddMember = () => {},
  chosenRoles = [],
  isReviewMode = false,
}: Props) => {
  const dropDownMembers = [
    {
      id: 'allMembers',
      label: 'All Members',
    },
    ...chosenRoles.map((i) => ({ id: i.id, label: i.label })),
  ];

  const [activeRoleId, setActiveRoleId] = useState<string | number>(activeRole || 'allMembers');
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const listMembers =
    activeRoleId === 'allMembers'
      ? members
      : members.filter((item: IMember) => activeRoleId === item.roleId);

  const handleCloseModal = () => {
    closeModal();
  };

  const handleClickAddNewMember = () => {
    clickOnAddMember();
  };

  const handleOnChange = (value: string) => {
    setActiveRoleId(value);
    setActiveRole(value);
  };

  useEffect(() => {
    setActiveRoleId(activeRole || 'allMembers');
  }, [activeRole]);

  const handleCopyLink = (value: string, index: number) => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(value);
    } else {
      unsecuredCopyToClipboard(value);
    }
    // navigator.clipboard.writeText(value);
    setActiveTooltip(index);
    setTimeout(() => setActiveTooltip(null), 2000);
  };
  return (
    <div className="h-[75vh]">
      <div className="flex flex-col justify-start gap-4 items-center w-full h-full">
        <div className="flex w-[561px] h-[52.02px] items-center justify-between ">
          <div className="text-[25px] leading-[32px] font-semibold tracking-[0.395] text-[#252422] ">
            <span>{L('memberList')}</span>
          </div>
          <div>
            <Button
              variant="outline"
              className="w-[40.71px] h-[40.71px] rounded-[113.087px] hover:border-none flex items-center justify-center"
              onClick={handleCloseModal}
            >
              <XCircle />
            </Button>
          </div>
        </div>
        <div className="w-full">
          <CommonSelectBox
            borderClassName="justify-start border-none p-0"
            iconDropDownClassName="w-[10px] h-[5px] text-violet-version-5"
            options={dropDownMembers}
            defaultValue={dropDownMembers.find((item) => item.id === activeRoleId)}
            dropDownClassName="w-[211px]"
            sizeTextClass="text-violet-version-5 font-medium text-[15px] pr-[9px] leading-[20px] py-[8px]"
            onChange={(value: SelectBoxOption | null) => {
              if (value) {
                handleOnChange(value.id);
              }
            }}
            isDefault
          />
        </div>
        <div className="w-[561px] max-h-[70vh] overflow-auto">
          {listMembers.map((item: IMember, index) => (
            <div
              className="flex gap-[24px] mb-[8px] border-b-1.5 border-grey-version-2"
              key={uuidv4()}
            >
              <div className="w-[268.5px] text-text_3 leading-[25px] px-[10px] py-[10px] flex justify-between items-center">
                <span className="text-[20px] leading-[25px] font-medium text-grey-version-7">
                  {item.nameTag}
                </span>
              </div>
              <div>
                <div className="w-[268.5px] flex text-text_3 justify-between items-center px-[10px] py-[10px]">
                  <div className="w-full">
                    <Tooltip
                      placement="right"
                      title="Copied link"
                      color="#7948C7"
                      open={activeTooltip === index}
                      trigger="click"
                    >
                      <div className="flex gap-[8px] items-center justify-end">
                        <span className="text-[20px] leading-[25px] font-medium text-grey-version-7">
                          {sliceAddressToken(item.walletAddress)}
                        </span>
                        <div onClick={() => handleCopyLink(item.walletAddress, index)}>
                          <CopyIcon />
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {content && (
          <div className="w-[561px] pt-[24px] flex justify-center items-center">
            <Button
              children={content}
              variant="text"
              className="w-[268.5px] text-text_3 leading-[25px] h-[57px] flex justify-center text-[#5D23BB] items-center "
            />
          </div>
        )}
        {!isReviewMode && (
          <div className="mt-auto py-[19px] text-violet-version-5">
            <span
              className="text-[20px] font-medium leading-[25px] cursor-pointer hover:underline "
              onClick={handleClickAddNewMember}
            >
              {L('addANewMembers')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMembers;
