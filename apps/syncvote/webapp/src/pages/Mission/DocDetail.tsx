import { queryWorkflowVersion } from '@dal/data';
import { Collapse, Space } from 'antd';
import { Icon } from 'icon';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { extractIdFromIdString } from 'utils';
import parse from 'html-react-parser';
import { FileTextOutlined } from '@ant-design/icons';

const DocDetail = () => {
  const { orgIdString, workflowIdString, versionIdString, docId } = useParams();
  const orgId = extractIdFromIdString(orgIdString);
  const workflowId = extractIdFromIdString(workflowIdString);
  const versionId = extractIdFromIdString(versionIdString);
  const dispatch = useDispatch();
  const [workflow, setWorkflow] = useState<any>({});
  const [version, setVersion] = useState<any>({});
  const [doc, setDoc] = useState<any>({});
  useEffect(() => {
    queryWorkflowVersion({
      orgId,
      versionId,
      workflowId,
      dispatch,
      onLoad: (worflow: any) => {
        setWorkflow(worflow[0]);
        setVersion(worflow[0]?.workflow_version[0]);
        setDoc(
          worflow[0]?.workflow_version[0].data.docs.find(
            (doc: any) => doc.id === docId
          ) || {}
        );
      },
    });
  }, []);
  console.log(version?.data?.docs);
  return (
    <Space
      direction='vertical'
      className='w-[800px] flex flex-col gap-y-14'
      size='large'
    >
      <Space direction='horizontal' size='small'>
        <Icon size='medium' iconUrl={workflow?.icon_url} presetIcon={[]} />
        {workflow?.title}
      </Space>
      <div className='text-lg font-bold'>{doc?.title}</div>
      <div>{parse(doc.description || '')}</div>
      <Collapse
        items={[
          {
            label: (
              <div>
                <FileTextOutlined /> Template content
              </div>
            ),
            key: '1',
            children: <div>{parse(doc.template || '')}</div>,
          },
        ]}
      />
    </Space>
  );
};

export default DocDetail;
