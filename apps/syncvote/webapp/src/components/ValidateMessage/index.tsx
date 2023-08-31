import React from 'react';
import ErrorIcon from '@assets/icons/svg-icons/ErrorIcon';
import WarningIcon from '@assets/icons/svg-icons/WarningIcon';
import SuccessIcon from '@assets/icons/svg-icons/SuccessIcon';
import { AlertMessage } from 'types/common';

type Props = {
  condition: AlertMessage | null;
};
export default function ValidateMessage({ condition = null }: Props) {
  if (!condition) return null;
  if (condition.type === 'ERROR') {
    return (
      <div className="flex items-center gap-8px">
        <ErrorIcon />
        <span className="text-emph-caption-1 text-grey-version-5">{condition.message}</span>
      </div>
    );
  }
  if (condition.type === 'WARN') {
    return (
      <div className="flex items-center gap-8px">
        <WarningIcon />
        <span className="text-emph-caption-1 text-grey-version-5">{condition.message}</span>
      </div>
    );
  }
  if (condition.type === 'SUCCESS') {
    return (
      <div className="flex items-center gap-8px">
        <SuccessIcon />
        <span className="text-emph-caption-1 text-grey-version-5">{condition.message}</span>
      </div>
    );
  }
  return null;
}
