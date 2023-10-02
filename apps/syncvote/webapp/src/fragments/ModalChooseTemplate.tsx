import Icon from '@ant-design/icons';
import { config } from '@dal/config';
import { Modal, Radio, RadioChangeEvent, Space } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { extractIdFromIdString, useGetDataHook } from 'utils';

export const ModalChooseTemplate = ({
  open = false,
  onCancel,
  onOk,
}: {
  open: boolean;
  onCancel: () => void;
  onOk: (data: any) => void;
}) => {
  const { orgIdString } = useParams();
  const orgId = extractIdFromIdString(orgIdString);

  const templates = useGetDataHook({
    configInfo: config.queryTemplate,
  }).data;

  const templatesToChoose = templates.filter(
    (template: any) => template.owner_org_id === orgId
  );

  const [value, setValue] = useState(null);
  const [hovered, setHovered] = useState(null);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  return (
    <>
      <Modal
        title={'Choose template to replace'}
        open={open}
        onOk={() => {
          setValue(null);
          setHovered(null);

          const template = templates.find(
            (template: any) => template.id === value
          );
          onOk({ ...template });
        }}
        onCancel={() => {
          onCancel();
          setValue(null);
          setHovered(null);
        }}
        className='create-new'
      >
        <Space className='w-full overflow-scroll h-48' direction='vertical'>
          <div>
            <Radio.Group onChange={onChange} value={value} className='w-full'>
              {templatesToChoose &&
                templatesToChoose.map((template: any, index: any) => (
                  <div
                    className='flex h-12 items-center radio cursor-pointer select-none'
                    key={index}
                    style={{
                      backgroundColor: template.id === value ? '#f6f6f6' : '',
                    }}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      if (value) {
                        if (value === template?.id) {
                          setValue(null);
                        } else {
                          setValue(template?.id);
                        }
                      } else {
                        setValue(template?.id);
                      }
                    }}
                  >
                    {hovered === index || template.id === value ? (
                      <Space className='p-3'>
                        <Radio value={template.id} className='w-6 h-6' />
                        <div className='text-base'>{template?.title}</div>
                      </Space>
                    ) : (
                      <Space className='p-3'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z'
                            stroke='#252422'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M2 12H22'
                            stroke='#252422'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z'
                            stroke='#252422'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <div className='ml-2 text-base'>{template?.title}</div>
                      </Space>
                    )}
                  </div>
                ))}
            </Radio.Group>
          </div>
        </Space>
      </Modal>
    </>
  );
};
