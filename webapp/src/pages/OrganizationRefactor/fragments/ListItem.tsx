import React from 'react';
import SortButton from '@components/SortButton/SortButton';

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

  return (
    <>
      <div className='flex justify-between mb-4 '>
        <p>{title}</p>
        <SortButton />
      </div>
      <div className={classes.trim()}>
        {items && items.map((item, index) => <div key={index}>{item}</div>)}
      </div>
    </>
  );
};

export default React.memo(ListItem);
