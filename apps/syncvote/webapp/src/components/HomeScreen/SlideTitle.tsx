import { Autoplay, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import ContentSlide from './ContentSlide';
import './Style.scss';

const dataSlides = [
  {
    id: 1,
    title: 'Tips #1',
    content:
      'Regularly review the workflows to ensure that it is up-to-date with the current needs.',
  },
  {
    id: 2,
    title: 'Tips #2',
    content: 'Using an enforcer as a final action according to the voting result.',
  },
  {
    id: 3,
    title: 'Tips #3',
    content:
      'There are 4 voting methods. Each method has its own characteristic, read the definition carefully in order to choose the appropriate one',
  },
];
const SlideTitle = () => (
  <div className="pt-[20px]">
    <Swiper
      pagination={{
        clickable: true,
      }}
      grabCursor
      freeMode
      slidesPerView={1}
      modules={[Pagination, Autoplay]}
      loop
      autoplay={{
        delay: 7000,
        disableOnInteraction: false,
      }}
      className="slideTitle "
    >
      {dataSlides.map((item) => (
        <SwiperSlide key={item.id}>
          <ContentSlide title={item.title} content={item.content} />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default SlideTitle;
