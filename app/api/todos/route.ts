import { NextRequest, NextResponse } from "next/server";
import getPool, { query } from "@/lib/db";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: Date;
}

export async function GET() {
  try {
    const rows = await query<Todo[]>(
      "SELECT id, title, completed, created_at FROM todos ORDER BY created_at DESC"
    );
    return NextResponse.json(Array.isArray(rows) ? rows : [rows]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    const [insertResult] = await getPool().execute(
      "INSERT INTO todos (title, completed) VALUES (?, FALSE)",
      [title]
    );
    const insertId = (insertResult as { insertId: number }).insertId;
    const rows = await query<Todo[]>(
      "SELECT id, title, completed, created_at FROM todos WHERE id = ?",
      [insertId]
    );
    const todo = Array.isArray(rows) ? rows[0] : rows;
    return NextResponse.json(todo, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
