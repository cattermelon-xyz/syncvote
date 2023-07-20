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

const siderPaths = ['/', '/my-workspaces', '/shared-workspaces'];
const isSiderPath = (pathname: string) => {
  if (siderPaths.includes(pathname)) {
    return true;
  }
  const orgIdPathRegex = /^\/[^/]+$/; // Matches paths like /:orgIdString
  return orgIdPathRegex.test(pathname);
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
            <Layout className='w-full overflow-y-auto'>
              {isSiderPath(location.pathname) && (
                <Layout.Sider
                  theme='light'
                  className='overflow-auto border-r pr-5'
                  width={269}
                >
                  <VerticalNav />
                </Layout.Sider>
              )}
              <Layout
                className={clsx(
                  'flex w-full items-center ',
                  { 'h-fixed-layout': !isSiderPath(location.pathname) },
                  {
                    'my-8 min-h-[83vh]': isSiderPath(location.pathname),
                  }
                )}
              >
                {children}
              </Layout>
            </Layout>
            {isSiderPath(location.pathname) && (
              <div className='w-full'>
                <Footer />
              </div>
            )}
          </Layout>
        )}
      </AuthContext.Consumer>
    </>
  );
};

export default WebLayout;
