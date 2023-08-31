import { Button, Result } from 'antd';
import { ReactNode } from 'react';

const NotFound404 = ({
  title = '404',
  message = 'Sorry, the page you visited does not exist.',
  cta = (
    <Button
      type='primary'
      onClick={() => window.open(import.meta.env.VITE_BASE_URL, '_self')}
    >
      Back Home
    </Button>
  ),
}: {
  title?: ReactNode;
  message?: ReactNode;
  cta?: ReactNode;
}) => {
  return (
    <div className='w-full pt-10'>
      <Result status='404' title={title} subTitle={message} extra={cta} />
    </div>
  );
};

export default NotFound404;
