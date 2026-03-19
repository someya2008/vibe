import { useTodoStore } from '../store'
import type { Task } from '../types'

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, taskId: string) => void
}

const priorityConfig = {
  high: { label: '高', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  medium: {
    label: '中',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  low: {
    label: '低',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
}

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false
  return dueDate < new Date().toISOString().split('T')[0]
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
}

export function TaskItem({ task, onEdit, onDragStart, onDragOver, onDrop }: TaskItemProps) {
  const { toggleTaskStatus, deleteTask, categories } = useTodoStore()
  const category = categories.find((c) => c.id === task.categoryId)
  const overdue = task.status === 'incomplete' && isOverdue(task.dueDate)
  const priority = priorityConfig[task.priority]

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.id)}
      className={`group flex items-start gap-3 p-3 sm:p-4 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
        task.status === 'complete'
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
          : overdue
            ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
      }`}
    >
      <button
        onClick={() => toggleTaskStatus(task.id)}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.status === 'complete'
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
        }`}
      >
        {task.status === 'complete' && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm sm:text-base font-medium cursor-pointer ${
              task.status === 'complete'
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {task.title}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priority.className}`}>
            {priority.label}
          </span>
          {category && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          )}
        </div>
        {task.memo && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
            {task.memo}
          </p>
        )}
        {task.dueDate && (
          <p
            className={`text-xs mt-1 ${
              overdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {overdue ? '⚠ 期限切れ: ' : '締切: '}
            {formatDate(task.dueDate)}
          </p>
        )}
      </div>

      <button
        onClick={() => deleteTask(task.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
        title="削除"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  )
}
