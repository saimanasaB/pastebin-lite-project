import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { content, max_views, ttl_seconds } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const id = uuidv4();
    const data = {
      content,
      remaining_views: max_views ?? null,
      ttl_seconds: ttl_seconds ?? null,
    };

    // ✅ Make sure we're storing a stringified JSON, not an object
    await redis.set(`paste:${id}`, JSON.stringify(data));

    // Set expiry if ttl provided
    if (ttl_seconds) {
      await redis.expire(`paste:${id}`, ttl_seconds);
    }

    const baseUrl =
      process.env.VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    return NextResponse.json({
      id,
      url: `${baseUrl}/p/${id}`,
    });
  } catch (error) {
    console.error("Error creating paste:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
