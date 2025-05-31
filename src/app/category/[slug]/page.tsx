"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BlogSidebar } from "@/components/ui/blog-sidebar";
import { CalendarDays, Clock, Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, use, useEffect } from "react";
import { Post } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

// 카테고리 슬러그와 DB 카테고리 매핑
const categoryMapping: Record<string, string> = {
  development: "JobSync",
  react: "React",
  nestjs: "NestJS",
  typescript: "TypeScript",
  nextjs: "NextJS",
  design: "디자인",
  infra: "인프라",
};

// 카테고리 메타데이터
const categoryData = {
  development: {
    name: "JobSync",
    description: "JobSync 프로젝트 관련 개발 글들을 모아놨습니다.",
    icon: "/JobSync_logo.png",
    color: "bg-orange-500",
    lightColor: "bg-orange-100",
    textColor: "text-orange-600",
  },
  react: {
    name: "React.js",
    description: "React.js 개발 팁과 Best Practice를 공유합니다.",
    icon: "https://skillicons.dev/icons?i=react",
    color: "bg-blue-500",
    lightColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  nestjs: {
    name: "Nest.js",
    description: "Nest.js를 활용한 백엔드 개발 경험을 공유합니다.",
    icon: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NestJS-Dark.svg",
    color: "bg-red-500",
    lightColor: "bg-red-100",
    textColor: "text-red-600",
  },
  typescript: {
    name: "TypeScript",
    description: "TypeScript로 더 안전한 코드를 작성하는 방법을 다룹니다.",
    icon: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TypeScript.svg",
    color: "bg-blue-500",
    lightColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  nextjs: {
    name: "Next.js",
    description: "Next.js를 활용한 풀스택 웹 개발 경험을 공유합니다.",
    icon: "https://skillicons.dev/icons?i=nextjs",
    color: "bg-gray-900",
    lightColor: "bg-gray-100",
    textColor: "text-gray-900",
  },
  design: {
    name: "Design",
    description: "UI/UX 디자인과 CSS 관련 팁을 공유합니다.",
    icon: "https://skillicons.dev/icons?i=css",
    color: "bg-sky-500",
    lightColor: "bg-sky-100",
    textColor: "text-sky-600",
  },
  infra: {
    name: "Infra",
    description: "AWS와 인프라 관련 경험을 공유합니다.",
    icon: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/AWS-Dark.svg",
    color: "bg-orange-500",
    lightColor: "bg-yellow-100",
    textColor: "text-orange-600",
  },
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const category = categoryData[slug as keyof typeof categoryData];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const dbCategory = categoryMapping[slug] || slug;
        const response = await fetch(`/api/posts?category=${dbCategory}`);
        const { data } = await response.json();
        setPosts(data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchPosts();
    }
  }, [slug, category]);

  const handleSidebarCollapsedChange = useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  }, []);

  if (!category) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50'>
        <BlogSidebar
          onCollapsedChange={handleSidebarCollapsedChange}
          posts={posts}
        />
        <div
          className={`flex items-center justify-center min-h-screen transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-16" : "md:ml-80"
          } ml-0`}
        >
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-800 mb-4'>404</h1>
            <p className='text-gray-600 mb-8'>카테고리를 찾을 수 없습니다.</p>
            <Link href='/' className='text-purple-600 hover:underline'>
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50'>
      <BlogSidebar
        onCollapsedChange={handleSidebarCollapsedChange}
        posts={posts}
      />
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-16" : "md:ml-80"
        } ml-0`}
      >
        {/* 카테고리 헤더 */}
        <div className={`${category.color} bg-opacity-10`}>
          <div className='max-w-6xl mx-auto px-4 py-16'>
            <div className='flex items-center gap-6 mb-6'>
              <div className={`p-4 rounded-2xl ${category.lightColor}`}>
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={60}
                  height={60}
                  className='rounded-lg'
                />
              </div>
              <div>
                <h1 className='text-4xl font-bold text-white mb-2'>
                  {category.name}
                </h1>
                <p className='text-lg text-white'>{category.description}</p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <Badge variant='secondary' className='text-sm'>
                {posts.length}개의 글
              </Badge>
            </div>
          </div>
        </div>

        {/* 포스트 목록 */}
        <div className='max-w-6xl mx-auto px-6 py-8'>
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(6)].map((_, index) => (
                <Card key={index} className='h-full'>
                  <Skeleton className='h-48 w-full rounded-t-lg' />
                  <CardHeader>
                    <Skeleton className='h-6 w-3/4 mb-2' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-5/6' />
                  </CardHeader>
                  <CardContent>
                    <div className='flex gap-2'>
                      <Skeleton className='h-6 w-16' />
                      <Skeleton className='h-6 w-20' />
                      <Skeleton className='h-6 w-24' />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className='h-4 w-full' />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className='text-center py-20'>
              <p className='text-gray-500 text-lg'>
                아직 작성된 글이 없습니다.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`}>
                  <Card className='h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer'>
                    <div className='relative h-48 overflow-hidden rounded-t-lg'>
                      <Image
                        src={
                          post.image_url ||
                          `https://source.unsplash.com/400x300/?${post.category},programming`
                        }
                        alt={post.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className='line-clamp-2'>
                        {post.title}
                      </CardTitle>
                      <CardDescription className='line-clamp-2'>
                        {post.excerpt || ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='flex flex-wrap gap-2'>
                        <Badge variant='outline' className={category.textColor}>
                          {post.category}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className='text-sm text-gray-500'>
                      <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center gap-4'>
                          <span className='flex items-center gap-1'>
                            <CalendarDays className='w-4 h-4' />
                            {new Date(post.created_at || "").toLocaleDateString(
                              "ko-KR"
                            )}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Clock className='w-4 h-4' />
                            {Math.ceil((post.content?.length || 0) / 500)}분
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <span className='flex items-center gap-1'>
                            <Eye className='w-4 h-4' />
                            {post.views || 0}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Heart className='w-4 h-4' />0
                          </span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
