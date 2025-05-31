"use client";

import { BlogSidebar } from "@/components/ui/blog-sidebar";
import { useState, useCallback, useEffect } from "react";
import Hero from "./_components/Hero";
import Categories from "./_components/Categories";
import PostList from "./_components/PostList";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const { data } = await response.json();

      if (data) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarCollapsedChange = useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const categoryCounts = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  categoryCounts["All"] = posts.length;

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50'>
      <BlogSidebar
        onCollapsedChange={handleSidebarCollapsedChange}
        posts={posts}
      />
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-16" : "md:ml-80"
        } ml-0`}
      >
        <main className='flex-1 px-6 py-8 overflow-auto'>
          <Hero />
          <Categories
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categoryCounts={categoryCounts}
          />
          <PostList posts={filteredPosts} loading={loading} />
        </main>
      </div>
    </div>
  );
}
