import v1 from '@assets/images/Eye.png';
import v2 from '@assets/images/teamwork.png';
import v3 from '@assets/images/checkmark.png';
import { L } from '@utils/locales/L';
import Button from '@components/Button/Button';
import PlusIcon from '@assets/icons/svg-icons/PlusIcon';
import { Link } from 'react-router-dom';
import SlideTitle from './SlideTitle';

const PageScreen = () => (
  <div className="flex relative min-h-100vh-70">
    <div className="basis-3/5 flex flex-col justify-evenly pr-[78px] pt-[20px] pl-[40px]">
      <div className="p-6 mb-[30px] border-b border-primary_logo flex items-center h-[50%]">
        <div className="flex gap-6 pb-[30px]">
          <div className="basis-2/5 text-center">
            <img src={v2} alt="" className="inline-block" />
          </div>
          <div className="flex flex-col items-start gap-[26px] basis-3/5">
            <div>
              <span className="text-violet-version-5 text-base-2xl leading-line_4 font-semibold tracking-letter">
                {L('blueprint')}
              </span>
            </div>
            <div>
              <p className="text-text_3 text-grey-version-7 leading-line_3 font-medium tracking-wider">
                {L('multipleProposals')}
              </p>
            </div>
            <div className="w-full">
              <Link to="/">
                <Button
                  startIcon={<PlusIcon color="white" />}
                  variant="primary"
                  children="Create a multi-linked proposal"
                  className="w-full h_4 flex justify-center text-text_2 leading-line_2 font-medium items-center  py-p_5_1 px-3.5 gap-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-6">
          <div className="basis-2/5 text-center">
            <img src={v3} alt="" className="inline-block" />
          </div>
          <div className="flex flex-col items-start gap-[26px] basis-3/5">
            <div>
              <span className="text-violet-version-5 text-base-2xl leading-line_4 font-semibold tracking-letter">
                {L('singleProposal')}
              </span>
            </div>
            <div>
              <p className="text-text_3 text-grey-version-7 leading-line_3 font-medium tracking-wider">
                {L('votingProposal')}
              </p>
            </div>
            <div className="w-full">
              <Link to="/onboard">
                <Button
                  startIcon={<PlusIcon color="white" />}
                  variant="primary"
                  children="Create a single proposal"
                  className="w-full h_4 flex justify-center text-text_2 leading-line_2 font-medium items-center  py-p_5_1 px-3.5 gap-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="basis-2/5 w-[587px] bg-[#F9FAFF] flex flex-col justify-center">
      <div>
        <SlideTitle />
      </div>
      <div className="flex justify-center items-center">
        <img src={v1} alt="" className="w-[60%]" />
      </div>
    </div>
  </div>
);

export default PageScreen;
