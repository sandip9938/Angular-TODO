import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TodoPriority } from '../models/todo.model';
import { TodoService } from '../services/todo.service';

type TodoFilter = 'all' | 'active' | 'completed';

@Component({
  imports: [DatePipe],
  selector: 'app-to-do-list',
  styleUrl: './to-do-list.scss',
  templateUrl: './to-do-list.html',
})
export class ToDoList {
  newTodoTitle = '';
  newTodoPriority: TodoPriority = 'medium';
  newTodoDueDate = '';
  selectedFilter: TodoFilter = 'all';
  editingTodoId: number | null = null;
  editTodoTitle = '';
  editTodoPriority: TodoPriority = 'medium';
  editTodoDueDate = '';

  get todos() {
    return this.todoService.todos;
  }

  get activeTodoCount(): number {
    return this.todos().filter((todo) => !todo.completed).length;
  }

  get completedTodoCount(): number {
    return this.todos().filter((todo) => todo.completed).length;
  }

  get filteredTodos() {
    const todos = this.todos();

    switch (this.selectedFilter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }

  constructor(
    readonly authService: AuthService,
    private todoService: TodoService,
    private router: Router,
  ) {
    this.todoService.setUser(this.authService.currentUser()?.id ?? null);
  }

  addTodo(): void {
    this.todoService.addTodo(this.newTodoTitle, this.newTodoPriority, this.newTodoDueDate);
    this.newTodoTitle = '';
    this.newTodoPriority = 'medium';
    this.newTodoDueDate = '';
  }

  updatePriority(event: Event, editing: boolean): void {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;

    const value = target.value;
    if (value !== 'low' && value !== 'medium' && value !== 'high') return;

    if (editing) {
      this.editTodoPriority = value;
    } else {
      this.newTodoPriority = value;
    }
  }

  startEditing(id: number, title: string, priority: TodoPriority, dueDate?: string): void {
    this.editingTodoId = id;
    this.editTodoTitle = title;
    this.editTodoPriority = priority;
    this.editTodoDueDate = dueDate ?? '';
  }

  saveTodoEdit(): void {
    if (this.editingTodoId === null) return;

    if (
      this.todoService.updateTodo(
        this.editingTodoId,
        this.editTodoTitle,
        this.editTodoPriority,
        this.editTodoDueDate,
      )
    ) {
      this.cancelEditing();
    }
  }

  cancelEditing(): void {
    this.editingTodoId = null;
    this.editTodoTitle = '';
    this.editTodoPriority = 'medium';
    this.editTodoDueDate = '';
  }

  isOverdue(dueDate?: string): boolean {
    if (!dueDate) return false;

    const today = new Date();
    const todayDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-');
    return dueDate < todayDate;
  }

  toggleTodoCompletion(id: number): void {
    this.todoService.toggleTodoCompletion(id);
  }

  removeTodo(id: number): void {
    this.todoService.removeTodo(id);
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
    this.cancelEditing();
  }

  logout(): void {
    this.todoService.setUser(null);
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }
}
