import { useEffect, useState } from 'react';
import { Card, Button, Empty } from 'antd';
import parse from 'html-react-parser';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface Props {
  titleDescription: string;
  description: string;
  bgColor?: string;
  isAppendDocInput?: boolean;
}

const ShowDescription: React.FC<Props> = ({
  titleDescription,
  description,
  isAppendDocInput,
  bgColor,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className={`p-3 ${bgColor}`}>
      <div className='flex flex-col gap-6'>
        {isAppendDocInput ? (
          <></>
        ) : (
          <div className='flex justify-between'>
            <p className='text-xl font-medium'>{titleDescription}</p>
            {isExpanded ? (
              <DownOutlined onClick={() => setIsExpanded(false)} />
            ) : (
              <UpOutlined onClick={() => setIsExpanded(true)} />
            )}
          </div>
        )}

        {description && isExpanded && (
          <div className={`${isExpanded ? '' : 'max-h-[100px] truncate ...'}`}>
            {parse(description)}
          </div>
        )}
        {!description && isExpanded && (
          <div className='flex justify-center items-center w-full h-[100px]'>
            <Empty />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ShowDescription;
