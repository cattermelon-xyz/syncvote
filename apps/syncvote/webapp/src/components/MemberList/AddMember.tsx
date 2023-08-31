import CopyIcon from '@assets/icons/svg-icons/CopyIcon';
import XButton from '@assets/icons/svg-icons/XButton';
import Button from '@components/Button/Button';
import { L } from '@utils/locales/L';
import React from 'react';

interface Props {
  closeModal?: () => void;
  content?: string;
  members?: any;
}

const AddMember: React.FC<Props> = ({ closeModal = () => {}, content, members }: Props) => {
  // const [isTooltip, setIsTooltip] = useState(false);
  const handleCloseModal = () => {
    closeModal();
  };
  // const handleShare = () => {
  //   navigator.clipboard.writeText(window.location.href);
  //   setIsTooltip(true);
  //   setTimeout(() => setIsTooltip(false), 2000);
  // };
  return (
    <div className=" max-h-[70vh] overflow-auto">
      <div className="flex flex-col justify-center items-center w-full ">
        <div className="flex w-[561px] h-[52.02px] items-center justify-between  ">
          <div className="text-[25px] leading-[32px] font-semibold tracking-[0.395] text-[#252422] ">
            <span>{L('memberList')}</span>
          </div>
          <div>
            <Button
              variant="outline"
              className="w-[40.71px] h-[40.71px] rounded-[113.087px] flex items-center justify-center"
              onClick={handleCloseModal}
            >
              <XButton />
            </Button>
          </div>
        </div>
        <div className="w-[561px]">
          {members[members.selected].map((item: any) => (
            <div className="flex gap-[24px] pt-[24px] " key={item.id}>
              <div>
                <Button
                  children={item.tagName}
                  variant="outline"
                  className="w-[268.5px] text-text_3 leading-[25px] h-[57px] flex justify-start items-center border-1.5 border-grey-version-3"
                />
              </div>
              <div>
                <Button
                  variant="outline"
                  className="w-[268.5px] h-[57px] flex  text-text_3 justify-start items-center border-1.5 border-grey-version-3"
                >
                  <div className="flex w-full">
                    <div className="w-[212.5px] flex ">
                      <span>{item.walletAddress}</span>
                    </div>
                    {/* <div className="p-0 cursor-pointer" onClick={handleShare}>
                      <Tooltip
                        placement="right"
                        title="Copied link"
                        color="#898988"
                        zIndex={100}
                        trigger={['click']}
                        open={isTooltip}
                      >
                        <div className="flex items-center gap-1">
                          <CopyIcon />
                        </div>
                      </Tooltip>
                    </div> */}
                    <div>
                      <CopyIcon />
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          ))}
        </div>
        {content && (
          <div className="w-[561px] pt-[24px] flex justify-center items-center">
            <Button
              children={content}
              variant="text"
              className="w-[268.5px] text-text_3 leading-[25px] h-[57px] flex justify-center text-[#5D23BB] items-center "
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMember;
