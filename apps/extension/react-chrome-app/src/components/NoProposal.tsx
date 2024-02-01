const NoProposal = ({ className = '' }: { className?: string }) => {
  const paper = chrome.runtime.getURL('img/paper.png');
  return (
    <div
      className={`w-full flex flex-col items-center gap-6 ${
        className ? className : ''
      }`}
    >
      <img src={paper} alt='No proposal' width='183' height='127' />
      <div className='flex flex-col items-center gap-3'>
        <div className='text-gray-700 text-base'>No Proposal Available</div>
        <div className='text-gray-500 text-sm text-center'>
          Eager for New Ideas? Start creating your first proposal now!
        </div>
      </div>
    </div>
  );
};

export default NoProposal;
