import { useState, useEffect, useCallback } from 'react'
import { useTodoStore, getFilteredTasks } from './store'
import { Header } from './components/Header'
import { FilterBar } from './components/FilterBar'
import { TaskItem } from './components/TaskItem'
import { TaskForm } from './components/TaskForm'
import { CategoryManager } from './components/CategoryManager'
import type { Task } from './types'

function App() {
  const { tasks, filters, darkMode, reorderTasks } = useTodoStore()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)

  const filteredTasks = getFilteredTasks(tasks, filters)

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Keyboard shortcut: Ctrl+N for new task
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        setShowTaskForm(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setShowTaskForm(false)
    setEditingTask(null)
  }, [])

  const handleDragStart = useCallback((_e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, targetTaskId: string) => {
      e.preventDefault()
      if (!draggedTaskId || draggedTaskId === targetTaskId) return
      const targetIndex = filteredTasks.findIndex((t) => t.id === targetTaskId)
      if (targetIndex !== -1) {
        reorderTasks(draggedTaskId, targetIndex)
      }
      setDraggedTaskId(null)
    },
    [draggedTaskId, filteredTasks, reorderTasks]
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        onNewTask={() => setShowTaskForm(true)}
        onManageCategories={() => setShowCategoryManager(true)}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <FilterBar />

        <div className="mt-4 space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {tasks.length === 0
                  ? 'タスクがありません。新しいタスクを追加しましょう！'
                  : 'フィルター条件に一致するタスクがありません'}
              </p>
              {tasks.length === 0 && (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  最初のタスクを追加
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))
          )}
        </div>

        {filteredTasks.length > 0 && (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
            {filteredTasks.length} 件のタスクを表示中
            {filteredTasks.length !== tasks.length && ` / 全 ${tasks.length} 件`}
          </p>
        )}
      </main>

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-400 dark:text-gray-600 hidden sm:block">
        Ctrl+N: 新規タスク
      </div>

      {/* Modals */}
      {showTaskForm && <TaskForm task={editingTask} onClose={handleCloseForm} />}
      {showCategoryManager && (
        <CategoryManager onClose={() => setShowCategoryManager(false)} />
      )}
    </div>
  )
}

export default App
