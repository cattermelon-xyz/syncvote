import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useState } from 'react';

type CollapsiblePanelProps = {
  title: string | JSX.Element;
  children: React.ReactNode;
  className?: string;
  bodyStyle?: React.CSSProperties;
  collapsable?: boolean;
  open?: boolean;
};

const CollapsiblePanel = ({
  title,
  children,
  className = '',
  bodyStyle = {},
  collapsable = true,
  open = true,
}: CollapsiblePanelProps) => {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div
      className={`${
        className ? className : 'p-4 bg-white rounded-lg w-full select-none'
      }`}
    >
      <div className='w-full flex items-center justify-between'>
        {typeof title === 'string' ? (
          <div className='font-bold text-lg select-none'>{title}</div>
        ) : (
          <>{title}</>
        )}

        <div
          className={`cursor-pointer select-none text-sm ${
            collapsable ? '' : 'hidden'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>
      <div
        style={bodyStyle}
        className={`w-full mt-2 ${
          !collapsable ? null : !isOpen ? 'hidden' : null
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsiblePanel;
