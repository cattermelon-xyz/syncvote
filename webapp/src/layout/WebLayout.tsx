import { useNavigate } from 'react-router-dom';
import Header from './fragments/Header';
import { AuthContext } from '@layout/context/AuthContext';

type Props = {
  children?: JSX.Element;
};

const WebLayout = ({ children }: Props) => {
  return (
    <>
      <AuthContext.Consumer>
        {({ session }) => (
          <div className='w-full h-[100vh]'>
            <div className='w-full z-50 bg-white'>
              <Header session={session} />
            </div>
            <div className='w-full h-fixed-layout overflow-y-auto'>
              {children}
            </div>
          </div>
        )}
      </AuthContext.Consumer>
    </>
  );
};

export default WebLayout;
