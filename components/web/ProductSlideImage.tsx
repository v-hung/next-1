'use client';
import { useRef, useEffect } from 'react';
import { register } from 'swiper/element/bundle';
register()

const ProductSlideImage = ({ images }: { images: string[] }) => {
  const swiperElRef = useRef<any>(null);

  useEffect(() => {
    // listen for Swiper events using addEventListener
    swiperElRef.current.addEventListener('progress', (e: any) => {
      const [swiper, progress] = e.detail;
      // console.log(progress);
    });

    swiperElRef.current.addEventListener('slidechange', (e: any) => {
      // console.log('slide changed');
    });
  }, []);
  return (
    <swiper-container
      ref={swiperElRef}
      slides-per-view="1"
      loop={true}
      navigation={true}
      pagination={true}
      autoHeight={true}
    >
      {images.map((v,i) =>
        <swiper-slide key={i}>
          <img src={v} />
        </swiper-slide>
      )}
    </swiper-container>
  );
};

export default ProductSlideImage;
