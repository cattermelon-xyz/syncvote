import React, { useState } from 'react';
import { Input, Tag, Space, Button, Popover } from 'antd';
import {
  SortAscendingOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';

interface GridColumnProps {
  xs?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}

interface Props {
  items: React.ReactNode[];
  columns: GridColumnProps;
  title?: string;
}

const ListItem: React.FC<Props> = ({ items, columns, title }) => {
  let classes = `w-full grid gap-4 grid-row-gap-10`;

  if (columns.xs) classes += `xs:grid-cols-${columns.xs} `;
  if (columns.md) classes += `md:grid-cols-${columns.md} `;
  if (columns.lg) classes += `lg:grid-cols-${columns.lg} `;
  if (columns.xl) classes += `xl:grid-cols-${columns.xl} `;
  if (columns['2xl']) classes += `2xl:grid-cols-${columns['2xl']} `;

  const options = ['Name', 'Last created', 'Last modified'];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const content = (
    <Space direction='vertical' size='middle' className='w-56'>
      <div className='flex justify-between w-full'>
        <p>Sort by</p>
        <ArrowDownOutlined />
      </div>
      {options.map((option, index) => (
        <div
          key={index}
          className={`w-full select-none rounded-3xl cursor-pointer ${
            selectedOption === option
              ? 'border text-violet-500 border-violet-500'
              : ''
          }`}
          onClick={() => setSelectedOption(option)}
        >
          {option}
        </div>
      ))}
    </Space>
  );

  return (
    <>
      <div className='flex justify-between mb-4 '>
        <p>{title}</p>
        <Popover content={content} trigger='click' placement='rightTop'>
          <Button
            style={{ border: 'None', padding: '5px' }}
            className='w-[44px] bg-[#F6F6F6]'
          >
            <SortAscendingOutlined
              style={{ fontSize: '20px', color: '#6200EE' }}
            />
          </Button>
        </Popover>
      </div>
      <div className={classes.trim()}>
        {items && items.map((item, index) => <div key={index}>{item}</div>)}
      </div>
    </>
  );
};

export default React.memo(ListItem);
