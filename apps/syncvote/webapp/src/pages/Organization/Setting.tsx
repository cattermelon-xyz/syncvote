import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BoxPlotOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { deleteWeb2Integration, queryWeb2Integration } from '@middleware/data';
import { useParams } from 'react-router-dom';
import { extractIdFromIdString, shouldUseCachedData } from '@utils/helpers';
import { IWeb2Integration } from '@types';
import Member from './setting/Member';
import Integration from './setting/Integration';
import Role from './setting/Role';

const Setting = () => {
  const dispatch = useDispatch();
  const { orgIdString } = useParams();
  const { web2Integrations, lastFetch } = useSelector((state:any) => state.integration);
  const [integrations, setIntegrations] = useState<IWeb2Integration[]>(web2Integrations);
  useEffect(() => {
    if (!shouldUseCachedData(lastFetch)) {
      queryWeb2Integration({
        orgId: extractIdFromIdString(orgIdString),
        onLoad: (data) => {
          setIntegrations(data);
        },
        dispatch,
      });
    }
  }, [web2Integrations, lastFetch]);
  const tabs = [
    {
      key: 'setting',
      label: (
        <span className="text-black mt-4">
          <h2>Settings</h2>
        </span>
      ),
      children: <div />,
      disabled: true,
    },
    {
      key: 'members',
      label: (
        <span>
          <UserOutlined />
          Members
        </span>
      ),
      children: <Member />,
    },
    {
      key: 'roles',
      label: (
        <span>
          <SafetyOutlined />
          Roles
        </span>
      ),
      children: <Role />,
    },
    {
      key: 'integrations',
      label: (
        <span>
          <BoxPlotOutlined />
          Integrations
        </span>
      ),
      children: <Integration
        integrations={integrations}
        onDelete={(id:string) => {
          deleteWeb2Integration({
            id,
            onLoad: () => {
              const newIntegrations = structuredClone(integrations);
              const index = newIntegrations.findIndex((item) => item.id === id);
              newIntegrations.splice(index, 1);
              setIntegrations(newIntegrations);
            },
            dispatch,
          });
        }}
      />,
    },
  ];
  return (
    <div className="flex flex-col w-full container mx-auto relative min-h-screen">
      <Tabs
        tabPosition="left"
        style={{ height: '100%' }}
        tabBarStyle={{
          borderRight: 'none',
          width: '288px',
        }}
        items={tabs}
        defaultActiveKey="integrations"
      />
    </div>
  );
};

export default Setting;
