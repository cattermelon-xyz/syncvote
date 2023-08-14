const Debug = ({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const evn = import.meta.env.VITE_EVN;
  return evn === 'local' ? (
    <div
      className={`${className} absolute z-50 bottom-0 left-0 w-full min-h-[50px] bg-black text-white items-center justify-center flex opacity-30 flex-col`}
    >
      {children}
    </div>
  ) : null;
};

export default Debug;
