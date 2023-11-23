import Login from '@pages/Login';
import { getCurrentUser } from '@configs/getCurrentUser';
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    getCurrentUser().then((resp) => {
      if (resp) {
        setUser(resp.user);
      } else {
        console.log('user is not found');
      }
    });
  }, []);

  useEffect(() => {
    console.log('test user', user);
  }, [user]);

  return (
    <div className='w-[260px] h-[380px] pt-[13px] px-3 rounded-xl'>
      {user === null || user === undefined ? <Login /> : <div>Hello world</div>}
    </div>
  );
}

export default App;
