'use client'

import React, { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff, Trash2, Copy, Plus } from 'lucide-react'
import { PAGE_CATEGORIES } from '@/lib/pageCategories'

export type PageItem = {
  id: string
  category: string
  layoutId: string
  order: number
  isEnabled: boolean
  content: any
}

type PageManagerSidebarProps = {
  pages: PageItem[]
  activePageId: string | null
  onReorder: (reorderedPages: PageItem[]) => void
  onSelectPage: (id: string) => void
  onToggleVisibility: (id: string, isEnabled: boolean) => void
  onDeletePage: (id: string) => void
  onDuplicatePage: (page: PageItem) => void
  onAddNewClick: () => void
}

function SortableItem({ 
  page, 
  isActive, 
  onSelect, 
  onToggle, 
  onDelete, 
  onDuplicate 
}: { 
  page: PageItem
  isActive: boolean
  onSelect: () => void
  onToggle: (id: string, enabled: boolean) => void
  onDelete: (id: string) => void
  onDuplicate: (p: PageItem) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: page.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const categoryInfo = PAGE_CATEGORIES.find(c => c.id === page.category)
  const layoutInfo = categoryInfo?.layouts.find(l => l.id === page.layoutId)

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-2 p-3 rounded-xl border mb-2 transition-colors ${isActive ? 'border-pink-500 bg-pink-50' : 'border-slate-200 bg-white hover:border-pink-200'}`}>
      <div {...attributes} {...listeners} className="cursor-grab p-1 text-slate-400 hover:text-slate-600">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onSelect}>
        <p className={`font-semibold text-sm truncate ${isActive ? 'text-pink-700' : 'text-slate-700'} ${!page.isEnabled && 'opacity-50 line-through'}`}>
          {categoryInfo?.name || 'Unknown'}
        </p>
        <p className="text-xs text-slate-500 truncate">{layoutInfo?.name || page.layoutId}</p>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); onToggle(page.id, !page.isEnabled) }} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100">
          {page.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDuplicate(page) }} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100">
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(page.id) }} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default function PageManagerSidebar({
  pages,
  activePageId,
  onReorder,
  onSelectPage,
  onToggleVisibility,
  onDeletePage,
  onDuplicatePage,
  onAddNewClick
}: PageManagerSidebarProps) {
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex(p => p.id === active.id)
      const newIndex = pages.findIndex(p => p.id === over.id)
      const reordered = arrayMove(pages, oldIndex, newIndex).map((p, index) => ({
        ...p,
        order: index
      }))
      onReorder(reordered)
    }
  }

  return (
    <div className="w-72 bg-slate-50 border-r border-slate-200 h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
        <h3 className="font-bold text-slate-800">Halaman</h3>
        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-semibold">{pages.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={pages.map(p => p.id)} strategy={verticalListSortingStrategy}>
            {pages.map((page) => (
              <SortableItem
                key={page.id}
                page={page}
                isActive={activePageId === page.id}
                onSelect={() => onSelectPage(page.id)}
                onToggle={onToggleVisibility}
                onDelete={onDeletePage}
                onDuplicate={onDuplicatePage}
              />
            ))}
          </SortableContext>
        </DndContext>

        {pages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">Belum ada halaman.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <button 
          onClick={onAddNewClick}
          className="w-full flex items-center justify-center gap-2 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Tambah Halaman
        </button>
      </div>
    </div>
  )
}
