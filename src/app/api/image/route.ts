import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get("src"); // 获取查询参数中的 src

  if (!src) {
    // 如果 src 参数不存在，返回 400 错误
    return NextResponse.json({ error: 'Missing "src" query parameter' }, { status: 400 });
  }

  // 构造图片文件的绝对路径
  const filePath = path.join(process.cwd(), "src", "notes", decodeURIComponent(src));

  try {
    // 检查文件是否存在并读取
    const file = await fs.readFile(filePath);

    // 根据文件扩展名设置 MIME 类型
    const contentType = src.endsWith(".png")
      ? "image/png"
      : src.endsWith(".jpg") || src.endsWith(".jpeg")
        ? "image/jpeg"
        : "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);

    // 如果文件未找到或读取失败，返回 404 错误
    return NextResponse.json({ error: "Image not found or inaccessible" }, { status: 404 });
  }
}
