import React from 'react';
import EditIcon from '@assets/icons/svg-icons/EditIcon';
import { CARD_TYPE } from '@utils/constants';
import { L, LF } from '@utils/locales/L';
import clsx from 'clsx';

type Props = {
  urlAvatar?: string;
  name?: string;
  title?: string;
  decs?: string;
  contentDate?: string;
  tagType?: string;
  // id: string;
};

const ProposalCardContent = ({
  urlAvatar,
  name = 'limon.eth',
  title,
  decs,
  contentDate,
  tagType,
  // id,
}: Props) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center">
        <img className="object-cover object-center w-8 h-8 rounded-full" src={urlAvatar} alt="" />
        <span className="pl-3 text-[13px] tracking-[0.6px] text-[#252422]">{name}</span>
      </div>
      <p
        className={clsx(
          'font-semibold text-[17px] tracking-[0.5px] text-[#252422]',
          tagType === 'Active' && 'cursor-pointer',
        )}
      >
        {title}
      </p>
      <p className="font-medium text-gray-text text-text_1 tracking-[0.6px]">{decs}</p>
      {(tagType === 'Draft' || tagType === 'Pending') && (
        <div className="hidden cursor-pointer text-violet-version-5 text-text_4 group-hover/item:flex">
          <div>
            <EditIcon />
          </div>
          <p className="pl-1.5">{LF('$(0) $(1)', L('edit'), CARD_TYPE.PROPOSAL_EDIT)}</p>
        </div>
      )}

      <p className="font-semibold text-text_1 text-gray-text tracking-[0.6px] ">{contentDate}</p>
    </div>
  );
};

export default ProposalCardContent;
