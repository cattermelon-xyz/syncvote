import React from 'react';
import clsx from 'clsx';
import { TAG_TYPE } from '@utils/constants';

type Props = {
  tagType?: 'Active' | 'Pending' | 'Draft';
};

const Tag = ({ tagType }: Props) => {
  const checkTagType = () => {
    if (tagType === TAG_TYPE.ACTIVE) {
      return 'bg-tag-active-bg text-tag-active-text';
    }
    if (tagType === TAG_TYPE.PENDING) {
      return 'bg-tag-pending-bg text-[#D89531]';
    }
    if (tagType === TAG_TYPE.DRAFT) {
      return 'bg-tag-draft-bg text-tag-draft-text';
    }
    return '';
  };

  return (
    <span
      className={clsx('text-base font-medium py-1 px-2 rounded-lg cursor-pointer', checkTagType())}
    >
      {tagType}
    </span>
  );
};

export default Tag;
