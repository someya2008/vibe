export type Priority = 'high' | 'medium' | 'low'
export type TaskStatus = 'incomplete' | 'complete'

export interface Task {
  id: string
  title: string
  memo: string
  status: TaskStatus
  priority: Priority
  dueDate: string | null // ISO date string
  categoryId: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  color: string
  sortOrder: number
}

export interface Filters {
  status: TaskStatus | 'all'
  priority: Priority | 'all'
  categoryId: string | 'all'
  dueDateRange: 'all' | 'overdue' | 'today' | 'week'
  searchQuery: string
}
