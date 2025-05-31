"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Eye, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [category, setCategory] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 개발 환경 체크
  const isDevelopment = process.env.NODE_ENV === "development";

  // 개발 환경이 아니면 홈으로 리다이렉트
  if (!isDevelopment) {
    router.push("/");
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>접근 권한이 없습니다</h1>
          <p className='text-gray-600 mb-4'>
            글 작성은 개발 환경에서만 가능합니다.
          </p>
          <Link href='/'>
            <Button>홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 이미지 업로드 핸들러
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.url) {
        const imageMarkdown = `![image](${data.url})`;
        const newContent = content
          ? `${content}\n\n${imageMarkdown}\n`
          : imageMarkdown;
        setContent(newContent);

        // 첫 번째 이미지를 대표 이미지로 설정
        if (!imageUrl) {
          setImageUrl(data.url);
        }
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }
      handleImageUpload(file);
    }
  };

  // 붙여넣기 이벤트 핸들러
  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            handleImageUpload(file);
          }
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !category) {
      alert("제목, 내용, 카테고리를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category,
          image_url: imageUrl, // 대표 이미지 URL 추가
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("포스트가 성공적으로 발행되었습니다!");
        router.push("/");
      } else {
        throw new Error(data.error || "포스트 작성 실패");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("포스트 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-5xl mx-auto py-8 px-4'>
        {/* 헤더 */}
        <div className='flex items-center justify-between mb-8'>
          <Link href='/'>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              돌아가기
            </Button>
          </Link>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsPreview(!isPreview)}
            >
              <Eye className='mr-2 h-4 w-4' />
              {isPreview ? "편집" : "미리보기"}
            </Button>
            <Button
              size='sm'
              onClick={handleSubmit}
              disabled={!title || !content || !category || isSubmitting}
              className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            >
              <Save className='mr-2 h-4 w-4' />
              {isSubmitting ? "발행 중..." : "발행"}
            </Button>
          </div>
        </div>

        {/* 에디터 영역 */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* 제목 입력 */}
          <Input
            type='text'
            placeholder='제목을 입력하세요'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='text-3xl font-bold border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus:border-purple-600 transition-colors'
          />

          {/* 카테고리 선택 */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='w-full p-3 border-2 rounded-lg focus:border-purple-600 transition-colors outline-none'
          >
            <option value=''>카테고리 선택</option>
            <option value='JobSync'>JobSync</option>
            <option value='React.js'>React.js</option>
            <option value='Next.js'>Next.js</option>
            <option value='TypeScript'>TypeScript</option>
            <option value='Design'>Design</option>
            <option value='Infra'>Infra</option>
          </select>

          {/* 이미지 업로드 버튼 */}
          <div className='flex items-center gap-4'>
            <input
              type='file'
              id='image-upload'
              accept='image/*'
              onChange={handleFileSelect}
              className='hidden'
            />
            <label htmlFor='image-upload'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                disabled={isUploading}
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <ImageIcon className='mr-2 h-4 w-4' />
                {isUploading ? "업로드 중..." : "이미지 업로드"}
              </Button>
            </label>
            <span className='text-sm text-gray-500'>
              또는 이미지를 복사하여 에디터에 붙여넣기 (Ctrl+V)
            </span>
          </div>

          {/* 마크다운 에디터 */}
          <div
            className='border-2 rounded-lg overflow-hidden'
            onPaste={handlePaste}
          >
            <MDEditor
              value={content}
              onChange={setContent}
              preview={isPreview ? "preview" : "edit"}
              height={600}
              data-color-mode='light'
              visibleDragbar={false}
              textareaProps={{
                placeholder:
                  '마크다운으로 내용을 작성하세요...\n\n## 제목\n- 리스트\n**굵은 글씨**\n*기울임*\n`코드`\n```js\nconst hello = "world";\n```',
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
