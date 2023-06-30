import { useNavigate } from 'react-router-dom';
import Header from './fragments/Header';
import { AuthContext } from '@layout/context/AuthContext';
import PublicHeader from './fragments/PublicHeader';

type Props = {
  children?: JSX.Element;
};

const PublicAppLayout = ({ children }: Props): JSX.Element => {
  return (
    <>
      <AuthContext.Consumer>
        {({ session }) => (
          <div className="w-full bg-slate-100 h-screen">
            <PublicHeader session={session} />
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

export default PublicAppLayout;
