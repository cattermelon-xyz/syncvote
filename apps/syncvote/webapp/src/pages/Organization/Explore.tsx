import React, { useEffect, useState } from 'react';
import { Typography, Modal, Button, Empty } from 'antd';
const { Title } = Typography;
import { L } from '@utils/locales/L';
import OrgCard from './fragments/OrgCard';
import SearchWithTag from '@fragments/SearchWithTag';
import { TagObject } from '@dal/data/tag';
import { queryOrgByRange } from '@dal/data';
import { useDispatch } from 'react-redux';
import { ListItem } from 'list-item';
import { ReloadOutlined } from '@ant-design/icons';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [OrgsData, setOrgsData] = useState<any[]>([]);
  const [originalOrgsData, setOriginalOrgsData] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(0);

  const getFromAndTo = () => {
    const ITEM_PER_PAGE = 8;
    let from = page * ITEM_PER_PAGE;

    // substract 1 because range 0 to 7 in supabase equal 8 items.
    let to = from + ITEM_PER_PAGE - 1;

    return { from, to };
  };

  const fetchData = () => {
    const { from, to } = getFromAndTo();
    queryOrgByRange({
      from,
      to,
      onSuccess: (data: any) => {
        setPage(page + 1);
        setOriginalOrgsData((currentData: any) => [...currentData, ...data]);
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: error,
        });
      },
      dispatch,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='w-[800px] flex flex-col gap-y-14'>
      <section className='w-full'>
        <Title level={2} className='text-center'>
          {L('exploreOrg')}
        </Title>
        <SearchWithTag
          tagTo={TagObject.ORGANIZATION}
          onResult={(result: any) => {
            if (result && result.length > 0) {
              setOrgsData(result);
              setIsSearching(true);
            } else if (result && result.length === 0) {
              setOrgsData([]);
              setIsSearching(true);
            } else {
              setOrgsData(originalOrgsData);
              setIsSearching(false);
            }
          }}
          showSearchTag={false}
        />
        {OrgsData && OrgsData.length > 0 ? (
          <>
            <ListItem
              items={OrgsData.map((OrgData, index) => (
                <OrgCard key={index} orgData={OrgData} />
              ))}
              columns={{ xs: 2, md: 3, xl: 4, '2xl': 4 }}
            />
            {!isSearching && (
              <div className='w-full flex justify-center items-center'>
                <Button
                  onClick={fetchData}
                  className='mt-4'
                  icon={<ReloadOutlined />}
                >
                  View More
                </Button>
              </div>
            )}
          </>
        ) : (
          <Empty description='No Organizations Found' />
        )}
      </section>
    </div>
  );
};

export default React.memo(Home);
