type Props = {
  children?: JSX.Element;
};

const NoHeaderLayout = ({ children }: Props) => {
  return <div className={`w-full flex justify-center`}>{children}</div>;
};

export default NoHeaderLayout;
