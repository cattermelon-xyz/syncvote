import Header from './fragments/Header';
import { AuthContext } from '@layout/context/AuthContext';
import { Layout, Space } from 'antd';
import VerticalNav from './fragments/VerticalNav';
import Footer from './fragments/Footer';

type Props = {
  children?: JSX.Element;
};

const WebLayout = ({ children }: Props) => {
  return (
    <>
      <AuthContext.Consumer>
        {({ session }) => (
          <Layout className='w-full'>
            <div className='w-full z-50 bg-white'>
              <Header session={session} />
            </div>
            <Layout className='w-full overflow-y-auto'>
              <Layout.Sider
                theme='light'
                className='overflow-auto border-r pr-5'
                width={269}
              >
                <VerticalNav />
              </Layout.Sider>
              <Layout className='flex w-full justify-center items-center my-8'>
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
