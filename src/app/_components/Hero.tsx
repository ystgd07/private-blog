import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Hero() {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <section className='text-center py-16 mb-12 relative overflow-hidden max-w-6xl mx-auto'>
      <div className='absolute inset-0 bg-gradient-to-r from-red-100/50 to-orange-100/50 rounded-3xl'></div>
      <div className='relative z-10'>
        <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-purple-200'>
          <Image
            src='/logo.png'
            alt='logo'
            width={32}
            height={32}
            className='rounded-full'
          />
          <span className='text-sm font-medium text-purple-700'>
            안녕하세요 프론트엔드 엔지니어 양성수입니다.
          </span>
        </div>
        <p className='text-3xl md:text-5xl font-bold mb-6 text-gray-700'>
          Welcome to my blog
        </p>
        <p className='text-xl font-semibold text-slate-600 max-w-2xl mx-auto leading-relaxed'>
          주로 웹, 인프라에 관심을 갖고 있고,
        </p>
        <p className='text-xl font-semibold text-slate-600 max-w-2xl mx-auto leading-relaxed flex justify-center items-center'>
          프론트엔드 개발을 중심으로 내용을 공유하고자 합니다. 감사합니다.
          <span className='text-xl'>👋</span>
        </p>
        {isDevelopment && (
          <Link href='/write'>
            <Button
              size='lg'
              className='mt-4 cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
            >
              <PenSquare className='mr-2 h-5 w-5' />새 글 작성
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
