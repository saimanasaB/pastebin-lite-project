import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const paste = await redis.get(`paste:${id}`);

    // 🧠 If redis.get returns an object (not string), handle it gracefully
    const data =
      typeof paste === "string"
        ? JSON.parse(paste)
        : typeof paste === "object"
        ? paste
        : null;

    if (!data) {
      return NextResponse.json({ error: "Paste not found or expired." }, { status: 404 });
    }

    // Handle view limits
    if (data.remaining_views !== null) {
      data.remaining_views -= 1;
      if (data.remaining_views <= 0) {
        await redis.del(`paste:${id}`);
      } else {
        await redis.set(`paste:${id}`, JSON.stringify(data));
      }
    }

    return NextResponse.json({ content: data.content });
  } catch (error) {
    console.error("Error fetching paste:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
