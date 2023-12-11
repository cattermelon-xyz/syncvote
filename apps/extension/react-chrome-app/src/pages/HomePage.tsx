import { Select, Avatar, Tabs, Empty } from 'antd';
import { BellOutlined, PlusOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import MissionCard from '@components/MissionCard';
import { PAGE_ROUTER } from '@constants/common';
import { useEffect, useState } from 'react';
import { resetLastProposalId } from '../utils';
import { queryOrgs } from '@data/org';

interface Props {
  setPage: any;
  setCurrentProposalId: any;
  setCurrentOrgData: any;
  user: any;
  dataMissions: any;
}

const HomePage: React.FC<Props> = ({
  setPage,
  setCurrentProposalId,
  setCurrentOrgData,
  user,
  dataMissions,
}) => {
  const [orgsOption, setOrgsOption] = useState<any>();
  const [dataOrgs, setDataOrgs] = useState<any>();

  useEffect(() => {
    resetLastProposalId();
  });

  useEffect(() => {
    if (user) {
      queryOrgs({
        params: { userId: user.id },
        onSuccess: (data) => {
          const sortedData = data.sort((a: any, b: any) => {
            const titleA = a.title.toUpperCase();
            const titleB = b.title.toUpperCase();
            if (titleA < titleB) {
              return -1;
            }
            if (titleA > titleB) {
              return 1;
            }
            return 0;
          });
          console.log('data org', sortedData);
          const handleDataOrgs = sortedData.map((dataOrg: any) => {
            return {
              value: dataOrg?.id,
              label: dataOrg?.title,
            };
          });
          setCurrentOrgData(data[0]);
          setOrgsOption(handleDataOrgs);
          setDataOrgs(data);
        },
        onError: (error) => {
          console.log('error', error);
        },
      });
    }
  }, [user]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'For you',
      children: (
        <div className='flex flex-col gap-2'>
          {dataMissions && dataMissions.length > 0 ? (
            dataMissions.map((proposal: any, index: any) => (
              <MissionCard
                key={index}
                proposal={proposal}
                setPage={setPage}
                setCurrentProposalId={setCurrentProposalId}
              />
            ))
          ) : (
            <Empty />
          )}
        </div>
      ),
    },
  ];

  const onChangeTabs = (key: string) => {
    console.log(key);
  };

  const handleChangeOrg = (value: string) => {
    console.log(`selected ${value}`);
    const selectedDataOrg = dataOrgs.filter(
      (dataOrg: any) => dataOrg?.id === value
    );
    setCurrentOrgData(selectedDataOrg[0]);
  };

  return (
    <>
      {orgsOption && (
        <>
          <div className='flex justify-between mb-6'>
            <Select
              defaultValue={orgsOption[0]?.value}
              style={{ width: 120 }}
              onChange={handleChangeOrg}
              options={orgsOption}
            />

            <div className='flex gap-3 items-center'>
              <div className='flex rounded-full h-[28px] w-[28px] bg-[#E6E6E6] justify-center cursor-pointer'>
                <BellOutlined style={{ fontSize: '20px' }} />
              </div>
              <Avatar src={user?.user_metadata?.avatar_url} />
            </div>
          </div>
          <div className='flex justify-between items-center'>
            <p>Proposal</p>
            <div
              className='flex rounded-full h-[36px] w-[36px] bg-[#E6E6E6] justify-center cursor-pointer'
              onClick={() => {
                setPage(PAGE_ROUTER.CREATE_PROPOSAL);
              }}
            >
              <PlusOutlined />
            </div>
          </div>
          <Tabs
            className='mb-2'
            defaultActiveKey='1'
            items={items}
            onChange={onChangeTabs}
          />
        </>
      )}
    </>
  );
};

export default HomePage;
