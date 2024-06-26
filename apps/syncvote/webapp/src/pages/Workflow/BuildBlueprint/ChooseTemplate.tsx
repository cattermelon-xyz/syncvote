import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@components/Button/Button';
import { PlusOutlined } from '@ant-design/icons';
import { Input, Modal, Space } from 'antd';
import { Icon } from 'icon';
import { useGetDataHook, useSetData } from 'utils';
import { useDispatch } from 'react-redux';
import { extractIdFromIdString } from 'utils';
import { emptyStage } from 'directed-graph';
import { insertWorkflowAndVersion } from '@dal/data';
import { version } from 'os';
import { config } from '@dal/config';

const env = import.meta.env.VITE_ENV;

const ChooseTemplate = () => {
  // document.title = 'Create new Workflow';

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orgIdString } = useParams();
  const orgId = extractIdFromIdString(orgIdString);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const handleNavigate = () => {};

  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  // TODO: use utils/data in here
  const handleSave = async () => {
    // Cannot test because dont have create workflow button
    const props = {
      title,
      desc,
      owner_org_id: orgId,
      emptyStage,
      iconUrl,
      authority: user.id,
    };

    await useSetData({
      onSuccess: (data: any) => {
        const { versions, insertedId } = data;
        navigate(`/${orgIdString}/${insertedId}/${versions[0].id}`);
      },
      onError: (error: any) => {
        Modal.error({ content: error.message });
      },
      params: props,
      configInfo: config.insertWorkflowAndVersion,
      dispatch,
    });
  };
  return (
    <div className='container w-full flex justify-center'>
      {env === 'dev' ? (
        <Space
          direction='vertical'
          className='lg:w-2/3 md:w-full mt-8'
          size='large'
        >
          <Space direction='vertical'>
            <h1 className=''>Add basic Info</h1>
          </Space>
          <Icon
            presetIcon={presetIcons}
            iconUrl={iconUrl}
            editable
            onUpload={(obj) => {
              const { isPreset, filePath } = obj;
              if (isPreset) {
                setIconUrl(`preset:${filePath}`);
              } else {
                setIconUrl(filePath);
              }
            }}
          />
          <Space direction='vertical' size='small' className='w-full'>
            <div>Workflow name</div>
            <Input
              className='w-full'
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder='Workflow name'
            />
          </Space>
          <Space direction='vertical' size='small' className='w-full'>
            <div>Description</div>
            <Input.TextArea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className='w-full h-[300px] border border-primary_logo rounded-lg p-4'
              placeholder='Description'
            />
          </Space>
          <Space direction='horizontal' className='flex justify-end'>
            <Button
              startIcon={<PlusOutlined />}
              onClick={() => {
                handleSave();
              }}
            >
              Create New Workflow
            </Button>
          </Space>
        </Space>
      ) : (
        <div className='w-2/3 flex flex-col gap-8 items-center mt-[5%]'>
          <p className='text-[#252422] text-[28px] font-semibold'>
            Build
            <span className='text-violet-version-5'> workflow </span>
            with template
          </p>
          <div className='flex flex-col gap-8 my-2 w-full border rounded-lg p-6 text-[#575655]'>
            <div className='flex justify-between items-center'>
              <p className='text-[17px] truncate'>
                Investment deals evaluation process for Investmen...
              </p>
              <p className='text-[13px]'>Created on January 1st, 2023</p>
            </div>
            <div className='border-b border-primary_logo w-full' />
            <div className='flex justify-between'>
              <p className='text-[17px]'>
                DAO contributors recruitment process
              </p>
              <p className='text-[13px]'>Created on Dec 12th, 2022</p>
            </div>
            <div className='border-b border-primary_logo w-full' />
            <div className='flex justify-between'>
              <p className='text-[17px]'>
                Procurement competitive bidding process
              </p>
              <p className='text-[13px]'>Created on Dec 8th, 2022</p>
            </div>
            {/* <Link to={`/${PAGE_ROUTES.VIEW_BLUEPRINT_TEMPLATES}`}> */}

            <div
              className='text-center text-violet-version-5 text-[17px] cursor-pointer'
              onClick={handleNavigate}
            >
              View all templates in library
            </div>
            {/* </Link> */}
          </div>
          {/* <Link
              to={`/${PAGE_ROUTES.WORKFLOW.ROOT}/${PAGE_ROUTES.WORKFLOW.SET_NAME}`}
              className="w-full"
            >
              <Button className="w-full text-[17px] py-[18px] font-medium tracking-0.5px">
                Build a new workflow
              </Button>
            </Link> */}
        </div>
      )}
    </div>
  );
};

export default ChooseTemplate;
