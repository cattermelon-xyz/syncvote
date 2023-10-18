import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
const { Title } = Typography;
import { L } from '@utils/locales/L';
import TemplateList from '@fragments/TemplateList';
import SearchWithTag from '@fragments/SearchWithTag';
import { TagObject } from '@dal/data/tag';
import { useGetDataHook } from 'utils';
import { config } from '@dal/config';

const HomeTemplate: React.FC = () => {
  const [templates, setTemplates] = useState([]);

  const dataTemplates = useGetDataHook({
    configInfo: config.queryTemplate,
  }).data;

  useEffect(() => {
    if (dataTemplates) {
      setTemplates(dataTemplates);
    }
  }, [dataTemplates]);

  return (
    <div className='w-[800px] flex flex-col gap-y-14'>
      <section className='w-full'>
        <Title level={2} className='text-center'>
          {L('DAO management workflow templates')}
        </Title>
        <p className='text-neutral-400 text-[16px] text-center leading-relaxed'>Don’t know where to start with your DAO? Copy best practices of <br></br> diverse management workflows from proven DAOs.</p>
        <SearchWithTag
          tagTo={TagObject.TEMPLATE}
          onResult={(result: any) => {
            setTemplates(result);
          }}
        />
        <>
          {templates && (
            <TemplateList
              templates={templates.filter((tmpl: any) => tmpl.status === true)}
            />
          )}
        </>
      </section>
    </div>
  );
};

export default React.memo(HomeTemplate);
