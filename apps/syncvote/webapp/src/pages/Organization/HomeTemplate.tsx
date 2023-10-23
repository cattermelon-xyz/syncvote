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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const dataTemplates = useGetDataHook({
    configInfo: config.queryTemplate,
  }).data;

  useEffect(() => {
    if (dataTemplates) {
      setTemplates(dataTemplates);
    }
  }, [dataTemplates]);


  const filterTemplates = () => {
    if (selectedTags.length === 0) return templates;

    return templates.filter((template: any) => {
      return selectedTags.every((tag) => 
        template.tags?.some((templateTag: any) => templateTag.label === tag)
      );
    });
  };

  return (
    <div className='w-[800px] flex flex-col gap-y-14'>
      <section className='w-full'>
        <Title level={2} className='text-center'>
          {L('DAO management workflow templates')}
        </Title>
        <SearchWithTag
          tagTo={TagObject.TEMPLATE}
          onResult={(result: any) => {
            setTemplates(result);
          }}
          onSelectedTagsChange={(tags: string[]) => setSelectedTags(tags)}  // Added this line
        />
        <>
          {templates && (
            <TemplateList
              templates={filterTemplates().filter((tmpl: any) => tmpl.status === true)}  // Used filterTemplates here
            />
          )}
        </>
      </section>
    </div>
  );
};

export default React.memo(HomeTemplate);
