import { L } from '@utils/locales/L';
import React, { useRef, useState } from 'react';

interface Props {
  label?: string;
  className?: string;
  classNameButton?: string;
  classNameStatus?: string;
  isShowStatus?: boolean;
}

const validFileTypes = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const UploadButton: React.FC<Props> = ({
  label = '',
  className = '',
  classNameButton = '',
  classNameStatus = '',
  isShowStatus = false,
}) => {
  const [status, setStatus] = useState('');
  const [validStatus, setValidStatus] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files || files.length === 0) {
      return;
    }

    if (files.length > 100) {
      setStatus(L('onlyAllowedToUploadAMaximumOf100Files'));
      setValidStatus(false);
      return;
    }

    const validFiles: string[] = [];

    // eslint-disable-next-line array-callback-return
    Array.from(files).map((file) => {
      if (!validFileTypes.includes(file.type)) {
        setStatus(L('thereAreInvalidFiles'));
        setValidStatus(false);
      } else {
        validFiles.push(file.name);
        setValidStatus(true);
      }
    });

    if (validFiles.length > 0) {
      setStatus(`${L('numberOfDatascource')} ${validFiles.length}`);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const validateStatus = () => {
    return validStatus ? 'ml-4 text-green-version-5' : 'ml-4 text-red-version-5';
  };

  return (
    <div className={`flex flex-col justify-start items-start ${className}`}>
      <button
        className={`bg-blue-500 font-bold py-2 px-4 rounded ${classNameButton}`}
        onClick={handleClick}
      >
        {label}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileUpload}
        accept=".doc, .docx, .pptx, .jpg, .jpeg, .gif, .png, .svg, .csv, .xlsx"
      />
      {isShowStatus && status && (
        <div className={`${validateStatus()} ${classNameStatus}`}>{status}</div>
      )}
    </div>
  );
};

export default UploadButton;
