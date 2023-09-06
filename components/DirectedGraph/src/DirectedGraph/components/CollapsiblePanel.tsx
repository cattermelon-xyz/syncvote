import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useState } from 'react';

type CollapsiblePanelProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  bodyStyle?: React.CSSProperties;
  collapsable?: boolean;
};

const CollapsiblePanel = ({
  title,
  children,
  className = '',
  bodyStyle = {},
  collapsable = true,
  ...props
}: CollapsiblePanelProps) => {
  const [open, setOpen] = useState(collapsable);
  return (
    <div className={`py-4 px-4 bg-white rounded-lg w-full ${className}`}>
      <div className='w-full flex items-center justify-between'>
        <div className='font-bold text-lg select-none'>{title}</div>
        <div
          className={`cursor-pointer select-none ${
            collapsable ? '' : 'hidden'
          }`}
          onClick={() => setOpen(!open)}
        >
          {open ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>
      <div
        style={bodyStyle}
        className={`w-full mt-4 ${
          !collapsable ? null : !open ? 'hidden' : null
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsiblePanel;
