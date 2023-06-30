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
          <div className="w-full">
            <div className="fixed top-0 left-0 w-full">
              <Header session={session} />
            </div>
            <div className={`w-full flex justify-center mt-20`}>{children}</div>
          </div>
        )}
      </AuthContext.Consumer>
    </>
  );
};

export default WebLayout;
