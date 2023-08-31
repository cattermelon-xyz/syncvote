/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PlusIcon from '@assets/icons/svg-icons/PlusIcon';
import Button from '@components/Button/Button';
import { L } from '@utils/locales/L';
import CommonSelectBox from '@components/SelectBox';
import { SelectBoxOption } from 'types/common';
import { IRole } from 'types';
import XCircle from '@assets/icons/svg-icons/XCircle';
import WarningIcon from '@assets/icons/svg-icons/WarningIcon';
import './styles.scss';

interface Props {
  chosenRoles?: any[];
  isWorkflow?: boolean;
  members?: any[];
  activeRole?: string;
  // setActiveRole?: (value: string) => void;
  closeModal?: () => void;
  dispatchRoles?: (variant: any[], roleId?: string | number) => void;
  clickOnViewMembers?: () => void;
}

const FIELD_INPUT = {
  ID: 'id',
  NAME_TAG: 'nameTag',
  WALLET_ADDRESS: 'walletAddress',
};

const dataMembers = [
  {
    id: uuidv4(),
    nameTag: '',
    walletAddress: '',
  },
];

const EditMember: React.FC<Props> = ({
  chosenRoles = [],
  isWorkflow = false,
  members = dataMembers,
  activeRole,
  closeModal = () => {},
  dispatchRoles = () => {},
  clickOnViewMembers = () => {},
}: Props) => {
  const [currentRole, setCurrentRole] = useState(
    chosenRoles.find((role: any) => role.id === activeRole) || chosenRoles[0],
  );
  const [listDataMember, setListDataMember] = useState(
    members?.filter((item: any) => item.roleId === currentRole.id),
  );
  const [inputValues, setInputValues] = useState<{ [id: number]: string }>({});
  const [hasError, setHasError] = useState(false);
  const updateMembers = () => {
    if (isWorkflow) {
      const foundRole: any = chosenRoles.find((role: SelectBoxOption) => {
        return currentRole.id === role.id;
      });
      if (!foundRole) {
        return;
      }

      const memberOfRole: IRole[] = listDataMember.map((item) => ({
        ...item,
        roleId: currentRole.id,
      }));
      dispatchRoles(memberOfRole, currentRole.id);
      return;
    }

    const updatedAllowedRoles: any = chosenRoles.map((role: SelectBoxOption) => {
      if (currentRole.id === role.id) {
        return { ...role, member: listDataMember };
      }
      return role;
    });
    dispatchRoles(updatedAllowedRoles);
  };

  const handleAddNumber = () => {
    const item = {
      id: uuidv4(),
      nameTag: '',
      walletAddress: '',
    };
    setListDataMember([...listDataMember, item]);
  };
  const handleCloseModal = () => {
    closeModal();
  };

  const handleClickApply = () => {
    updateMembers();
    clickOnViewMembers();
  };
  const isExistsNameTag = (value: string, index: number) => {
    return listDataMember.find((e, i) => i !== index && e.nameTag === value);
  };
  const handleInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const { value } = e.target;
    const nextInputValues = { ...inputValues, [id]: value };
    const nextListOfOptions = listDataMember.map((option: any) => {
      if (option.id === id) {
        return { ...option, [key]: nextInputValues[id] };
      }
      return option;
    });

    setInputValues(nextInputValues);
    setListDataMember(nextListOfOptions);
  };

  const onChangeRoleDropdown = (value: SelectBoxOption) => {
    setCurrentRole(value);

    const nextListDataMember = members?.filter((item: any) => item.roleId === value.id);
    if (nextListDataMember.length) {
      setListDataMember(nextListDataMember);
      return;
    }
    setListDataMember(dataMembers);
  };

  useEffect(() => {
    setListDataMember(members?.filter((item: any) => item.roleId === currentRole.id));
  }, [members]);

  useEffect(() => {
    const nameTags = listDataMember.map((item) => item.nameTag);
    const isDuplicate = new Set(nameTags).size !== nameTags.length;
    setHasError(
      listDataMember.some((item: any) => !item.nameTag.trim() || !item.walletAddress.trim()) ||
        isDuplicate,
    );
  }, [listDataMember]);

  useEffect(() => {
    handleAddNumber();
  }, []);

  return (
    <div className="max-h-[90vh] w-[561px] max-w-[100%]">
      <div className="flex min-h-[52px] items-center justify-between">
        <div className="text-[25px] leading-[32px] font-semibold tracking-[0.395] text-[#252422]">
          <span>{L('addNewMembers')}</span>
        </div>
        <div>
          <Button
            variant="outline"
            className="w-[40.71px] h-[40.71px] rounded-[113.087px] hover:border-none flex justify-center items-center"
            onClick={handleCloseModal}
          >
            <XCircle />
          </Button>
        </div>
      </div>
      <div className="min-h-[81px] pb-16px mb-[16px] border-gray-version-3 border-b-[1px]">
        {chosenRoles && (
          <CommonSelectBox
            label="Add to role"
            labelClassName="pt-[26.1px] text-[12px] leading-[16px] font-medium"
            borderClassName="h-[57px]"
            iconDropDownClassName="w-[16px] h-[10px] text-grey-version-7"
            options={chosenRoles}
            defaultValue={currentRole}
            sizeTextClass="text-grey-version-7 font-medium text-[20px] leading-[25px]"
            isDefault
            onChange={(value) => {
              if (value) {
                onChangeRoleDropdown(value);
              }
            }}
          />
        )}
      </div>
      <div className="add-member-content">
        {listDataMember.map((item: any, index: number) => (
          <div className="flex w-[561px] pt-4 overflow-scroll" key={item.id}>
            <div className="w-[50%] pr-[6px]">
              <div className=" pb-2 font-medium text-text_6 leading-5 text-grey-version-6">
                <p className="font-medium text-[12px] leading-[16px]">{L('nameTag')}</p>
              </div>
              <div
                className={`p-4 border-1.5 h-[57px] ${
                  item?.nameTag.trim() ? 'border-grey-version-3' : 'border-yellow-version-5'
                } rounded-8 text-text_3 leading-line-semi-letter text-grey-version-7`}
              >
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Limon"
                  className="text-grey-version-7 focus:outline-none"
                  value={item?.nameTag}
                  onChange={(e) => handleInputChange(item.id, e, FIELD_INPUT.NAME_TAG)}
                />
              </div>
              {!item?.nameTag.trim() && (
                <div className="flex items-center gap-8px mt-[8px]">
                  <WarningIcon />
                  <span className="text-emph-caption-1 text-grey-version-5">
                    {L('thisFieldIsRequiredPleaseFillIn')}
                  </span>
                </div>
              )}
              {item?.nameTag.trim() && isExistsNameTag(item.nameTag, index) && (
                <div className="flex items-center gap-8px mt-[8px]">
                  <WarningIcon />
                  <span className="text-emph-caption-1 text-grey-version-5">
                    {L('duplicateNameTag')}
                  </span>
                </div>
              )}
            </div>

            <div className="w-[50%] pl-[6px]">
              <div className="pb-2 font-medium text-text_6 leading-5 text-grey-version-6">
                <p className="font-medium text-[12px] leading-[16px]">{L('walletAddress')}</p>
              </div>
              <div
                className={`p-4 h-[57px] rounded-8 text-text_3 leading-line-semi-letter border-1.5 ${
                  item?.walletAddress.trim() ? 'border-grey-version-3' : 'border-yellow-version-5'
                } text-grey-version-7`}
              >
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Ox...."
                  className="text-grey-version-7 focus:outline-none"
                  value={item?.walletAddress}
                  onChange={(e) => handleInputChange(item.id, e, FIELD_INPUT.WALLET_ADDRESS)}
                />
              </div>
              {!item?.walletAddress.trim() && (
                <div className="flex items-center gap-8px mt-[8px]">
                  <WarningIcon />
                  <span className="text-emph-caption-1 text-grey-version-5">
                    {L('thisFieldIsRequiredPleaseFillIn')}
                  </span>
                </div>
              )}
            </div>
            <div />
          </div>
        ))}
        <div className="min-h-[36px] text-center text-[15px] leading-[20px] tracking-[0.6px] m-auto ">
          <Button className="px-6 py-2" variant="text" onClick={handleAddNumber}>
            <span className="flex justify-center items-center cursor-pointer">
              <span>
                <PlusIcon color="#5D23BB" />
              </span>
              <span className="text-[#5D23BB] cursor-pointer">
                <span>{L('addNewOne')}</span>
              </span>
            </span>
          </Button>
        </div>

        <div className="mt-[16px] min-h-[63px]">
          <Button
            children="Apply"
            variant="primary"
            className="w-[561px] h-[63px] text-text_3"
            onClick={handleClickApply}
            disabled={hasError}
          />
        </div>
      </div>
    </div>
  );
};

export default EditMember;
