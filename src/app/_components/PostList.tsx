"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Eye, Heart, Sparkles } from "lucide-react";
import { Clock } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryColor } from "../_utils/categoryColors";

export default function PostList({
  posts,
  loading = false,
}: {
  posts: any[];
  loading?: boolean;
}) {
  const [displayCount, setDisplayCount] = useState(9);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 9);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isNewPost = (createdAt: string) => {
    const postDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - postDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 스켈레톤 UI 렌더링
  if (loading) {
    return (
      <section className='mb-12'>
        <div className='flex flex-wrap gap-4'>
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className='w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]'
            >
              <Card className='overflow-hidden border-0 shadow-lg bg-white/90 backdrop-blur-sm'>
                <Skeleton className='w-full h-32' />
                <CardContent className='p-4'>
                  <Skeleton className='h-6 w-16 mb-2' />
                  <Skeleton className='h-5 w-full mb-1' />
                  <Skeleton className='h-5 w-4/5 mb-3' />
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-4 w-12' />
                    <Skeleton className='h-4 w-12' />
                    <Skeleton className='h-4 w-16' />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      {posts.length > 0 && (
        <section className='mb-12 cursor-pointer'>
          <div className='flex flex-wrap gap-4'>
            {posts.slice(0, displayCount).map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className='block w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]'
              >
                <Card className='overflow-hidden border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group h-full'>
                  <div className='relative'>
                    <Image
                      src={post.image_url || "/JobSync_logo.png"}
                      alt={post.title}
                      width={500}
                      height={200}
                      className='w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
                    {isNewPost(post.created_at) && (
                      <Badge className='absolute top-3 left-3 bg-green-500 text-white border-0'>
                        <Sparkles className='w-3 h-3 mr-1' />
                        New
                      </Badge>
                    )}
                  </div>
                  <CardContent className='p-4'>
                    <Badge
                      className={`${getCategoryColor(
                        post.category
                      )} text-white border-0 mb-2 font-semibold`}
                    >
                      {post.category}
                    </Badge>
                    <h4 className='font-bold text-slate-800 mb-2 line-clamp-2'>
                      {post.title}
                    </h4>
                    <div className='flex items-center gap-4 text-xs text-slate-500'>
                      <div className='flex items-center gap-1'>
                        <Eye className='w-3 h-3' />
                        {post.views}
                      </div>

                      <div className='flex items-center gap-1'>
                        <Clock className='w-3 h-3' />
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {displayCount < posts.length && (
            <div className='flex justify-center mt-8'>
              <Button
                onClick={handleLoadMore}
                variant='outline'
                className='flex items-center gap-2 px-6 py-3 hover:bg-slate-50 transition-colors'
              >
                더 보기
                <ChevronDown className='w-4 h-4' />
              </Button>
            </div>
          )}
        </section>
      )}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className='fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg bg-slate-800 hover:bg-slate-700 text-white transition-all duration-300 z-50'
          size='icon'
        >
          <ChevronUp className='w-5 h-5' />
        </Button>
      )}
    </>
  );
}
