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
      // TODO: useCallback to solve infinite loop
      // setLoading(true);
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
          setLoading(false);
        },
        onError: (error) => {
          console.log('error', error);
          setLoading(false);
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
    const selectedDataOrg = dataOrgs.filter(
      (dataOrg: any) => dataOrg?.id === value
    );
    setCurrentOrgData(selectedDataOrg[0]);
    setLoading(false);
  };
  return (
    <>
      {orgsOption && (
        <>
          <div className='flex flex-row justify-between mb-6 items-center'>
            <Select
              defaultValue={orgsOption[0]?.value}
              style={{ width: 135, borderColor: 'transparent', height: 40 }}
              onChange={handleChangeOrg}
              options={orgsOption}
            />

            <div className='flex gap-3 items-center'>
              <div className='flex rounded-full h-[40px] w-[40px] bg-[#E6E6E6] justify-center cursor-pointer'>
                <BellOutlined style={{ fontSize: '20px' }} />
              </div>
              <Avatar
                className='w-[40px] h-[40px]'
                src={user?.user_metadata?.avatar_url}
              />
            </div>
          </div>
          <div className='flex justify-between items-center'>
            <div className='text-xl font-bold text-gray-700'>Proposal</div>
            <div
              className='flex rounded-full h-[48px] w-[48px] bg-[#E6E6E6] justify-center cursor-pointer hover:shadow-xl'
              onClick={() => {
                setPage(PAGE_ROUTER.CREATE_PROPOSAL);
              }}
            >
              <PlusOutlined className='text-xl' />
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
