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
  onSelectedTagsChange?: (selectedTags: string[]) => void;
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

const calculateTagCounts = (data: any[]) => {
  const updatedTags = [...fixedTags];
  updatedTags.forEach((tag) => {
    tag.count = data.filter((item) =>
      item.tags?.some((itemTag: any) => itemTag.label === tag.value)
    ).length;
  });
  return updatedTags;
};

const SearchWithTag = ({
  className = '',
  placeholder = 'Search ...',
  tagTo = TagObject.TEMPLATE,
  onResult,
  showSearchTag = true,
  onSelectedTagsChange, 
}: SearchWithTagProps) => {
  const tags: ITag[] = useGetDataHook({
    params: { tagTo: tagTo },
    configInfo: config.queryTag,
  }).data;

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

  const updatedTags = calculateTagCounts(data);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [loading, setLoading] = useState(false);
  
  const extractCount = (t: any) => {
    switch (tagTo) {
      case TagObject.TEMPLATE:
        return t.count_template;
      case TagObject.WORKFLOW:
        return t.count_workflow;
      case TagObject.MISSION:
        return t.count_mission;
      default:
        return t.count_template;
    }
  };

  useEffect(() => {
    if (onSelectedTagsChange) {
      onSelectedTagsChange(selectedTagIds);
    }
  }, [selectedTagIds, onSelectedTagsChange]);


  useEffect(() => {
    if (!inputSearchText && selectedTagIds.length === 0) {
      onResult(data);
    }
  }, [inputSearchText, selectedTagIds, onResult, data]);

  const search = async ({ tags, text }: { tags: any[]; text: string }) => {
    setLoading(true);
    
    const searchParams = {
      inputSearch: text,
      tags,  // Add tags here
    };

    console.log("searchParams", searchParams)
  
    if (text || tags.length > 0) {  // Modified to also trigger when tags are selected
      switch (tagTo) {
        case TagObject.TEMPLATE:
          await useSetData({
            params: searchParams,  // Modified to include tags
            configInfo: config.searchTemplate,
            dispatch,
            onSuccess: (data) => {
              console.log('Success Data:', data);
              onResult(data);
              setLoading(false);
            },
            onError: (error: any) => {
              console.log('Error Object:', JSON.stringify(error));
              let contentMessage = 'Search failed';
              
              if (error.code === '42601') {
                contentMessage = 'Syntax error in query';
              }
              
              Modal.error({
                title: 'Error',
                content: contentMessage,
              });
            }
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
      let result;
      switch (tagTo) {
        case TagObject.TEMPLATE:
          result = data.filter(
            (item: ITemplate) =>
              item.status === true &&
              tags.every((tag) =>
                item.tags?.map((tag) => tag.value).includes(tag)
              )
          );
          break;
        default:
          break;
      }
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
  <div className="flex flex-wrap">
    {updatedTags.map((tag: { value: string; count: number }) => (
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
        {tag.value} ({tag.count})
      </Tag>
    ))}
  </div>
)}
</Space>
);
};

export default SearchWithTag;

