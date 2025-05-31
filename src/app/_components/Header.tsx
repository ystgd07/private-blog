import { Button } from "@/components/ui/button";
import { Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header({
  showMobileSidebar,
  setShowMobileSidebar,
}: {
  showMobileSidebar: boolean;
  setShowMobileSidebar: (show: boolean) => void;
}) {
  return (
    <header className='border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40 shadow-sm'>
      <div className='px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            {/* 모바일 메뉴 토글 버튼 */}
            <Button
              variant='ghost'
              size='sm'
              className='h-10 w-10 p-0 rounded-full md:hidden'
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              <Menu className='h-5 w-5' />
            </Button>

            <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center'>
              <Image
                src='/logo.png'
                alt='logo'
                width={40}
                height={40}
                className='rounded-xl'
              />
            </div>
            <div>
              <h1 className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                Sungsoo Yang 블로그
              </h1>
              <p className='text-sm text-muted-foreground'>
                프론트엔드 엔지니어
              </p>
            </div>
          </div>
          <nav className='hidden md:flex items-center space-x-6'>
            <Link
              href='/'
              className='text-foreground hover:text-purple-600 transition-colors font-medium'
            >
              Home
            </Link>
            <Link
              href='/about'
              className='text-muted-foreground hover:text-purple-600 transition-colors'
            >
              About
            </Link>
            <Link
              href='/contact'
              className='text-muted-foreground hover:text-purple-600 transition-colors'
            >
              Contact
            </Link>
            <Button className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'>
              Subscribe
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
