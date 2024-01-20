import { Tag } from 'antd';

export const StatusTag = ({
  children,
  color,
  className,
}: {
  children: any;
  color: any;
  className?: string;
}) => {
  let tagClass = 'bg-gray-200';
  switch (color) {
    case 'default':
      tagClass = 'border-0';
      break;
    case 'active':
      tagClass = 'text-[#1D713E] bg-[#EAF6EE] border-[#1D713E] border-0';
      break;
    case 'active-border':
      tagClass = 'text-[#1D713E] bg-[#EAF6EE] border-[#1D713E] border-1';
      break;
  }
  tagClass += ' rounded-xl ' + className;
  return <Tag className={tagClass}>{children}</Tag>;
};
