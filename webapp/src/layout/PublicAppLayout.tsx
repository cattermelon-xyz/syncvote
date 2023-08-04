import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from './fragments/Header';
import { AuthContext } from '@layout/context/AuthContext';
import PublicHeader from './fragments/PublicHeader';

type Props = {
  children?: JSX.Element;
};

const PublicAppLayout = ({ children }: Props): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const diagramFullScreen = searchParams.get('view') === 'full' ? true : false;
  return (
    <>
      <AuthContext.Consumer>
        {({ session }) =>
          !diagramFullScreen ? (
            <div className='w-full bg-slate-100 h-[calc(100dvh)]'>
              <PublicHeader session={session} />
              <div
                className={`w-full flex justify-center`}
                style={{ height: 'calc(100% - 80px)' }}
              >
                {children}
              </div>
            </div>
          ) : (
            <div className='w-full bg-slate-100 h-[calc(100dvh)]'>
              <div
                className={`w-full flex justify-center`}
                style={{ height: 'calc(100% - 0px)' }}
              >
                {children}
              </div>
            </div>
          )
        }
      </AuthContext.Consumer>
    </>
  );
};

export default PublicAppLayout;
