import React from 'react';
import EditIcon from '@assets/icons/svg-icons/EditIcon';
import clsx from 'clsx';
import Button from '@components/Button/Button';
import PlusIcon from '@assets/icons/svg-icons/PlusIcon';
import { CARD_TYPE, TAG_TYPE } from '@utils/constants';
import { L, LF } from '@utils/locales/L';

type Props = {
  dataAvatar?: [];
  tagType?: string;
  date?: string;
  amount?: string;
  title?: string;
  contentDate?: string;
};

const BluePrintCardContent = ({
  tagType, date, amount, title, dataAvatar, contentDate,
}: Props) => {
  const renderAvatarList = (data: any) =>
    data.map((avatar: string, index: number) => (
      <div key={avatar} className="relative w-6 h-6">
        <img
          className={clsx('rounded-full w-full h-full object-cover object-center absolute')}
          src={avatar}
          alt=""
          style={{
            left: `-${4 * index}px`,
          }}
        />
      </div>
    ));

  return (
    <div className="flex flex-col gap-y-2 ">
      <div className="flex">{renderAvatarList(dataAvatar)}</div>
      <p className="font-semibold text-text_2 text-gray-title tracking-[0.5px]">{title}</p>
      <p className="text-xs font-medium text-gray-text tracking-[0.6px]">
        {contentDate || `Last updated on ${date}`}
      </p>
      <div>
        {tagType === TAG_TYPE.DRAFT || tagType === TAG_TYPE.PENDING ? null : (
          <p className="inline p-2 text-xs border rounded-lg cursor-pointer text-violet-version-5 border-violet-primary">
            {`${amount} active proposals`}
          </p>
        )}
      </div>
      {tagType === TAG_TYPE.DRAFT || tagType === TAG_TYPE.PENDING ? (
        <>
          <div className="hidden group-hover/item:block">
            <Button
              startIcon={
                <PlusIcon className="flex items-center" color="white" width={20} height={20} />
              }
              className="px-3 py-2 text-[15px]"
            >
              {L('applyBlueprint')}
            </Button>
          </div>
          <div className="hidden cursor-pointer text-violet-version-5 text-text_4 group-hover/item:flex">
            <div>
              <EditIcon />
            </div>
            <p className="pl-1.5 normal">{LF('$(0) $(1)', L('edit'), CARD_TYPE.BLUEPRINT_EDIT)}</p>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default BluePrintCardContent;
