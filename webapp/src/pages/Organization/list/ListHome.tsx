import PlusIcon from '@assets/icons/svg-icons/PlusIcon';
import Icon from '@components/Icon/Icon';
import { createIdString, getImageUrl } from '@utils/helpers';
import { Drawer, Space, Layout } from 'antd';
import NewOrgFrm from './NewOrgFrm';
import Button from '@components/Button/Button';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { L } from '@utils/locales/L';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@utils/supabaseClient';
import WorkflowCard from '@components/Card/WorkflowCard';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';

const ListHome = () => {
  const [shouldShowForm, setShouldShowForm] = useState(false);
  const { orgs } = useSelector((state: any) => state.orginfo);
  const { presetBanners } = useSelector((state: any) => state.ui);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const dispatch = useDispatch();
  const presetBanner = presetBanners[15]
    ? getImageUrl({
        filePath: presetBanners[15],
        isPreset: true,
        type: 'banner',
      })
    : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataWorkflow = async () => {
      dispatch(startLoading({}));
      const { data, error } = await supabase
        .from('workflow')
        .select(`*, versions: workflow_version(id, status)`);

      dispatch(finishLoading({}));
      if (data) {
        const workflowData = data.filter(
          (worfklow) => worfklow?.versions[0]?.status === 'PUBLIC_COMMUNITY'
        );
        setWorkflows(workflowData);

        console.log(workflowData);
      }
    };

    fetchDataWorkflow();
  }, []);

  return (
    <div className='mt-8 container mx-auto relative '>
      <div className='flex items-center mb-10 container justify-between'>
        <div className='flex text-lg font-bold'>{L('workflows')}</div>
        {/* <Space direction='horizontal'>
          <Button
            variant='outline'
            startIcon={<PlusIcon />}
            onClick={() => setShouldShowForm(true)}
          >
            {L('createANewOrganization')}
          </Button>
        </Space> */}
      </div>
      <div className='grid 2xl:grid-cols-3 xl:grid-cols-3 gap-4 gap-y-6'>
        {workflows &&
          workflows.map((workflow, index) => (
            <WorkflowCard key={index} dataWorkflow={workflow} />
          ))}
      </div>

      {/* <div className='grid grid-flow-row grid-cols-3 gap-4 justify-items-center'>
        {orgs.map((org: any) => {
          let bannerUrl = presetBanner;
          if (org.banner_url) {
            const filePath =
              org.banner_url.indexOf('preset:') === 0
                ? org.banner_url.replace('preset:', '')
                : org.banner_url;
            bannerUrl = getImageUrl({
              filePath,
              isPreset: org.banner_url.indexOf('preset:') === 0,
              type: 'banner',
            });
          }
          const path = `/${createIdString(org.title, org.id)}`;
          return (
            <div
              key={org.id}
              className='w-[290px] border-b_1 cursor-pointer hover:drop-shadow-lg'
              onClick={() => {
                navigate(path);
              }}
              title={path}
            >
              {org.background_url ? (
                <div className='w-[290px] h-[142px]' />
              ) : (
                <div
                  className='w-[290px] h-[142px] bg-cover'
                  // className="w-[290px] h-[142px] bg-gradient-to-tr from-gray-500 to-gray-700"
                  style={{ backgroundImage: `url(${bannerUrl})` }}
                />
              )}
              <div className='flex flex-col items-left pl-4 pr-4 pb-4 bg-card-bg'>
                <div className='-mt-8'>
                  {org.icon_url ? (
                    // <Avatar size={64} src={org.icon_url} className="outline outline-2" />
                    <Icon size='large' iconUrl={org.icon_url} />
                  ) : (
                    <Icon size='large'>{org?.title?.charAt(0)}</Icon>
                  )}
                </div>
                <div className='mt-2 text-lg text-ellipsis'>{org.title}</div>
                <div className='mt-2 text-xs text-ellipsis'>{org.desc}</div>
              </div>
            </div>
          );
        })}
      </div> */}
      <Drawer
        open={shouldShowForm}
        title={L('createANewOrganization')}
        footer={null}
        onClose={() => setShouldShowForm(false)}
        size='large'
      >
        <NewOrgFrm
          onSubmit={() => {
            setShouldShowForm(false);
          }}
        />
      </Drawer>
    </div>
  );
};

export default ListHome;
