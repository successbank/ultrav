'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  id: string
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export default function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white border rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900 pr-4">
              {item.question}
            </span>
            <ChevronDown
              size={20}
              className={cn(
                'flex-shrink-0 transition-transform duration-200 text-gray-500',
                openId === item.id && 'transform rotate-180'
              )}
            />
          </button>

          <div
            className={cn(
              'overflow-hidden transition-all duration-200',
              openId === item.id ? 'max-h-96' : 'max-h-0'
            )}
          >
            <div className="p-4 pt-0 text-gray-600 leading-relaxed">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
