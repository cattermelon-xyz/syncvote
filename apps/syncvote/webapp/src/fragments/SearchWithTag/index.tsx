import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { config } from '@dal/config';
import { TagObject } from '@dal/data/tag';
import { ITag } from '@types';
import { Input, Modal, Space, Tag } from 'antd';
import { useState } from 'react';
import { useGetDataHook } from 'utils';

type SearchWithTagProps = {
  className?: string;
  placeholder?: string;
  tagTo: TagObject;
  onResult: (result: any) => void;
};

const SearchWithTag = ({
  className = '',
  placeholder = 'Search ...',
  tagTo = TagObject.TEMPLATE,
  onResult,
}: SearchWithTagProps) => {
  const tags: ITag[] =
    useGetDataHook({
      params: { tagTo: tagTo },
      configInfo: config.queryTag,
    }).data;

  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

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

  const search = ({ tags, text }: { tags: any[]; text: string }) => {
    setLoading(true);
    // TODO: change to search api
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
        onBlur={() => {
          if (inputSearchText && inputSearchText !== toSearch) {
            setSelectedTagIds([]);
            setToSearch(inputSearchText);
            search({ tags: [], text: inputSearchText });
          }
        }}
      />
      <div className='w-full'>
        {!inputSearchText &&
          tags.map((tag: any) => {
            return (
              <Tag
                className={`inline cursor-pointer hover:bg-violet-500 hover:text-white py-1 px-2 rounded-full ${
                  selectedTagIds.indexOf(tag.value) !== -1
                    ? 'bg-violet-500 text-white'
                    : ''
                }`}
                onClick={() => {
                  const newselectedTagIds = structuredClone(selectedTagIds);
                  const idx = selectedTagIds.indexOf(tag.value);
                  if (idx !== -1) {
                    newselectedTagIds.splice(idx, 1);
                  } else {
                    newselectedTagIds.push(tag.value);
                  }
                  setSelectedTagIds(newselectedTagIds);
                  search({ tags: newselectedTagIds, text: toSearch });
                }}
                key={tag.value}
              >
                {tag.label} ({extractCount(tag)})
              </Tag>
            );
          })}
      </div>
    </Space>
  );
};

export default SearchWithTag;
