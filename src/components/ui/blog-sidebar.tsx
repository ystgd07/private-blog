"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Home,
  Code,
  Palette,
  Zap,
  ChevronLeft,
  ChevronRight,
  FileUser,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import Image from "next/image";
import { Post } from "@/lib/supabase";

const navigation = [{ name: "홈", href: "/", icon: Home }];

const categories = [
  {
    name: "JobSync",
    href: "/category/development",
    icon: Code,
    count: 12,
    color: "group-hover:bg-orange-500",
    hoverBgClass: "hover:bg-orange-100",
    hoverTextColor: "group-hover:text-orange-500",
    img: (
      <Image
        src='/JobSync_logo.png'
        alt='category_logo'
        width={30}
        height={30}
      />
    ),
  },
  {
    name: "React.js",
    href: "/category/react",
    icon: Palette,
    count: 8,
    color: "group-hover:bg-blue-500",
    hoverBgClass: "hover:bg-blue-100",
    hoverTextColor: "group-hover:text-blue-500",
    img: (
      <Image
        src='https://skillicons.dev/icons?i=react'
        alt='category_logo'
        width={30}
        height={30}
      />
    ),
  },
  {
    name: "Nest.js",
    href: "/category/nestjs",
    icon: Zap,
    count: 6,
    color: "group-hover:bg-red-500",
    hoverBgClass: "hover:bg-red-100",
    hoverTextColor: "group-hover:text-red-500",
    img: (
      <Image
        src='https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NestJS-Dark.svg'
        alt='category_logo'
        width={30}
        height={30}
      />
    ),
  },
  {
    name: "TypeScript",
    href: "/category/typescript",
    icon: Code,
    count: 4,
    color: "group-hover:bg-blue-500",
    hoverBgClass: "hover:bg-blue-100",
    hoverTextColor: "group-hover:text-blue-500",
    img: (
      <Image
        src='https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TypeScript.svg'
        alt='category_logo'
        width={30}
        height={30}
      />
    ),
  },
  {
    name: "Next.js",
    href: "/category/nextjs",
    icon: Code,
    count: 4,
    color: "group-hover:bg-gray-500",
    hoverBgClass: "hover:bg-gray-200",
    hoverTextColor: "group-hover:text-gray-900",
    img: (
      <Image
        src='https://skillicons.dev/icons?i=nextjs'
        alt='category_logo'
        width={30}
        height={30}
      />
    ),
  },
  {
    name: "Design",
    href: "/category/design",
    icon: Code,
    count: 4,
    color: "group-hover:bg-blue-500",
    hoverBgClass: "hover:bg-sky-100",
    hoverTextColor: "group-hover:text-blue-500",
    img: (
      <Image
        src='https://skillicons.dev/icons?i=css'
        alt='category_logo'
        width={30}
        height={30}
      />
    ),
  },
  {
    name: "Infra",
    href: "/category/infra",
    icon: Code,
    count: 4,
    color: "group-hover:bg-orange-500",
    hoverBgClass: "hover:bg-yellow-100",
    hoverTextColor: "group-hover:text-orange-500",
    img: (
      <Image
        src='https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/AWS-Dark.svg'
        alt='category_logo'
        width={30}
        height={30}
      />
    ),
  },
];

interface BlogSidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
  posts: Post[];
}
export function BlogSidebar({ onCollapsedChange, posts }: BlogSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 모바일에서는 기본적으로 접힌 상태로 시작
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  // collapsed 상태가 변경될 때 부모에게 알림
  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const categoryCounts = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-white to-slate-50/50 border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-50 ${
        collapsed ? "w-16" : "w-80"
      }`}
    >
      {/* Header */}
      <div className='flex flex-col border-b border-slate-100 pb-2'>
        <div className='p-4 flex-shrink-0 flex items-center justify-between'>
          {!collapsed && (
            <div className='flex items-center space-x-3'>
              <Image
                src='/logo.png'
                alt='logo'
                width={40}
                height={40}
                className='rounded-xl'
              />
              <div>
                <h2 className='font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                  Sungsoo Yang 블로그
                </h2>
                <p className='text-xs text-slate-500'>프론트엔드 엔지니어</p>
              </div>
            </div>
          )}

          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 rounded-full hover:bg-purple-100'
            onClick={handleToggle}
          >
            {collapsed ? (
              <ChevronRight className='h-4 w-4' />
            ) : (
              <ChevronLeft className='h-4 w-4' />
            )}
          </Button>
        </div>
        {!collapsed && (
          <>
            <div className='text-sm text-slate-500 px-4'>Contact</div>
            <div className='flex items-center gap-5 p-2 pl-3 text-xs text-slate-500'>
              <Link
                href='https://github.com/ystgd07?tab=repositories'
                target='_blank'
              >
                <Image
                  src='https://skillicons.dev/icons?i=github'
                  alt='github'
                  width={38}
                  height={38}
                  className='rounded-full'
                />
              </Link>

              <Link href='mailto:sungsoo.yang@gmail.com'>
                <Image
                  src='https://skillicons.dev/icons?i=gmail'
                  alt='gmail'
                  width={38}
                  height={38}
                  className='rounded-full'
                />
              </Link>
              <Link
                href='https://portfolio-page-ten-beige.vercel.app/'
                target='_blank'
              >
                <FileUser className='w-[38px] h-[38px] rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-1' />
              </Link>
            </div>
          </>
        )}
      </div>
      {/* Content */}
      <div className='p-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent'>
        {/* Navigation */}
        <div className='mb-6'>
          <div className='space-y-1'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors text-slate-700 ${
                  collapsed ? "justify-center" : ""
                }`}
                title={collapsed ? item.name : ""}
              >
                <item.icon className='w-5 h-5' />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className='mb-6'>
          {!collapsed && (
            <h3 className='text-slate-600 font-semibold mb-3 text-md uppercase tracking-wide px-2'>
              카테고리
            </h3>
          )}
          <div className='space-y-1'>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`group flex items-center px-3 py-2 rounded-lg transition-colors text-slate-700 ${
                  collapsed ? "justify-center" : "justify-between"
                } ${category.hoverBgClass}`}
                title={collapsed ? category.name : ""}
              >
                <div className='flex items-center gap-3 text-md'>
                  {category.img}
                  {!collapsed && (
                    <span
                      className={`transition-colors ${category.hoverTextColor}`}
                    >
                      {category.name}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <Badge variant='secondary' className='text-xs'>
                    {categoryCounts[category.name] || 0}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
