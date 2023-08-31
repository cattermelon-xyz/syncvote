import ArrowDownIcon from '@assets/icons/svg-icons/ArrowDownIcon';
import { useClickOutside } from '@utils/hooks/useClickOutSide';
import { L } from '@utils/locales/L';
import { useEffect, useState } from 'react';
import { renderValidateStatus } from '@utils/helpers';
import ValidateMessage from '@components/ValidateMessage';
import { AlertMessage } from 'types/common';
import { SelectBoxOption } from './interfaces';

type Props = {
  label?: string;
  labelClassName?: string;
  iconDropDownClassName?: string;
  borderClassName?: string;
  divClass?: string;
  isOption?: boolean;
  options?: any[];
  placeholder?: string;
  dropDownClassName?: string;
  placeholderClass?: string;
  defaultValue?: any | null;
  validate?: AlertMessage | null;
  onChange?: (value: SelectBoxOption | null) => void;
  sizeTextClass?: string;
  textColor?: string;
  isDefault?: boolean;
  isReview?: boolean;
  colorPlaceholder?: string;
};

const CommonSelectBox = ({
  label,
  isReview,
  borderClassName = '',
  labelClassName = '',
  divClass = 'flex-col',
  iconDropDownClassName = '',
  options,
  placeholder = L('chooseAnOption'),
  placeholderClass = '',
  defaultValue = null,
  validate = null,
  isOption,
  colorPlaceholder = '',
  dropDownClassName = '',
  textColor = '',
  onChange = () => {},
  sizeTextClass = 'text-regular-title-3',
  isDefault = false,
}: Props) => {
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const [selectedValue, setSelectedValue] = useState<SelectBoxOption | null>(defaultValue);

  const optionRef = useClickOutside(() => {
    setIsOpenOptions(false);
  });

  const handleSelectedOption = (value: SelectBoxOption) => {
    setSelectedValue(value);
  };

  const handleClickSelectBox = () => {
    if (isReview) return;
    setIsOpenOptions((prevState) => !prevState);
  };

  useEffect(() => {
    onChange(selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    if (isDefault === false) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className={`flex w-full gap-8px ${divClass}`}>
      {label && (
        <span className={`text-emph-subhead text-grey-version-6 select-none ${labelClassName}`}>
          {label}
        </span>
      )}
      <div
        className={`select-box items-center select-none ${
          isReview || (options && options.length < 2) ? 'cursor-default' : ''
        } ${borderClassName} ${renderValidateStatus(validate)}`}
        onClick={handleClickSelectBox}
        ref={optionRef}
      >
        {selectedValue ? (
          <div className="flex gap-1 items-center">
            {selectedValue.icon && <span>{selectedValue.icon}</span>}
            <span className={`text-grey-version-7 pr-3 ${colorPlaceholder} ${sizeTextClass}`}>
              {selectedValue.label}
            </span>
          </div>
        ) : (
          <span className={`text-grey-version-7 pr-3 ${placeholderClass} ${sizeTextClass}`}>
            {placeholder}
          </span>
        )}
        {!isReview && options && options.length > 1 && (
          <div
            className={`w-[10px] h-[5px] text-grey-version-6 ${iconDropDownClassName} flex justify-center items-center`}
          >
            <ArrowDownIcon />
          </div>
        )}
        {!isOption && options && options.length > 1 && (
          <>
            {isOpenOptions && (
              <div
                className={`ease-in duration-300 z-select-option absolute bg-white border-1.5 border-grey-version-3 left-0 rounded-8 w-[100%] top-anchor-bottom p-[1px] flex flex-col ${dropDownClassName}`}
              >
                {options?.map((option) => (
                  <div
                    className={`p-16px  text-regular-callout  ${
                      option === selectedValue && 'bg-[#F7F7F8]'
                    }  tracking-0.5px ${textColor} ${
                      option.disabled
                        ? 'text-[#BBBBBA] cursor-not-allowed '
                        : 'cursor-pointer hover:bg-[#F7F7F8]'
                    }`}
                    key={option.id}
                    onClick={() => !option.disabled && handleSelectedOption(option)}
                  >
                    {option?.icon ? (
                      <div className="flex gap-2">
                        {option?.icon}
                        {option.value ? option.value : option.label}
                      </div>
                    ) : (
                      <>{option.value ? option.value : option.label}</>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <ValidateMessage condition={validate} />
    </div>
  );
};

export default CommonSelectBox;
