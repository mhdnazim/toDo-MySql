import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: Date;
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(id, 10);
    if (Number.isNaN(todoId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const body = await _request.json();
    if (typeof body.completed === "boolean") {
      await query("UPDATE todos SET completed = ? WHERE id = ?", [
        body.completed,
        todoId,
      ]);
    }
    const rows = await query<Todo[]>(
      "SELECT id, title, completed, created_at FROM todos WHERE id = ?",
      [todoId]
    );
    const todo = Array.isArray(rows) ? rows[0] : rows;
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    return NextResponse.json(todo);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(id, 10);
    if (Number.isNaN(todoId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await query("DELETE FROM todos WHERE id = ?", [todoId]);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
