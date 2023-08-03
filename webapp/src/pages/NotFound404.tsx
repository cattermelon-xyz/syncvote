import { Button, Result } from 'antd';

const NotFound404 = () => {
  return (
    <div className='w-full pt-10'>
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
        extra={
          <Button
            type='primary'
            onClick={() => window.open(import.meta.env.VITE_BASE_URL, '_self')}
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFound404;
