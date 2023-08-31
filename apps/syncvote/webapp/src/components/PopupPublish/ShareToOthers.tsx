import { useState } from 'react';
import Button from '@components/Button/Button';
import DropDown from '@components/DropDown/DropDown';
import { L } from '@utils/locales/L';
import VerticalEllipsisIcon from '@assets/icons/svg-icons/VerticalEllipsisIcon';
import LinkIcon from '@assets/icons/svg-icons/LinkIcon';
import QuestionMarkIcon from '@assets/icons/svg-icons/QuestionMarkIcon';
import { DropDownItem } from '@components/DropDown/interface';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { unsecuredCopyToClipboard } from '@utils/helpers';

const items = [
  {
    label: 'Operations',
    value: 'operations',
  },
  {
    label: 'Marketing',
    value: 'marketing',
  },
  {
    label: 'Council',
    value: 'council',
  },
  {
    label: 'Product',
    value: 'product',
  },
];

interface Props {
  closeModal?: () => void;
  onClickNavigateShare?: () => void;
  navigateToShare?: string;
}

const ShareToOthers: React.FC<Props> = ({
  closeModal = () => {},
  onClickNavigateShare = () => {},
  navigateToShare = '/',
}: Props) => {
  const [selectedItems, setSelectedItems] = useState<DropDownItem[]>([]);
  const [isTooltip, setIsTooltip] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (selectedItems: DropDownItem[]) => {
    setSelectedItems(selectedItems);
  };
  const handleNavigate = () => {
    onClickNavigateShare();
    navigate(navigateToShare);
  };

  const selectedColorText = () => {
    if (selectedItems.length > 0) {
      return 'p-1 rounded-lg bg-violet-version-1 text-violet-version-5 text-[20px]';
    }
    return 'text-grey-version-5 text-[20px]';
  };

  const handleCloseModal = () => {
    closeModal();
  };

  // TODO: dont know wtf it is
  const handleCopyLink = () => {
    const content = window.location.origin;
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(`${content}/2`);
    } else {
      unsecuredCopyToClipboard(`${content}/2`);
    }
    // navigator.clipboard.writeText(window.location.href);
    setIsTooltip(true);
    setTimeout(() => setIsTooltip(false), 2000);
  };

  return (
    <div className="">
      <div className="flex flex-col justify-center w-[590px] max-w-[696px] gap-8">
        <p className="font-semibold text-base-2xl">{L('Share to others')}</p>
        <div className="flex flex-col gap-4">
          <div className="rounded-lg">
            <DropDown
              label="Announce to @role"
              items={items}
              selectedItems={selectedItems}
              onSelect={handleSelect}
              labelClass={selectedColorText()}
              buttonClass="gap-4 p-4 w-full h-full"
              itemClass="p-1 rounded-lg bg-grey-version-3 text-violet-version-5"
              selectClass="w-full"
              iconItemEnd={<VerticalEllipsisIcon />}
            />
          </div>
          <div className="w-full flex justify-between">
            <Tooltip
              placement="right"
              title="Copied link"
              color="#7948C7"
              zIndex={100}
              trigger={['click']}
              open={isTooltip}
            >
              <button className="px-0">
                <div
                  className="py-3 flex gap-1 w-full text-violet-version-5"
                  onClick={handleCopyLink}
                >
                  <LinkIcon />
                  <p className="text-text_2 ">{L('copyLinkToProposal')}</p>
                </div>
              </button>
            </Tooltip>

            <Button variant="text" className="px-0">
              <QuestionMarkIcon />
              <p className="text-text_1.5">{L('automateWithDiscordBot')}</p>
            </Button>
          </div>
        </div>
        <div className="flex w-full gap-6 justify-center">
          <Button
            variant="secondary"
            className="flex-1 h-[65.71px] flex justify-center items-center cursor-pointer"
            onClick={handleCloseModal}
          >
            <p className="text-text_2 font-medium">{L('close')}</p>
          </Button>
          <Button
            variant="primary"
            disabled={selectedItems.length <= 0}
            className={`flex-1 h-[65.71px] flex justify-center items-center ${
              selectedItems.length <= 0 ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={handleNavigate}
          >
            <p className="text-text_2 font-medium">{L('share')}</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareToOthers;
