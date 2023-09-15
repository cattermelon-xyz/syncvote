import { useEffect, useState } from 'react';
import { Modal, Space, Select, Input, SelectProps } from 'antd';
import { newTag } from '@dal/data/tag';
import { useGetDataHook, useSetData } from 'utils';
import { config } from '@dal/config';
import { ITag } from '@types';
import { useDispatch } from 'react-redux';
import { ITemplate } from '@dal/redux/reducers/template.reducer/interface';

type AddAndRemoveTagProps = {
  templateId?: number;
};

const AddAndRemoveTag = ({ templateId = -1 }: AddAndRemoveTagProps) => {
  const dispatch = useDispatch();
  const tags: ITag[] = useGetDataHook({
    configInfo: config.queryTag,
    cacheOption: false,
  }).data;

  const dataTemplates = useGetDataHook({
    configInfo: config.queryTemplate,
  }).data;

  const [template, setTemplate] = useState<ITemplate>();
  const optionsTags: SelectProps['options'] = tags;
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
  };

  return (
    <Space direction='vertical' className='w-full'>
      <div>Tags</div>
      <Select
        className='w-full'
        mode='tags'
        options={optionsTags}
        onChange={onChangeTagValue}
        value={existedTags}
        loading={false}
      />
    </Space>
  );
};

export default AddAndRemoveTag;
