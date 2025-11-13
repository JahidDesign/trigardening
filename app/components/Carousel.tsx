"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Carousel() {
  const slides = [
    {
      id: 1,
      image: "https://i.ibb.co.com/gZR8G95s/vecteezy-ai-generated-beautuful-gardening-background-with-copy-space-37245811.jpg",
      caption: "Nurture Your Green Paradise",
    },
    {
      id: 2,
      image: "https://i.ibb.co/7h3wb6H/updesh-raj-Em-H057p-Ql-E0-unsplash.jpg",
      caption: "Green Indoor Plants",
    },
    {
      id: 3,
      image: "https://i.ibb.co/bgY7MW3Y/vecteezy-gardening-tools-on-soil-background-ready-to-planting-flowers-20467173.jpg",
      caption: "Organic Fertilizers",
    },
    {
      id: 4,
      image: "https://i.ibb.co/Vc1L3RCR/vecteezy-elegant-white-flowers-with-orange-centers-flourishing-in-a-49092108.jpg",
      caption: "Beautiful Pots",
    },
    {
      id: 5,
      image: "https://i.ibb.co/Y7SwZ8wB/white-flower-blooms-in-green-grass-with-dark-background-photo.jpg",
      caption: "Easy-care Plants",
    },
  ];

  return (
    <Swiper
      modules={[Pagination, Autoplay, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      slidesPerView={1}
      loop
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      className="w-full"
    >
      {slides.map((s) => (
        <SwiperSlide key={s.id}>
          <div className="relative h-[420px] md:h-[560px] lg:h-[720px] w-full">
            <img
              src={s.image}
              alt={s.caption}
              className="absolute inset-0 w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-3xl px-6 md:px-16 text-white animate-fadeIn">
                <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">
                  {s.caption}
                </h2>
                <p className="mt-3 text-sm md:text-lg text-white/90">
                  Your slogan goes here
                </p>
                <div className="mt-6 flex gap-3">
                  <a
                    href="/shop"
                    className="bg-[#E58E26] px-5 py-2 rounded-full text-white font-medium hover:opacity-90 transition"
                  >
                    Shop Now
                  </a>
                  <a
                    href="tel:+123456789"
                    className="bg-white/20 px-5 py-2 rounded-full text-white hover:bg-white/30 transition"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
