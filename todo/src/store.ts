import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Task, Category, Filters, Priority, TaskStatus } from './types'

const TASKS_KEY = 'mytodo-tasks'
const CATEGORIES_KEY = 'mytodo-categories'
const THEME_KEY = 'mytodo-theme'

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

const defaultCategories: Category[] = [
  { id: 'cat-work', name: '仕事', color: '#3b82f6', sortOrder: 0 },
  { id: 'cat-personal', name: 'プライベート', color: '#10b981', sortOrder: 1 },
  { id: 'cat-study', name: '学習', color: '#f59e0b', sortOrder: 2 },
]

interface TodoStore {
  tasks: Task[]
  categories: Category[]
  filters: Filters
  darkMode: boolean

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder'>) => void
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void
  deleteTask: (id: string) => void
  toggleTaskStatus: (id: string) => void
  reorderTasks: (taskId: string, newIndex: number) => void

  // Category actions
  addCategory: (name: string, color: string) => void
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void
  deleteCategory: (id: string) => void

  // Filter actions
  setFilter: (filter: Partial<Filters>) => void
  resetFilters: () => void

  // Theme
  toggleDarkMode: () => void

  // Export
  exportData: () => string
}

const defaultFilters: Filters = {
  status: 'all',
  priority: 'all',
  categoryId: 'all',
  dueDateRange: 'all',
  searchQuery: '',
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  tasks: loadFromStorage<Task[]>(TASKS_KEY, []),
  categories: loadFromStorage<Category[]>(CATEGORIES_KEY, defaultCategories),
  filters: defaultFilters,
  darkMode: loadFromStorage<boolean>(THEME_KEY, false),

  addTask: (taskData) => {
    const now = new Date().toISOString()
    const tasks = get().tasks
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      sortOrder: tasks.length,
      createdAt: now,
      updatedAt: now,
    }
    const updated = [...tasks, newTask]
    saveToStorage(TASKS_KEY, updated)
    set({ tasks: updated })
  },

  updateTask: (id, updates) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    )
    saveToStorage(TASKS_KEY, tasks)
    set({ tasks })
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter((t) => t.id !== id)
    saveToStorage(TASKS_KEY, tasks)
    set({ tasks })
  },

  toggleTaskStatus: (id) => {
    const tasks = get().tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            status: (t.status === 'complete' ? 'incomplete' : 'complete') as TaskStatus,
            updatedAt: new Date().toISOString(),
          }
        : t
    )
    saveToStorage(TASKS_KEY, tasks)
    set({ tasks })
  },

  reorderTasks: (taskId, newIndex) => {
    const tasks = [...get().tasks]
    const oldIndex = tasks.findIndex((t) => t.id === taskId)
    if (oldIndex === -1) return
    const [moved] = tasks.splice(oldIndex, 1)
    tasks.splice(newIndex, 0, moved)
    const reordered = tasks.map((t, i) => ({ ...t, sortOrder: i }))
    saveToStorage(TASKS_KEY, reordered)
    set({ tasks: reordered })
  },

  addCategory: (name, color) => {
    const categories = get().categories
    const newCat: Category = {
      id: uuidv4(),
      name,
      color,
      sortOrder: categories.length,
    }
    const updated = [...categories, newCat]
    saveToStorage(CATEGORIES_KEY, updated)
    set({ categories: updated })
  },

  updateCategory: (id, updates) => {
    const categories = get().categories.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    )
    saveToStorage(CATEGORIES_KEY, categories)
    set({ categories })
  },

  deleteCategory: (id) => {
    const categories = get().categories.filter((c) => c.id !== id)
    saveToStorage(CATEGORIES_KEY, categories)
    // Remove category from tasks
    const tasks = get().tasks.map((t) =>
      t.categoryId === id ? { ...t, categoryId: null, updatedAt: new Date().toISOString() } : t
    )
    saveToStorage(TASKS_KEY, tasks)
    set({ categories, tasks })
  },

  setFilter: (filter) => {
    set({ filters: { ...get().filters, ...filter } })
  },

  resetFilters: () => {
    set({ filters: defaultFilters })
  },

  toggleDarkMode: () => {
    const darkMode = !get().darkMode
    saveToStorage(THEME_KEY, darkMode)
    set({ darkMode })
  },

  exportData: () => {
    const { tasks, categories } = get()
    return JSON.stringify({ tasks, categories, exportedAt: new Date().toISOString() }, null, 2)
  },
}))

// Helper to get filtered tasks
export function getFilteredTasks(tasks: Task[], filters: Filters, searchQuery?: string): Task[] {
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  return tasks
    .filter((task) => {
      if (filters.status !== 'all' && task.status !== filters.status) return false
      if (filters.priority !== 'all' && task.priority !== (filters.priority as Priority))
        return false
      if (filters.categoryId !== 'all' && task.categoryId !== filters.categoryId) return false

      if (filters.dueDateRange !== 'all') {
        if (!task.dueDate) return false
        const due = task.dueDate
        switch (filters.dueDateRange) {
          case 'overdue':
            if (due >= todayStr) return false
            break
          case 'today':
            if (due !== todayStr) return false
            break
          case 'week':
            if (due > weekFromNow || due < todayStr) return false
            break
        }
      }

      const query = (searchQuery ?? filters.searchQuery).toLowerCase()
      if (query) {
        const inTitle = task.title.toLowerCase().includes(query)
        const inMemo = task.memo.toLowerCase().includes(query)
        if (!inTitle && !inMemo) return false
      }

      return true
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)
}
