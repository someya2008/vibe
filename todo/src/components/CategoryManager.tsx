import { useState } from 'react'
import { useTodoStore } from '../store'

interface CategoryManagerProps {
  onClose: () => void
}

export function CategoryManager({ onClose }: CategoryManagerProps) {
  const { categories, addCategory, updateCategory, deleteCategory } = useTodoStore()
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#6366f1')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    addCategory(newName.trim(), newColor)
    setNewName('')
  }

  const startEdit = (id: string, name: string, color: string) => {
    setEditingId(id)
    setEditName(name)
    setEditColor(color)
  }

  const saveEdit = (id: string) => {
    if (!editName.trim()) return
    updateCategory(id, { name: editName.trim(), color: editColor })
    setEditingId(null)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">カテゴリ管理</h2>

        {/* Category list */}
        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              {editingId === cat.id ? (
                <>
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(cat.id)}
                  />
                  <button
                    onClick={() => saveEdit(cat.id)}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    取消
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="flex-1 text-sm text-gray-900 dark:text-white">{cat.name}</span>
                  <button
                    onClick={() => startEdit(cat.id, cat.name, cat.color)}
                    className="text-gray-400 hover:text-blue-500 text-sm"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-gray-400 hover:text-red-500 text-sm"
                  >
                    削除
                  </button>
                </>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              カテゴリがありません
            </p>
          )}
        </div>

        {/* Add new */}
        <form onSubmit={handleAdd} className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0"
          />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="新しいカテゴリ名..."
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            追加
          </button>
        </form>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
