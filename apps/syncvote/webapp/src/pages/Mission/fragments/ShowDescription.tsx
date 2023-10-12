import { useEffect, useState } from 'react';
import { Card, Button, Empty } from 'antd';
import parse from 'html-react-parser';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface Props {
  titleDescription: string;
  description: string;
}

const ShowDescription: React.FC<Props> = ({
  titleDescription,
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className='p-3'>
      <div className='flex flex-col gap-6'>
        <div className='flex justify-between'>
          <p className='text-xl font-medium'>{titleDescription}</p>
          {isExpanded ? (
            <DownOutlined onClick={() => setIsExpanded(false)} />
          ) : (
            <UpOutlined onClick={() => setIsExpanded(true)} />
          )}
        </div>
        {description ? (
          <div
            className={`ml-4 ${isExpanded ? '' : 'max-h-[100px] truncate ...'}`}
          >
            {parse(description)}
          </div>
        ) : (
          <div className='flex justify-center items-center w-full h-[100px]'>
            <Empty />
          </div>
        )}
      </div>
      {description ? (
        <p
          className='text-[#6200EE] text-left cursor-pointer mt-3'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'View less' : 'View more'}
        </p>
      ) : (
        <div></div>
      )}
    </Card>
  );
};

export default ShowDescription;
