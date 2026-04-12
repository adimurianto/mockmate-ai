import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const text = await callGroq(messages);

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Groq error" },
      { status: 500 }
    );
  }
}