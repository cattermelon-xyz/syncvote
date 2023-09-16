import { Select, Space } from 'antd';
import type { SelectProps } from 'antd';
import { config } from '@dal/config';
import { ITag } from '@types';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { ITemplate } from '@dal/redux/reducers/template.reducer/interface';
import { newTag } from '@dal/data/tag';
import { useGetDataHook, useSetData } from 'utils';

type AddAndRemoveTagProps = {
  templateId?: number;
  onTagsChange?: (tags: any) => void;
  setOptionTags?: (optionTags: any) => void;
};

const AddAndRemoveTag = ({
  templateId = -1,
  onTagsChange,
  setOptionTags,
}: AddAndRemoveTagProps) => {
  const dispatch = useDispatch();

  const tags: ITag[] = useGetDataHook({
    configInfo: config.queryTag,
    cacheOption: false,
  }).data;

  const dataTemplates = useGetDataHook({
    configInfo: config.queryTemplate,
  }).data;

  const [template, setTemplate] = useState<ITemplate>();
  const options: SelectProps['options'] = tags;
  const [existedTags, setExistedTags] = useState(template?.tags || []);
  const allTags = [...tags];
  existedTags.forEach((tag: any) => {
    tags.findIndex((t) => t.value === tag.value) === -1
      ? allTags.push(tag)
      : '';
  });

  useEffect(() => {
    if (dataTemplates && templateId) {
      setTemplate(
        dataTemplates.find((template: any) => template.id === templateId)
      );
    }
  }, [dataTemplates, templateId]);

  useEffect(() => {
    setExistedTags(template?.tags || []);
  }, [template]);

  const onChangeTagValue = async (tagIds: any[]) => {
    if (templateId === -1) {
      if (onTagsChange && setOptionTags) {
        onTagsChange(tagIds);
        setOptionTags(options);
      }
    } else {
      const newTags: ITag[] = [];
      // setOpen(false);
      tagIds.forEach((tagId) => {
        if (typeof tagId === 'number') {
          const label = allTags.find((tag: any) => tag.value === tagId)?.label;
          if (label) {
            newTags.push({
              value: tagId,
              label,
            });
          }
        }
      });
      if (typeof tagIds[tagIds.length - 1] === 'string') {
        const { data: newTagData } = await newTag({
          dispatch,
          tag: tagIds[tagIds.length - 1],
        });
        if (newTagData) {
          newTags.push(newTagData);
        }
      }

      await useSetData({
        params: { template: template, newTags: newTags },
        configInfo: config.updateATemplateTag,
        dispatch: dispatch,
        onSuccess: () => {
          // setOpen(true);
        },
      });
    }
  };

  return (
    <Space direction='vertical' className='w-full'>
      <div>Tags</div>

      {templateId === -1 ? (
        <Select
          mode='tags'
          style={{ width: '100%' }}
          onChange={onChangeTagValue}
          options={options}
        />
      ) : (
        <Select
          className='w-full'
          mode='tags'
          options={options}
          onChange={onChangeTagValue}
          value={existedTags}
          loading={false}
        />
      )}
    </Space>
  );
};

export default AddAndRemoveTag;
