import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@components/Button/Button';
import { PlusOutlined } from '@ant-design/icons';
import { Input, Modal, Space } from 'antd';
import Icon from '@components/Icon/Icon';
import { supabase } from '@utils/supabaseClient';
import { useDispatch } from 'react-redux';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';
import { changeWorkflow } from '@redux/reducers/workflow.reducer';
import { extractIdFromIdString } from '@utils/helpers';
import { emptyStage } from '@components/DirectedGraph';

const env = import.meta.env.VITE_EVN;

const ChooseTemplate = () => {
  // document.title = 'Create new Workflow';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orgIdString } = useParams();
  const orgId = extractIdFromIdString(orgIdString);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const handleNavigate = () => {
  };
  // TODO: use utils/data in here
  const handleSave = async () => {
    dispatch(startLoading({}));
    let icon_url, preset_icon_url; // eslint-disable-line
    if (iconUrl.startsWith('preset:')) {
      preset_icon_url = iconUrl.replace('preset:', ''); // eslint-disable-line
    } else {
      icon_url = iconUrl; // eslint-disable-line
    }
    const { data, error } = await supabase
      .from('workflow')
      .insert({
        title, desc, icon_url, preset_icon_url, owner_org_id: orgId,
      }).select();
    if (data) {
      const insertedId = data[0].id;
      const toInsert = {
        workflow_id: insertedId,
        status: 'DRAFT',
        data: emptyStage,
      };
      const { data: versions, error: err } = await supabase
      .from('workflow_version')
      .insert(toInsert).select();
      dispatch(finishLoading({}));
      dispatch(changeWorkflow({
        id: insertedId, title, desc, icon_url: iconUrl, banner_url: '', owner_org_id: orgId, workflow_version: !err ? versions : [],
      }));
      if (!error && versions) navigate(`/${orgIdString}/${insertedId}/${versions[0].id}`);
    }
    if (error) {
      Modal.error({ content: error.message });
    }
  };
  return (
    <div className="container w-full flex justify-center">
      {env === 'dev' ?
        (
          <Space direction="vertical" className="lg:w-2/3 md:w-full mt-8" size="large">
            <Space direction="vertical">
              <h1 className="">Add basic Info</h1>
            </Space>
            <Icon
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
            <Space direction="vertical" size="small" className="w-full">
              <div>Workflow name</div>
              <Input
                className="w-full"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="Workflow name"
              />
            </Space>
            <Space direction="vertical" size="small" className="w-full">
              <div>Description</div>
              <Input.TextArea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full h-[300px] border border-primary_logo rounded-lg p-4"
                placeholder="Description"
              />
            </Space>
            <Space direction="horizontal" className="flex justify-end">
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
        )
        :
        (
          <div className="w-2/3 flex flex-col gap-8 items-center mt-[5%]">
            <p className="text-[#252422] text-[28px] font-semibold">
              Build
              <span className="text-violet-version-5"> workflow </span>
              with template
            </p>
            <div className="flex flex-col gap-8 my-2 w-full border rounded-lg p-6 text-[#575655]">
              <div className="flex justify-between items-center">
                <p className="text-[17px] truncate">
                  Investment deals evaluation process for Investmen...
                </p>
                <p className="text-[13px]">Created on January 1st, 2023</p>
              </div>
              <div className="border-b border-primary_logo w-full" />
              <div className="flex justify-between">
                <p className="text-[17px]">DAO contributors recruitment process</p>
                <p className="text-[13px]">Created on Dec 12th, 2022</p>
              </div>
              <div className="border-b border-primary_logo w-full" />
              <div className="flex justify-between">
                <p className="text-[17px]">Procurement competitive bidding process</p>
                <p className="text-[13px]">Created on Dec 8th, 2022</p>
              </div>
              {/* <Link to={`/${PAGE_ROUTES.VIEW_BLUEPRINT_TEMPLATES}`}> */}

              <div
                className="text-center text-violet-version-5 text-[17px] cursor-pointer"
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
        )
      }
    </div>
  );
};

export default ChooseTemplate;
