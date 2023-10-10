/* eslint-disable jsx-a11y/no-autofocus */

import React, { useEffect, useRef, useState } from 'react';
import { useClickOutside } from '@utils/hooks/useClickOutSide';
import { L } from '@utils/locales/L';
import { isSelected, renderValidateStatus } from '@utils/helpers';
import ThreeDots from '@assets/icons/svg-icons/ThreeDots';
import { AlertMessage, SelectBoxOption } from 'types/common';
import ArrowDownIcon from '@assets/icons/svg-icons/ArrowDownIcon';
import { IRole } from '@types';
import TrashCan from '@assets/icons/svg-icons/TrashCan';
import { Modal } from 'antd';
import XCircle from '@assets/icons/svg-icons/XCircle';
import ValidateMessage from '@components/ValidateMessage';

type Props = {
  label?: string;
  labelClassName?: string;
  options: Array<SelectBoxOption> | IRole[];
  placeholder?: string;
  disabledInput?: boolean;
  canChooseOnlyOne?: boolean;
  defaultValues?: Array<SelectBoxOption> | IRole[];
  validate?: AlertMessage | null;
  isReview?: boolean;
  onChange?: (values: SelectBoxOption[] | IRole[]) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement> | string) => void;
  handleRemoveRole?: (roleId: string) => void;
  handleRenameRole?: (roleId: string, newName: string) => void;
};

