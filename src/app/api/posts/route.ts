import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// 포스트 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");

    let query = supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "포스트 조회 실패" }, { status: 500 });
  }
}

// 포스트 작성
export async function POST(request: NextRequest) {
  try {
    // 개발 환경 체크
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "글 작성은 개발 환경에서만 가능합니다" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, category, image_url } = body;

    // excerpt 생성 (마크다운 제거 후 첫 150자)
    const plainText = content
      .replace(/[#*`\[\]()]/g, "")
      .replace(/\n{2,}/g, " ")
      .trim();

    const excerpt =
      plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          content,
          category,
          excerpt,
          image_url,
          author: "Sungsoo Yang",
          published: true,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "포스트 작성 실패" }, { status: 500 });
  }
}
