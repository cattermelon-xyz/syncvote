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

const fixedTags = [
  'Governance & Voting',
  'Recruitment',
  'Community Engagement',
  'Budget & Payment',
  'Grants & Investment',
  'Social',
  'Other',
];

const { Option, OptGroup } = Select;

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

  useEffect(() => {
    const fixedTagOptions = fixedTags.map((tag) => ({
      label: tag,
      value: tag,
    }));

    const fixedTagLabels = new Set(fixedTags.map((tag) => tag));

    const uniqueOptions = options.filter(
      (option) =>
        typeof option.label === 'string' && !fixedTagLabels.has(option.label)
    );

    const mergedOptions = [...uniqueOptions, ...fixedTagOptions];

    if (setOptionTags) {
      setOptionTags(mergedOptions);
    }
  }, [options]);

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

      <Select mode='tags' style={{ width: '100%' }} onChange={onChangeTagValue}>
        <OptGroup label='Categories'>
          {fixedTags.map((tag, index) => (
            <Option key={`fixed-${tag}`} value={tag}>
              {tag}
            </Option>
          ))}
        </OptGroup>

        <OptGroup label='Popular Tags'>
          {options.map((option, index) => (
            <Option key={`dynamic-${option.value}`} value={option.value}>
              {option.label}
            </Option>
          ))}
        </OptGroup>
      </Select>
    </Space>
  );
};

export default AddAndRemoveTag;
