import { Input, Space } from 'antd';

type AllowedByTokenProps = {
  editable: boolean;
  address?: string;
  setAddress: (token: string) => void;
  min?: number;
  setMin: (min: number) => void;
};

const AllowedByToken = (props: AllowedByTokenProps) => {
  const {
    address, setAddress, min, setMin, editable,
  } = props;
  return (
    <Space direction="vertical" size="middle" className="w-full">
      <Space direction="vertical" size="small" className="w-full">
        <div className="text-sm">Token address</div>
        <Input
          placeholder="Token address"
          className="w-full"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={!editable}
        />
      </Space>
      <Space direction="vertical" size="small" className="w-full">
        <div className="text-sm">Minimum holding quantity (optional)</div>
        <Input
          type="number"
          className="w-full"
          value={min}
          onChange={(e) => setMin(parseInt(e.target.value, 10))}
          disabled={!editable}
        />
      </Space>
    </Space>
  );
};

export default AllowedByToken;
