import { useTodoStore } from '../store'
import type { Priority, TaskStatus } from '../types'

export function FilterBar() {
  const { filters, setFilter, resetFilters, categories } = useTodoStore()

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => setFilter({ searchQuery: e.target.value })}
          placeholder="タスクを検索..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filters.status}
          onChange={(e) => setFilter({ status: e.target.value as TaskStatus | 'all' })}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">すべてのステータス</option>
          <option value="incomplete">未完了</option>
          <option value="complete">完了</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilter({ priority: e.target.value as Priority | 'all' })}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">すべての優先度</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>

        <select
          value={filters.categoryId}
          onChange={(e) => setFilter({ categoryId: e.target.value })}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">すべてのカテゴリ</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={filters.dueDateRange}
          onChange={(e) =>
            setFilter({
              dueDateRange: e.target.value as 'all' | 'overdue' | 'today' | 'week',
            })
          }
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">すべての期日</option>
          <option value="overdue">期限切れ</option>
          <option value="today">今日</option>
          <option value="week">今週</option>
        </select>

        {(filters.status !== 'all' ||
          filters.priority !== 'all' ||
          filters.categoryId !== 'all' ||
          filters.dueDateRange !== 'all' ||
          filters.searchQuery) && (
          <button
            onClick={resetFilters}
            className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            リセット
          </button>
        )}
      </div>
    </div>
  )
}
