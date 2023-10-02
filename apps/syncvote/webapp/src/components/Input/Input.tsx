import React from 'react';

type Props = {
  placeholder?: string;
  classes?: string;
  value?: any;
  inputName?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  onClick?: any;
};

const Input: React.FC<Props> = ({
  placeholder = '',
  classes = '',
  value = '',
  inputName = '',
  onChange = () => {},
  onBlur = () => {},
  disabled = false,
  onClick,
}) => (
  <input
    className={`rounded-lg border-[1.5px] text-grey-version-6 p-4 text-xl min-w-[450px] outline-none ${classes}`}
    placeholder={placeholder}
    onChange={onChange}
    value={value}
    name={inputName}
    onBlur={onBlur}
    disabled={disabled}
    onClick={onClick}
  />
);

export default Input;
