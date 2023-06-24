import { L } from '@utils/locales/L';
import Icon from '@components/Icon/Icon';
import { useState } from 'react';
import { OrgPresetBanner, OrgSize, OrgType } from '@utils/constants/organization';
import Input from '@components/Input/Input';
import Button from '@components/Button/Button';
import { useDispatch } from 'react-redux';
import { newOrg } from '@middleware/data';

const NewOrgFrm = ({ onSubmit }: {
  onSubmit: () => void;
}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [org_size, setOrgSize] = useState(OrgSize[0]); //eslint-disable-line
  const [org_type, setOrgType] = useState(OrgType[0]); //eslint-disable-line
  const [icon_url, setIconUrl] = useState(''); //eslint-disable-line
  const dispatch = useDispatch();
  return (
    <>
      <div className="mt-4">
        <div className="mt-4">
          <Icon
            size="xlarge"
            editable
            iconUrl={icon_url}
            onUpload={(obj:any) => {
              if (obj.isPreset === true) {
                setIconUrl(`preset:${obj.filePath}`);
              } else {
                setIconUrl(obj.filePath);
              }
            }}
          />
        </div>
        <div className="mt-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={L('organizationTitle')} classes="w-full" />
        </div>
        <div className="mt-4">
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={L('organizationDesc')} className="rounded-lg border-[1.5px] text-grey-version-6 p-4 text-xl outline-none w-full" />
        </div>
        <div className="mt-4">
          <div>{L('organizationType')}</div>
          <select
            className="focus:outline-gray-300 outline-gray-300 py-3 px-4 my-3 mr-2 rounded-lg outline outline-1 border-r-8 border-transparent w-full"
            onChange={(e) => setOrgType(e.target.value)}
            value={org_type}
          >
            {OrgType.map((org:any) =>
              (
                <option key={org} value={org}>
                  {org}
                </option>
              ))
            }
          </select>
        </div>
        <div className="mt-4">
          <div>{L('organizationSize')}</div>
          <select
            className="focus:outline-gray-300 outline-gray-300 py-3 px-4 my-3 mr-2 rounded-lg outline outline-1 border-r-8 border-transparent w-[450px] w-full"
            onChange={(e) => setOrgSize(e.target.value)}
            value={org_size}
          >
            {OrgSize.map((org:any) =>
              (
                <option key={org} value={org}>
                  {org}
                </option>
              ))
            }
          </select>
        </div>
        <div className="mt-4 text-right">
          <Button
            variant="primary"
            size="lg"
            onClick={async () => {
              newOrg({
                orgInfo: {
                  title, desc, icon_url, org_size, org_type, preset_banner_url: OrgPresetBanner,
                },
                onSuccess: () => {
                  setTitle('');
                  setDesc('');
                  setIconUrl('');
                  setOrgType(OrgType[0]);
                  setOrgSize(OrgSize[0]);
                },
                dispatch,
              });
              onSubmit();
            }}
          >
            {L('create')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default NewOrgFrm;
