type Props = {
  children?: JSX.Element;
};

const NoHeaderAppLayout = ({ children }: Props): JSX.Element => {
  return (
    <div className={`w-full flex justify-center h-screen`}>{children}</div>
  );
};

export default NoHeaderAppLayout;
