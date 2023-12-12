import NotFound404 from '@pages/NotFound404';

const PermissionDeniedToView = () => {
  return (
    <div>
      <NotFound404
        title='Permission denied'
        message={
          <div className='w-full text-center'>
            <p>
              Sorry, you don not have permission to access to this workflow.
            </p>
            <p>
              Ask the owner to publish this workflow or add you as a workspace
              editor.
            </p>
          </div>
        }
      />
    </div>
  );
};

export default PermissionDeniedToView;
