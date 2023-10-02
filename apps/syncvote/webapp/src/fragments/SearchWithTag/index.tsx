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
};



const SearchWithTag = ({
  className = '',
  placeholder = 'Search ...',
  tagTo = TagObject.TEMPLATE,
  onResult,
  showSearchTag = true,
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
      case TagObject.ORGANIZATION:
        data = useGetDataHook({
          configInfo: config.queryOrgs,
        }).data;
        // queryAllOrgs({
        //   dispatch,
        //   onSuccess: (orgs: any) => {
        //     data = orgs;
        //     console.log('hello', orgs);
        //   },
        // });
        break;
      default:
        break;
    }

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

  useEffect(() => {
    if (!inputSearchText && selectedTagIds.length === 0) {
      onResult(data);
    }
  }, [inputSearchText, selectedTagIds, onResult, data]);

  const search = async ({ tags, text }: { tags: any[]; text: string }) => {
    setLoading(true);
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
        if (text) {
          await useSetData({
            params: {
              inputSearch: text,
            },
            configInfo: config.searchOrg,
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
        }
        setLoading(false);
        break;

      default:
        break;
    }

    if (!text) {
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
      <div className='w-full'>
        {tags.map((tag: any) => {
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
                setInputSearchText('');
                search({ tags: newselectedTagIds, text: '' });
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
