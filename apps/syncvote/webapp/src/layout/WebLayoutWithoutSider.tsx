import Header from './fragments/Header';
import { AuthContext } from '@layout/context/AuthContext';
import { Layout, Space } from 'antd';
import VerticalNav from './fragments/VerticalNav';
import Footer from './fragments/Footer';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

type Props = {
  children?: JSX.Element;
};

const WebLayoutWithoutSider = ({ children }: Props) => {
  const location = useLocation();

  return (
    <>
      <AuthContext.Consumer>
        {({ session }) => (
          <Layout className='w-full'>
            <div className='w-full z-50 bg-white'>
              <Header session={session} />
            </div>
            <Layout className='w-full overflow-y-auto bg-white'>
              <Layout className='flex w-full items-center bg-white h-fixed-layout'>
                {children}
              </Layout>
            </Layout>
          </Layout>
        )}
      </AuthContext.Consumer>
    </>
  );
};

export default WebLayoutWithoutSider;
