import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // 개발 환경 체크
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "이미지 업로드는 개발 환경에서만 가능합니다" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-images").getPublicUrl(filename);

    return NextResponse.json({
      url: publicUrl,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
  }
}
