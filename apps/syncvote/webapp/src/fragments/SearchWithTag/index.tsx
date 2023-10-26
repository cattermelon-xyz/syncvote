import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { config } from '@dal/config';
import { TagObject } from '@dal/data/tag';
import { ITag } from '@types';
import { Input, Modal, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useGetDataHook, useSetData } from 'utils';
import { useDispatch } from 'react-redux';
import { ITemplate } from '@dal/redux/reducers/template.reducer/interface';

type SearchWithTagProps = {
  className?: string;
  placeholder?: string;
  tagTo: TagObject;
  onResult: (result: any) => void;
  showSearchTag?: boolean;
  //tags
};

const fixedTags = [
  { value: 'Governance & Voting', count: 0 },
  { value: 'Recruitment', count: 0 },
  { value: 'Community Engagement', count: 0 },
  { value: 'Budget & Payment', count: 0 },
  { value: 'Grants & Investment', count: 0 },
  { value: 'Social', count: 0 },
  { value: 'Other', count: 0 },
];

const SearchWithTag = ({
  className = '',
  placeholder = 'Search ...',
  tagTo = TagObject.TEMPLATE,
  onResult,
  showSearchTag = true,
}: SearchWithTagProps) => {
  const tags = fixedTags.map((tag) => ({
    label: tag.value,
    value: tag.value,
    count_template: tag.count,
  }));

  const dispatch = useDispatch();

  let data: any;
  switch (tagTo) {
    case TagObject.TEMPLATE:
      data = useGetDataHook({
        configInfo: config.queryTemplate,
      }).data;
      break;
    default:
      break;
  }
  const countTags = (data: ITemplate[]) => {
    const tagCounts: { [key: string]: number } = {};

    data.forEach((item: ITemplate) => {
      if (item.tags && Array.isArray(item.tags) && item.status === true) {
        item.tags.forEach((tag) => {
          const tagLabel = tag.label;
          if (tagCounts[tagLabel]) {
            tagCounts[tagLabel]++;
          } else {
            tagCounts[tagLabel] = 1;
          }
        });
      }
    });

    return tagCounts;
  };

  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const tagCounts = data && Array.isArray(data) ? countTags(data) : {};
  const extractCount = (t: any) => {
    switch (tagTo) {
      case TagObject.TEMPLATE:
        return tagCounts[t.label] || 0;
      case TagObject.WORKFLOW:
        return t.count_workflow;
      case TagObject.MISSION:
        return t.count_mission;
      default:
        return t.count_template;
    }
  };

  useEffect(() => {
    if (!inputSearchText && selectedTagIds.length === 0) {
      onResult(data);
    }
  }, [inputSearchText, selectedTagIds, onResult, data]);

  const search = async ({ tags, text }: { tags: any[]; text: string }) => {
    setLoading(true);

    console.log('Incoming tags and text: ', tags, text);

    if (text) {
      // TODO: change to search api
      switch (tagTo) {
        case TagObject.TEMPLATE:
          await useSetData({
            params: {
              inputSearch: text,
            },
            configInfo: config.searchTemplate,
            dispatch,
            onSuccess: (data) => {
              onResult(data);
              setLoading(false);
            },
            onError: () => {
              Modal.error({
                title: 'Error',
                content: 'Search failed',
              });
            },
          });
          break;

        case TagObject.ORGANIZATION: // New case for organization
          await useSetData({
            params: {
              inputSearch: text,
            },
            configInfo: config.querySearchOrgForExplore,
            dispatch,
            onSuccess: (data) => {
              onResult(data);
              setLoading(false);
            },
            onError: () => {
              Modal.error({
                title: 'Error',
                content: 'Search failed',
              });
            },
          });
          break;
        default:
          break;
      }
    } else {
      console.log('Data before filter: ', data);
      let result;
      switch (tagTo) {
        case TagObject.TEMPLATE:
          result = data.filter((item: ITemplate) => {
            console.log("Item's tags: ", item.tags);
            return (
              item.status === true &&
              tags.every((tag) =>
                item.tags?.map((tagItem) => tagItem.label).includes(tag)
              )
            );
          });
          break;
        default:
          break;
      }
      console.log('Result after filter: ', result);
      onResult(result);
    }
    setLoading(false);
  };

  return (
    <Space className={`flex w-full my-8 ${className}`} direction='vertical'>
      <Input
        prefix={<SearchOutlined />}
        suffix={loading ? <LoadingOutlined /> : null}
        placeholder={placeholder}
        className='flex mb-2 w-full'
        value={inputSearchText}
        onChange={(e) => {
          setInputSearchText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            search({ tags: selectedTagIds, text: inputSearchText });
          }
        }}
        onBlur={() => {
          if (inputSearchText && inputSearchText !== toSearch) {
            setSelectedTagIds([]);
            setToSearch(inputSearchText);
            search({ tags: [], text: inputSearchText });
          }
        }}
      />
      {showSearchTag && (
        <div className='flex flex-wrap'>
          {tags.map((tag: any) => {
            const tagCount = extractCount(tag);
            if (tagCount > 0) {
              return (
                <Tag
                  className={`inline cursor-pointer hover:bg-violet-500 hover:text-white py-1 px-2 rounded-full mb-3 ${
                    selectedTagIds.indexOf(tag.value) !== -1
                      ? 'bg-violet-500 text-white'
                      : ''
                  }`}
                  onClick={() => {
                    const newselectedTagIds = [...selectedTagIds];
                    const idx = selectedTagIds.indexOf(tag.value);
                    if (idx !== -1) {
                      newselectedTagIds.splice(idx, 1);
                    } else {
                      newselectedTagIds.push(tag.value);
                    }
                    setSelectedTagIds(newselectedTagIds);
                    setInputSearchText('');
                    search({ tags: newselectedTagIds, text: '' });
                  }}
                  key={tag.value}
                >
                  {tag.label} ({tagCount})
                </Tag>
              );
            }
            return null;
          })}
        </div>
      )}
    </Space>
  );
};

export default SearchWithTag;
