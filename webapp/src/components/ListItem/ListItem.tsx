import React, { useState } from 'react';
import { Input, Tag, Space, Button, Popover } from 'antd';
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';

interface GridColumnProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}

interface Props {
  items: React.ReactNode[];
  columns: GridColumnProps;
  title?: string;
  handleSort?: (options: { by: any; type: any }) => void;
}

const ListItem: React.FC<Props> = ({ items, columns, title, handleSort }) => {
  const [typeSort, setTypeSort] = useState('asc');
  const [selectedOption, setSelectedOption] = useState('');
  const options = ['Name', 'Last created', 'Last modified'];

  const changeTypeSort = () => {
    setTypeSort(typeSort === 'asc' ? 'des' : 'asc');
  };
  const content = (
    <Space direction='vertical' size='middle' className='w-56'>
      <div
        className='flex justify-between w-full cursor-pointer'
        onClick={changeTypeSort}
      >
        <p>Sort by</p>
        {typeSort === 'asc' ? (
          <ArrowDownOutlined style={{ fontSize: '20px', color: '#6200EE' }} />
        ) : (
          <ArrowUpOutlined style={{ fontSize: '20px', color: '#6200EE' }} />
        )}
      </div>
      {options.map((option, index) => (
        <div
          key={index}
          className={`w-full select-none rounded-3xl cursor-pointer hover:text-violet-500 ${
            selectedOption === option ? 'text-violet-500' : ''
          }`}
          onClick={() => {
            setSelectedOption(option);
            handleSort && handleSort({ by: option, type: typeSort });
          }}
        >
          {option}
        </div>
      ))}
    </Space>
  );

  return (
    <>
      <div className='flex justify-between items-center mb-4 '>
        <div className='text-md font-semibold'>{title}</div>
        <Popover content={content} trigger='click' placement='rightTop'>
          <Button
            style={{ border: 'None', padding: '5px' }}
            className='w-[44px] bg-[#F6F6F6]'
          >
            {typeSort === 'asc' ? (
              <SortAscendingOutlined
                style={{ fontSize: '20px', color: '#6200EE' }}
              />
            ) : (
              <SortDescendingOutlined
                style={{ fontSize: '20px', color: '#6200EE' }}
              />
            )}
          </Button>
        </Popover>
      </div>
      <div
        className={`w-full grid gap-4 ${
          columns.xs ? `xs:grid-cols-${columns.xs}` : ''
        } ${columns.sm ? `sm:grid-cols-${columns.sm}` : ''} ${
          columns.md ? `md:grid-cols-${columns.md}` : ''
        } ${columns.lg ? `lg:grid-cols-${columns.lg}` : ''} ${
          columns.xl ? `xl:grid-cols-${columns.xl}` : ''
        } ${columns['2xl'] ? `2xl:grid-cols-${columns['2xl']}` : ''}`}
      >
        {items && items.map((item, index) => <div key={index}>{item}</div>)}
      </div>
    </>
  );
};

export default React.memo(ListItem);
