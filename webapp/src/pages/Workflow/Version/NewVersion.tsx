import { useEffect, useState } from 'react';
import {
  Button, Input, Select, Space, Modal,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createIdString, extractIdFromIdString, shouldUseCachedData } from '@utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { queryWorkflow, upsertWorkflowVersion } from '@middleware/data';
import { DirectedGraph, emptyStage } from '@components/DirectedGraph';
import { SaveOutlined } from '@ant-design/icons';
// TODO: forbid special character
export const NewVersion = () => {
  const [versionToCopy, setVersionToCopy] = useState(-1);
  const [workflow, setWorkflow] = useState<any>({});
  const { orgIdString, workflowIdString } = useParams();
  const workflowId = extractIdFromIdString(workflowIdString);
  const orgId = extractIdFromIdString(orgIdString);
  const { lastFetch, workflows } = useSelector((state:any) => state.workflow);
  const dispatch = useDispatch();
  const [screen, setScreen] = useState('chooseVersion');
  const [versionTitle, setVersionTitle] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (!shouldUseCachedData(lastFetch)) {
      queryWorkflow({
        orgId,
        dispatch,
        onLoad: (data) => {
          setWorkflow(data.find((w:any) => w.id === workflowId));
        },
      });
    } else {
      setWorkflow(workflows.find((w:any) => w.id === workflowId));
    }
  }, []);
  let options = workflow?.workflow_version?.map((w:any) => ({
    label: w.version,
    value: w.id,
  }));
  if (!options) {
    options = [];
  }
  options.push({
    label: 'None',
    value: -1,
  });
  const currentVersion =
    workflow?.workflow_version?.find((w:any) => w.id === versionToCopy)?.data || emptyStage;
  const handleCreateNew = async () => {
    if (versionTitle === '') {
      Modal.error({
        title: 'Error',
        content: 'Please enter a version title',
      });
      return;
    }
    const versionToSave = {
      workflowId,
      versionId: -1,
      version: versionTitle,
      status: 'DRAFT',
      versionData: currentVersion,
      recommended: false,
    };
    await upsertWorkflowVersion({
      dispatch,
      workflowVersion: versionToSave,
      onSuccess: (data:any) => {
        const versionIdString = createIdString(data[0].version, data[0].id);
        navigate(`/${orgIdString}/${workflowIdString}/${versionIdString}`);
        Modal.success({
          maskClosable: true,
          content: 'Data saved successfully',
        });
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: error.message,
        });
      },
      mode: undefined,
    });
  };
  return (
    <Space direction="vertical" size="large" className="container my-8">
      <h1>Create a new Version</h1>
      <Space direction="horizontal" className="flex justify-between">
        <span>Version to clone</span>
        <Select
          options={options}
          onChange={(value) => setVersionToCopy(value)}
          style={{ minWidth: '200px' }}
          className="w-full"
          disabled={screen !== 'chooseVersion'}
        />
      </Space>
      {screen === 'chooseVersion' ?
      (
        <>
          <div className={`w-full border-2  ${versionToCopy === -1 ? 'hidden' : ''}`} style={{ height: '300px' }}>
            <DirectedGraph
              data={currentVersion}
              editable={false}
            />
          </div>
          <Space direction="horizontal" className="w-full flex justify-between">
            <Button type="default" disabled>
              Back
            </Button>
            <Button type="default" onClick={() => { setScreen('metadata'); }}>
              Next
            </Button>
          </Space>
        </>
      )
      :
      (
        <>
          <Space direction="vertical" size="small" className="w-full">
            <span>Version title</span>
            <Input placeholder="Version title" className="w-full" value={versionTitle} onChange={(e) => setVersionTitle(e.target.value)} />
          </Space>
          <Space direction="horizontal" className="w-full flex justify-between mt-4">
            <Button type="default" onClick={() => { setScreen('chooseVersion'); }}>
              Back
            </Button>
            <Button
              type="default"
              icon={<SaveOutlined />}
              onClick={handleCreateNew}
            >
              Create New
            </Button>
          </Space>
        </>
      )
      }
    </Space>
  );
};
