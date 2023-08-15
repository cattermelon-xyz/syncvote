import { ICheckPoint, IParticipant, IToken } from '../interface';
import { Popover } from 'antd';
import { displayDuration, isRTE } from '../utils';
import parse from 'html-react-parser';
import TokenInput from './TokenInput';
import moment from 'moment';
import SideNote from './SideNote';
import NumberWithPercentageInput from './NumberWithPercentageInput';
const renderParticipation = (participation: IParticipant | undefined) => {
  let rs = null;
  if (!participation || (participation.type && !participation.data)) {
    // rs = <div className='text-red-500'>Missing participation setup</div>;
    rs = 'Other identity';
  } else {
    const { type, data: pdata } = participation;
    const identities = (pdata as string[]) || [];
    if (type === 'identity') {
      rs = (
        <Popover
          content={
            <div>
              <div className='text-zinc-500'>List of identity:</div>
              <ol className='ml-2'>
                {identities.map((str, index) => {
                  return (
                    <li key={index} className='ml-1'>
                      {str}
                    </li>
                  );
                })}
              </ol>
            </div>
          }
          trigger='click'
        >
          <span className='mr-1 cursor-pointer hover:bg-violet-200 hover:pr-1'>
            Only
            <span className='text-violet-500 mx-1'>
              {((pdata as string[]) || []).length}
            </span>
            can participate in the voting process.
          </span>
        </Popover>
      );
    } else if (type === 'token') {
      rs = (
        <span className='mr-1'>
          <span className='text-violet-500 mx-1'>
            <TokenInput address={(pdata as IToken)?.address || ''} />
          </span>
          {(pdata as IToken)?.min ? (
            <>
              {' '}
              with a minimum of
              <span className='text-violet-500 mx-1'>
                {<NumberWithPercentageInput value={(pdata as IToken)?.min} />}
              </span>
              tokens
            </>
          ) : null}
        </span>
      );
    }
  }
  return rs;
};

const GeneralInfo = ({ checkpoint }: { checkpoint: ICheckPoint }) => {
  const {
    proposerDescription,
    participation,
    participationDescription,
    votingLocation,
  } = checkpoint;
  return (
    <>
      <div className='text-zinc-400'>General info</div>
      <ul className='list-disc ml-4'>
        {proposerDescription ? (
          <li>
            Who can propose:{' '}
            <span className='text-violet-500'>{proposerDescription}</span>
          </li>
        ) : null}
        {participation ? (
          <li>
            Who can vote:{' '}
            <span>
              {/* {participation.type === 'token'
                ? `Token holder`
                : `Other identity`} */}
              <span className='text-violet-500'>
                {renderParticipation(participation)}
              </span>
              <SideNote value={participationDescription} />
            </span>
          </li>
        ) : null}
        {isRTE(votingLocation) ? (
          <li>
            Location:
            <SideNote value={votingLocation} />
          </li>
        ) : null}
        {checkpoint?.duration ? (
          <li>
            Duration:{' '}
            <span className='text-violet-500'>
              {displayDuration(
                moment.duration((checkpoint?.duration || 0) * 1000)
              )}
            </span>
          </li>
        ) : null}
      </ul>
    </>
  );
};

export default GeneralInfo;
