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

const WebLayout = ({ children }: Props) => {
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
              <Layout.Sider
                theme='light'
                className='overflow-hidden pr-5'
                style={{ borderRight: 'solid 1px #E3E3E2' }}
                width={269}
              >
                <VerticalNav />
              </Layout.Sider>
              <Layout className='flex w-full items-center bg-white my-8 min-h-[83vh]'>
                {children}
              </Layout>
            </Layout>
            <div className='w-full'>
              <Footer />
            </div>
          </Layout>
        )}
      </AuthContext.Consumer>
    </>
  );
};

export default WebLayout;
