import React from 'react';

type Props = {
  children?: JSX.Element;
  isFullHeight? : boolean,
};

const MainLayout = ({ children, isFullHeight = false }: Props) => {
  return (
    <div
      className={`w-full flex justify-center ${isFullHeight ? '' : 'mt-20'}`}
      style={isFullHeight ? { height: 'calc(100% - 80px)' } : {}}
    >
      {children}
    </div>
  );
};

export default MainLayout;
