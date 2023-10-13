type Props = {
  w?: string;
  h?: string;
};

const XCircle = ({ w = '41', h = '42' }: Props) => (
  <svg width={w} height={h} viewBox="0 0 41 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M26.299 15.3555L14.9902 26.6642"
      stroke="#252422"
      strokeWidth="1.88479"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.9902 15.3555L26.299 26.6642"
      stroke="#252422"
      strokeWidth="1.88479"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="0.854499"
      y="1.21973"
      width="39.5805"
      height="39.5805"
      rx="19.7903"
      stroke="#BBBBBA"
      strokeWidth="1.13087"
    />
  </svg>
);

export default XCircle;
