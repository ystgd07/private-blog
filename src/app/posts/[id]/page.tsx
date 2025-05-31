"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  Send,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author?: string;
  image_url?: string;
  excerpt?: string;
  created_at: string;
  views: number;
}

interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPost();
      fetchComments();
      incrementViews();
    }
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", params.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const incrementViews = async () => {
    try {
      // RPC 함수를 사용하거나 직접 업데이트
      const { error } = await supabase.rpc("increment_views", {
        post_id: params.id,
      });

      if (error) {
        // RPC 함수가 없으면 직접 업데이트
        await supabase
          .from("posts")
          .update({ views: (post?.views || 0) + 1 })
          .eq("id", params.id);
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !authorName.trim()) {
      alert("이름과 댓글 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([
          {
            post_id: params.id,
            author_name: authorName,
            content: newComment,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // 댓글 목록에 추가
      setComments([data, ...comments]);
      setNewComment("");
      setAuthorName("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-lg'>로딩 중...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-lg'>포스트를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      {/* 헤더 이미지 */}
      {post.image_url && (
        <div className='relative h-[400px] w-full overflow-hidden'>
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />

          {/* 헤더 내용 */}
          <div className='absolute bottom-0 left-0 right-0 p-8'>
            <div className='max-w-5xl mx-auto'>
              <Badge className='mb-4 bg-white/20 text-white backdrop-blur-sm border-white/30'>
                {post.category}
              </Badge>
              <h1 className='text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg'>
                {post.title}
              </h1>
              <div className='flex items-center gap-6 text-white/90 text-sm'>
                <span className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  {new Date(post.created_at).toLocaleDateString("ko-KR")}
                </span>
                <span className='flex items-center gap-2'>
                  <Clock className='w-4 h-4' />
                  {Math.ceil(post.content.length / 500)}분 읽기
                </span>
                <span className='flex items-center gap-2'>
                  <Eye className='w-4 h-4' />
                  {post.views || 0} 조회
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 네비게이션 바 */}
      <div className='sticky top-0 bg-white/80 backdrop-blur-md border-b z-40'>
        <div className='max-w-5xl mx-auto px-4 py-3'>
          <Link href='/'>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              목록으로
            </Button>
          </Link>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className='max-w-4xl mx-auto mt-12 px-4'>
        {/* 본문 */}
        <div className='bg-white rounded-lg shadow-sm p-8 md:p-12'>
          {/* 헤더 이미지가 없는 경우 제목 표시 */}
          {!post.image_url && (
            <div className='mb-12 text-center'>
              <Badge className='mb-4 bg-purple-100 text-purple-700'>
                {post.category}
              </Badge>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
                {post.title}
              </h1>
              <p className='text-gray-600 mb-8'>
                {new Date(post.created_at).toLocaleDateString("ko-KR")}
              </p>
              <div className='flex items-center justify-center gap-6 text-gray-600 text-sm'>
                <span className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  {new Date(post.created_at).toLocaleDateString("ko-KR")}
                </span>
                <span className='flex items-center gap-2'>
                  <Clock className='w-4 h-4' />
                  {Math.ceil(post.content.length / 500)}분 읽기
                </span>
                <span className='flex items-center gap-2'>
                  <Eye className='w-4 h-4' />
                  {post.views || 0} 조회
                </span>
              </div>
            </div>
          )}

          {/* 본문 내용 */}
          <article className='prose prose-lg max-w-none mx-auto prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100'>
            <MDEditor.Markdown
              source={post.content}
              style={{
                backgroundColor: "transparent",
                color: "inherit",
              }}
            />
          </article>
        </div>

        {/* 댓글 섹션 */}
        <div className='bg-white rounded-lg shadow-sm p-8 md:p-12 mt-8'>
          <h2 className='text-2xl font-bold mb-8 flex items-center gap-2'>
            <MessageSquare className='w-6 h-6' />
            댓글 {comments.length}개
          </h2>

          {/* 댓글 작성 폼 */}
          <form onSubmit={handleCommentSubmit} className='mb-8 pb-8 border-b'>
            <div className='mb-4'>
              <Input
                type='text'
                placeholder='이름'
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className='mb-4'
                disabled={isSubmitting}
              />
              <Textarea
                placeholder='댓글을 작성해주세요...'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className='min-h-[100px] resize-none'
                disabled={isSubmitting}
              />
            </div>
            <div className='flex justify-end'>
              <Button
                type='submit'
                disabled={
                  isSubmitting || !newComment.trim() || !authorName.trim()
                }
                className='bg-purple-600 hover:bg-purple-700 text-white'
              >
                <Send className='mr-2 h-4 w-4' />
                {isSubmitting ? "작성 중..." : "댓글 작성"}
              </Button>
            </div>
          </form>

          {/* 댓글 목록 */}
          <div className='space-y-6'>
            {comments.length === 0 ? (
              <p className='text-center text-gray-500 py-8'>
                첫 번째 댓글을 작성해보세요!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className='border-b pb-6 last:border-0'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full' />
                    <div>
                      <p className='font-semibold text-gray-900'>
                        {comment.author_name}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {new Date(comment.created_at).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <p className='text-gray-700 ml-13'>{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
