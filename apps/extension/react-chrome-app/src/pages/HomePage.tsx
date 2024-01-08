import { Select, Avatar, Tabs, Empty } from 'antd';
import { BellOutlined, PlusOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import MissionCard from '@components/MissionCard';
import { PAGE_ROUTER } from '@constants/common';
import { useEffect, useState } from 'react';
import { resetLastProposalId } from '../utils';
import { queryOrgs } from '@data/org';
import moment from 'moment';

interface Props {
  setPage: any;
  setCurrentProposalId: any;
  setCurrentOrgData: any;
  user: any;
  myMissions: any;
  followingMissions: any;
  setLoading: any;
}

const HomePage: React.FC<Props> = ({
  setPage,
  setCurrentProposalId,
  setCurrentOrgData,
  user,
  myMissions,
  followingMissions,
  setLoading,
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
            return (
              moment(a.last_updated).unix() - moment(b.last_updated).unix()
            );
          });
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
          {myMissions && myMissions.length > 0 ? (
            myMissions.map((proposal: any, index: any) => (
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
    {
      key: '2',
      label: 'Followings',
      children: (
        <div className='flex flex-col gap-2'>
          {followingMissions && followingMissions.length > 0 ? (
            followingMissions.map((proposal: any, index: any) => (
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
    {
      key: '3',
      label: 'Mentions',
      children: <></>,
      disabled: true,
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
    setLoading(true);
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
