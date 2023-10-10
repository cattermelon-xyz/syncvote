import React from 'react';
import Tag from '@components/Card/Tag/Tag';
import { ECardEnumType } from '@utils/constants';

type Props = {
  tagType?: 'Active' | 'Pending' | 'Draft';
  cardType?: ECardEnumType;
  children: React.ReactNode;
};

const Card = ({ tagType, children, cardType }: Props) => {
  let className = 'px-4 py-5 bg-card-bg rounded-2xl flex flex-col justify-between group/item';
  if (cardType === ECardEnumType.INITIATIVE) {
    className += ' min-h-[280px]';
  } else {
    className += ' min-h-[306px]';
  }

  return (
    <div className={className}>
      <div>
        <Tag tagType={tagType} />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Card;
