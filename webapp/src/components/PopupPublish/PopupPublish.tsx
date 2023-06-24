import React, { useState } from 'react';
import RocketStartup from '@assets/images/RocketStartup';
import Button from '@components/Button/Button';
import { L } from '@utils/locales/L';
import ShareIcon from '@assets/icons/svg-icons/ShareIcon';
import { useNavigate } from 'react-router-dom';
import ShareToOthers from './ShareToOthers';

interface Props {
  publishHeader?: string;
  publishText?: React.ReactNode;
  isShareToMembers?: boolean;
  textInPublishBtn?: string;
  navigateTo?: string;
  marginClass?: string;
  navigateToShare?: string;
  className?: string;
  containerClassName?: string;
  wrapperClassName?: string;
  publishTextClassName?: string;
  onClickNavigate?: () => void;
  height?: string;
}

const renderPublishText = (
  <div className="text-center">
    <p className="text-center font-medium text-text_3 ">{L('publishSuccesText')}</p>
  </div>
);

const PopupPublish: React.FC<Props> = ({
  isShareToMembers = true,
  publishHeader = L('publishedSuccessfully'),
  publishText = renderPublishText,
  textInPublishBtn = L('goToPublic'),
  navigateTo = '/',
  className = '',
  containerClassName = '',
  wrapperClassName = '',
  publishTextClassName = '',
  marginClass,
  navigateToShare,
  onClickNavigate = () => {},
  height = 'h-full',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigate = () => {
    onClickNavigate();
    navigate(navigateTo);
  };
  return (
    <div>
      {isModalOpen ? (
        <div className="h-auto">
          <ShareToOthers closeModal={handleCloseModal} navigateToShare={navigateToShare} />
        </div>
      ) : (
        <div
          className={`max-h-[650px] flex flex-col justify-center items-center ${wrapperClassName}`}
        >
          <div
            className={`flex flex-col justify-between items-center ${height}  ${containerClassName}`}
          >
            <>
              <RocketStartup />
              <div
                className={`flex flex-col justify-center gap-6 items-center w-w_4 mb-[24px] ${className}`}
              >
                <div className={`mt-8 mb-6 text-center ${marginClass}`}>
                  <p className="text-base-3xl font-semibold">{publishHeader}</p>
                </div>
                <p className={publishTextClassName}>{publishText}</p>
                {isShareToMembers && (
                  <Button variant="text" onClick={handleOpenModal} className="text-center">
                    <div className="flex gap-2 items-center">
                      <ShareIcon />
                      <a
                        href="#"
                        className="text-text_2 font-medium text-violet-version-5 hover:underline"
                      >
                        {L('shareToMembers')}
                      </a>
                    </div>
                  </Button>
                )}
              </div>
              <div />
              <Button
                className="w-[632px] px-[18px] py-5 flex justify-center items-center mt-m_1"
                onClick={handleNavigate}
              >
                <p className="text-[17px] leading-[22px] tracking-[0.5px] rounded-2lg font-medium">
                  {textInPublishBtn}
                </p>
              </Button>
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupPublish;