const CommonSelectMultiple = ({
  label,
  labelClassName = '',
  options = [],
  isReview,
  disabledInput = false,
  placeholder = L('chooseAnOption'),
  defaultValues = [],
  validate = null,
  canChooseOnlyOne = false,
  onChange = () => {},
  onEnter = () => {},
  handleRemoveRole = () => {},
  handleRenameRole = () => {},
}: Props) => {
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const [activeOption, setActiveOption] = useState<string | number>();
  const [selectedValues, setSelectedValues] = useState<IRole[] | SelectBoxOption[]>(defaultValues);
  const [isShowModal, setIsShowModal] = useState(false);

  const optionRef = useClickOutside(() => {
    setIsOpenOptions(false);
    setActiveOption('');
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const roleNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange(selectedValues);
  }, [selectedValues]);
  useEffect(() => {
    if (JSON.stringify(defaultValues) !== JSON.stringify(selectedValues)) {
      setSelectedValues(defaultValues);
    }
  }, [defaultValues]);

  const handleSelectedOption = (value: any) => {
    if (isReview) return;
    const currentSelected: any = [...selectedValues];
    if (isSelected(value, selectedValues)) {
      setSelectedValues(currentSelected.filter((item: any) => item.id !== value.id));
    } else if (canChooseOnlyOne) {
      setSelectedValues([value]);
    } else {
      setSelectedValues([...currentSelected, value]);
    }
    setIsOpenOptions(false);
    setActiveOption('');
  };

  const handleAddValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const nextOption = {
        id: e.currentTarget.value,
        label: e.currentTarget.value,
      };
      if (e.currentTarget.value === '') return;
      const existOption = selectedValues.some((item) => item.id === e.currentTarget.value);
      if (!existOption) {
        handleSelectedOption(nextOption);
        onEnter(e.currentTarget.value);
        setIsOpenOptions(true);
      }

      e.currentTarget.value = '';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }

    if (e.key === 'Backspace') {
      if (inputRef?.current && inputRef?.current?.value.length > 0) return;
      const nextSelectedValues = selectedValues.slice(0, -1);
      setSelectedValues(nextSelectedValues);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const removeRole = (roleId: string | number) => {
    const nextSelectedValues = (selectedValues as any).filter((item: any) => item.id !== roleId);
    setSelectedValues(nextSelectedValues);
    handleRemoveRole(roleId as string);
  };

  const handleEnterEditRole = (value: string, id: string) => {
    // const { value } = e.currentTarget;

    if (value.trim() === '') {
      removeRole(id);
    }
  };

  return (
    <div className="flex flex-col w-full relative gap-8px">
      <span className={`text-emph-subhead text-grey-version-6 select-none ${labelClassName}`}>
        {label}
      </span>
      <div
        className={`select-multiple items-center ${
          isReview ? 'cursor-default' : ''
        } ${renderValidateStatus(validate)}`}
        onClick={(e) => {
          if (isReview) return;
          if (canChooseOnlyOne) {
            setIsOpenOptions(!isOpenOptions);
          } else {
            e.stopPropagation();
            setIsOpenOptions((pre) => !pre);
          }
          setActiveOption('');
        }}
        ref={optionRef}
      >
        <div className="flex gap-8px pr-1 w-full focus:outline-none overflow-hidden rounded-8">
          {selectedValues?.length > 0 ? (
            <div className="flex flex-wrap rounded-8 w-full">
              {selectedValues.map((item) => (
                <div className={`mt-2 mr-2 mb-2 ${canChooseOnlyOne ? 'w-full' : ''}`} key={item.id}>
                  <span
                    className={`bg-violet-version-1 ${
                      isReview ? 'cursor-default' : 'cursor-pointer'
                    } p-4px rounded-8 text-violet-version-5 text-regular-callout whitespace-nowrap`}
                    onClick={() => handleSelectedOption(item)}
                  >
                    {item?.label}
                  </span>
                </div>
              ))}
              {isOpenOptions && (
                <input
                  className="min-w-[40%] text-[15px] focus:outline-none bg-transparent ml-[4px] grow"
                  onKeyDown={handleAddValue}
                  disabled={disabledInput || isReview}
                  ref={inputRef}
                  autoFocus={isOpenOptions}
                />
              )}
            </div>
          ) : (
            <div className="text-regular-title-3 flex-1 text-grey-version-5">
              <input
                className="w-full h-full focus:outline-none bg-transparent text-grey-version-7"
                placeholder={placeholder}
                onKeyDown={handleAddValue}
                disabled={disabledInput || isReview}
                ref={inputRef}
              />
            </div>
          )}
        </div>

        {!isReview && (
          <div
            className="w-[10px] h-[5px] ml-[6px] text-grey-version-6 flex justify-center items-center"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpenOptions((pre) => {
                return !pre;
              });
            }}
          >
            <ArrowDownIcon />
          </div>
        )}
        {options.length > 0 && isOpenOptions && (
          <div
            className="ease-in duration-300 z-10 absolute w-full py-2
            bg-white border-1.5 border-grey-version-3 left-0 rounded-8 top-anchor-bottom"
          >
            {options?.map((option, index) => {
              const isExist = selectedValues.some((item) => item.id === option.id);
              return (
                <div
                  className={`relative ${index === options.length - 1 ? '' : 'pb-2'}`}
                  key={option.id}
                  onClick={() => handleSelectedOption(option)}
                >
                  <div
                    className={`px-16px py-[8px] h-[30px] hover:bg-violet-version-1 flex justify-between items-center ${
                      isExist ? 'bg-violet-version-1' : ''
                    }`}
                  >
                    <span className="cursor-pointer bg-violet-version-1 p-4px rounded-8 text-violet-version-5 text-regular-callout tracking-0.5px">
                      {option?.label}
                    </span>
                    <span className="cursor-pointer flex justify-center items-center">
                      <ThreeDots
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeOption === option.id) {
                            setActiveOption('');
                          } else {
                            setActiveOption(option.id);
                          }
                        }}
                      />
                    </span>
                  </div>

                  <div
                    className={`absolute right-[20px] top-[100%] z-10 text-[15px] py-[12px] px-[16px] ${
                      activeOption === option.id ? 'block' : 'hidden'
                    } bg-[#fff] rounded-[8px] w-[216px] h-[102px] border-1.5 cursor-default flex flex-col justify-between gap-[10px]`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div className="w-[184px]">
                      <input
                        type="text"
                        value={option?.label}
                        className="outline-0 border-violet-version-5 h-[36px] border p-8px rounded-[8px] max-w-full w-full block font-medium text-[15px] leading-[20px] text-grey-version-7"
                        onChange={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRenameRole(option.id as string, e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setActiveOption('');
                            handleEnterEditRole(
                              (e.target as HTMLInputElement).value,
                              option.id as string,
                            );
                          }
                        }}
                        ref={roleNameRef}
                      />
                    </div>
                    <div
                      className="inline-flex w-fit py-2 pr-[8px] items-center text-[#A22C29] text-[16px] cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsShowModal(true);
                      }}
                    >
                      <TrashCan />
                      <span className="ml-[6px]">Delete</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Modal open={isShowModal} onCancel={() => setIsShowModal(false)} className="z-300">
        <div className="w-[585px] text-[#252422]">
          <div className="flex justify-between items-center mb-[26px]">
            <span className="text-[25px] font-[600] text-[#252422]">
              Are you sure to delete this role?
            </span>
            <span className="cursor-pointer" onClick={() => setIsShowModal(false)}>
              <XCircle />
            </span>
          </div>
          <p className="text-[17px] leading-[22px] mb-[16px] tracking-[0.5px] font-[400] text-[#252422;]">
            When you delete this role, all members added to it will be removed as well.
          </p>
          <div className="flex gap-4 ">
            <button
              onClick={() => setIsShowModal(false)}
              className="px-[16px] py-[19px] w-[50%] rounded-[8px] text-[20px] leading-[25px] border bg-[#F6F6F6]"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsShowModal(false);
                removeRole(activeOption || '');
              }}
              className="px-[16px] py-[19px] w-[50%] rounded-[8px] text-[20px] leading-[25px] border bg-[#A22C29] text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      <ValidateMessage condition={validate} />
    </div>
  );
};

export default CommonSelectMultiple;
