import { Avatar, Card } from 'antd';
import { Banner } from 'banner';
import Icon from 'icon/src/Icon';
import { createIdString } from 'utils';

export const TemplateCard = ({
  template,
  navigate,
}: {
  template: any;
  navigate: any;
}) => {
  const { title, id, icon_url, banner_url } = template;
  return (
    <Card
      hoverable={true}
      style={{ position: 'relative' }}
      className='w-[256px] h-[176px] relative rounded-xl'
      onClick={() => {
        navigate('/template/' + createIdString(title, id.toString()));
      }}
    >
      {
        <Banner
          presetBanners={[]}
          bannerUrl={banner_url}
          className='w-full h-[86px] rounded-lg m-0'
        />
      }
      {icon_url ? (
        <Icon iconUrl={icon_url} size='medium' presetIcon={[]} />
      ) : (
        <Avatar
          shape='circle'
          style={{
            backgroundColor: '#D3D3D3',
            position: 'absolute',
            top: '78px',
            left: '24px',
            zIndex: 10,
          }}
        />
      )}
      <p className='text-xs text-[#252422] mt-[18px] mb-2 truncate'>{title}</p>
    </Card>
  );
};
