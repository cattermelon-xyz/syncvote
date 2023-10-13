type Props = {
  content: string;
  title: string;
};
const ContentSlide = ({ content, title }: Props) => (
  <div className=" flex flex-col justify-center items-center ">
    <div className="text-grey-version-7 font-semibold text-text_5 leading-7 w-[390px]">{title}</div>
    <div className="text-grey-version-7 w-[390px] h-full leading-7 pt-[21px] flex items-center tracking-[0.35px] text-text_5 font-medium  ">
      {content}
    </div>
  </div>
);
export default ContentSlide;
