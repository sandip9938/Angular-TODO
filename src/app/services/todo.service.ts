import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Todo, TodoPriority } from '../models/todo.model';

const STORAGE_KEY_PREFIX = 'my-app-angular-todos:';

type StoredTodo = Omit<Todo, 'priority'> & { priority?: TodoPriority };

function isDateOnly(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isStoredTodo(value: unknown): value is StoredTodo {
  if (typeof value !== 'object' || value === null) return false;

  const todo = value as Record<string, unknown>;
  return (
    typeof todo['id'] === 'number' &&
    Number.isFinite(todo['id']) &&
    typeof todo['title'] === 'string' &&
    typeof todo['completed'] === 'boolean' &&
    (todo['createdAt'] === undefined ||
      (typeof todo['createdAt'] === 'string' && Number.isFinite(Date.parse(todo['createdAt'])))) &&
    (todo['dueDate'] === undefined || isDateOnly(todo['dueDate'])) &&
    (todo['priority'] === undefined ||
      todo['priority'] === 'low' ||
      todo['priority'] === 'medium' ||
      todo['priority'] === 'high')
  );
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly platformId = inject(PLATFORM_ID);
  private _todos = signal<Todo[]>([]);
  private storageKey: string | null = null;
  private nextId = 1;

  get todos() {
    return this._todos.asReadonly();
  }

  setUser(email: string | null): void {
    this.storageKey = email
      ? `${STORAGE_KEY_PREFIX}${encodeURIComponent(email.trim().toLowerCase())}`
      : null;
    this._todos.set(this.storageKey ? this.loadTodos(this.storageKey) : []);
    this.nextId = Math.max(0, ...this._todos().map((todo) => todo.id)) + 1;
  }

  addTodo(title: string, priority: TodoPriority, dueDate: string): void {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTodo: Todo = {
      id: this.nextId++,
      title: trimmedTitle,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      ...(dueDate ? { dueDate } : {}),
    };
    this._todos.update((currentTodos) => [...currentTodos, newTodo]);
    this.saveTodos();
  }

  updateTodo(id: number, title: string, priority: TodoPriority, dueDate: string): boolean {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !this._todos().some((todo) => todo.id === id)) return false;

    this._todos.update((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? { ...todo, title: trimmedTitle, priority, dueDate: dueDate || undefined }
          : todo,
      ),
    );
    this.saveTodos();
    return true;
  }

  toggleTodoCompletion(id: number): void {
    this._todos.update((currentTodos) =>
      currentTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
    this.saveTodos();
  }

  removeTodo(id: number): void {
    this._todos.update((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    this.saveTodos();
  }

  clearCompleted(): void {
    if (!this._todos().some((todo) => todo.completed)) return;

    this._todos.update((currentTodos) => currentTodos.filter((todo) => !todo.completed));
    this.saveTodos();
  }

  private loadTodos(storageKey: string): Todo[] {
    if (!isPlatformBrowser(this.platformId)) return [];

    try {
      const storedTodos = localStorage.getItem(storageKey);
      if (storedTodos === null) return [];

      const parsedTodos: unknown = JSON.parse(storedTodos);
      if (!Array.isArray(parsedTodos) || !parsedTodos.every(isStoredTodo)) {
        throw new Error('Saved todo data has an invalid format.');
      }

      return parsedTodos.map((todo) => ({
        ...todo,
        priority: todo.priority ?? 'medium',
      }));
    } catch (error) {
      console.error('Could not load saved todos from localStorage.', error);
      return [];
    }
  }

  private saveTodos(): void {
    if (!isPlatformBrowser(this.platformId) || this.storageKey === null) return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this._todos()));
    } catch (error) {
      console.error('Could not save todos to localStorage.', error);
    }
  }
}
