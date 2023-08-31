import { Input } from 'antd';
import { ReactNode, useState } from 'react';

const NumberWithPercentageInput = ({
  prefix = <></>,
  suffix = <></>,
  value,
  setValue = undefined,
  className = '',
}: {
  prefix?: ReactNode;
  suffix?: ReactNode;
  value: number | undefined;
  setValue?: (value: number) => void;
  className?: string;
}) => {
  const convertToStr = (val: number) => {
    let tmp = '0';
    if (val !== undefined || val !== 0) {
      tmp =
        val < 1
          ? `${(val * 100).toFixed(2)}%`
          : `${val.toLocaleString('en-US')}`;
    }
    console.log('tmp in convertToStr', tmp);
    return tmp;
  };
  const [str, setStr] = useState<string>(convertToStr(value || 0));

  return setValue ? (
    <Input
      className={className}
      prefix={prefix}
      suffix={suffix}
      type='text'
      value={str}
      onChange={(e) => setStr(e.target.value)}
      onBlur={(e) => {
        const str = e.target.value;
        let val = 0;
        if (str !== '') {
          val =
            str.indexOf('%') > 0
              ? parseFloat(str) / 100 > 1
                ? 1
                : parseFloat(str) / 100
              : parseFloat(str);
        }
        setStr(convertToStr(val));
        setValue(val);
      }}
    />
  ) : (
    <span>{convertToStr(value || 0)}</span>
  );
};

export default NumberWithPercentageInput;
