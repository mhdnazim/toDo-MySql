"use client";

import { useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function fetchTodos() {
    try {
      const res = await fetch("/api/todos");
      if (res.ok) {
        const data = await res.json();
        setTodos(Array.isArray(data) ? data : []);
      }
    } catch {
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const title = input.trim();
    if (!title || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        const todo = await res.json();
        setTodos((prev) => [todo, ...prev]);
        setInput("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleTodo(id: number, completed: boolean) {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? updated : t))
        );
      }
    } catch {
      // ignore
    }
  }

  async function deleteTodo(id: number) {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      }
    } catch {
      // ignore
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-sky-400 mb-8">Todo</h1>

      <form onSubmit={addTodo} className="flex gap-2 mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !input.trim()}
          className="rounded-lg bg-sky-500 px-4 py-2.5 font-medium text-white hover:bg-sky-600 disabled:opacity-50 disabled:pointer-events-none"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-slate-400">No todos yet. Add one above.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3"
            >
              <button
                type="button"
                onClick={() => toggleTodo(todo.id, todo.completed)}
                className="flex-shrink-0 w-5 h-5 rounded border-2 border-slate-500 flex items-center justify-center hover:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
              >
                {todo.completed && (
                  <span className="text-sky-400 text-sm leading-none">✓</span>
                )}
              </button>
              <span
                className={
                  todo.completed
                    ? "flex-1 text-slate-500 line-through"
                    : "flex-1 text-slate-100"
                }
              >
                {todo.title}
              </span>
              <button
                type="button"
                onClick={() => deleteTodo(todo.id)}
                className="text-slate-400 hover:text-red-400 focus:outline-none"
                aria-label="Delete"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
