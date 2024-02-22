import { Checkbox, Divider, Modal } from 'antd';
import versions from './versions';
import { useState } from 'react';

const NewFeatureDialog = () => {
  const lastSeenVersion = localStorage.getItem('lastSeenVersion') || 0;
  const [display, setDisplay] = useState(lastSeenVersion !== versions[0].id);
  const [seeNotAgain, setNotAgain] = useState(true);
  return (
    <Modal
      title="What's new?"
      open={display}
      onCancel={() => {
        setDisplay(false);
        if (seeNotAgain) {
          localStorage.setItem('lastSeenVersion', versions[0].id);
        }
      }}
      closeIcon={<></>}
      footer={
        <div
          onClick={() => {
            setNotAgain(!seeNotAgain);
          }}
          className='text-gray-400 cursor-pointer'
        >
          <Checkbox checked={seeNotAgain} className='mr-2' /> Don't show this
          again
        </div>
      }
      width={600}
    >
      <div className='overflow-y-scroll max-h-64'>
        {versions
          .filter((v) => v.id > lastSeenVersion)
          .map((version, key) => {
            return (
              <div key={key} className='my-2'>
                <h4>
                  <span className='mr-2'>v-[{version.id}]</span>
                  {version.title}
                </h4>
                <p className='text-gray-500'>{version.date}</p>
                <Divider className='my-1' />
                <p className='text-gray-600 my-2'>{version.description}</p>
                {version.items.length > 0 && (
                  <ul className='ml-4'>
                    {version.items.map((item, key) => {
                      return <li key={key}>{item}</li>;
                    })}
                  </ul>
                )}
              </div>
            );
          })}
      </div>
    </Modal>
  );
};

export default NewFeatureDialog;
