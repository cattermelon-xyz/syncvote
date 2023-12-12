import NotFound404 from '@pages/NotFound404';
import { Button } from 'antd';

const PermissionDeniedEdit = ({
  navigate,
  orgIdString,
  workflowIdString,
  versionIdString,
}: {
  navigate: any;
  orgIdString: string | undefined;
  workflowIdString: string | undefined;
  versionIdString: string | undefined;
}) => {
  return (
    <NotFound404
      title='Permission denied'
      message={
        <div className='w-full text-center'>
          <p>
            Sorry, you don not have permission to{' '}
            <span className='text-violet-500'>EDIT</span> this workflow.
          </p>
          <div>Click here to open the view mode</div>
        </div>
      }
      cta={
        <Button
          type='primary'
          onClick={() =>
            navigate(
              `/public/${orgIdString}/${workflowIdString}/${versionIdString}`
            )
          }
        >
          Open in View
        </Button>
      }
    />
  );
};

export default PermissionDeniedEdit;
