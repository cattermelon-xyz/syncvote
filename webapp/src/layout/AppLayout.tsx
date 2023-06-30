import { useNavigate } from 'react-router-dom';
import Header from './fragments/Header';
import { AuthContext } from '@layout/context/AuthContext';

type Props = {
  children?: JSX.Element;
};

const AppLayout = ({ children }: Props): JSX.Element => {
  return (
    <>
      <AuthContext.Consumer>
        {({ session }) => (
          <div className="w-full bg-slate-100 h-screen">
            <Header session={session} />
            <div
              className={`w-full flex justify-center`}
              style={{ height: 'calc(100% - 80px)' }}
            >
              {children}
            </div>
          </div>
        )}
      </AuthContext.Consumer>
    </>
  );
};

export default AppLayout;
