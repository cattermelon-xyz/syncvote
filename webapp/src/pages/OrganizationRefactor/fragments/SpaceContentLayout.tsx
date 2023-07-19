import React, { ReactNode } from 'react';
interface Props {
  children: ReactNode;
}

const SpaceContentLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className='flex w-full justify-center overflow-y-scroll my-8'>
      {/* <div className='w-full md:w-3/4 lg:w-2/3 xl:w-4/5 py-4 h-fit '> */}
      {children}
      {/* </div> */}
    </div>
  );
};

export default React.memo(SpaceContentLayout);