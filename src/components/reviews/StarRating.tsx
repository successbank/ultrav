'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
  rating: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export default function StarRating({
  rating,
  onChange,
  readonly = false,
  size = 'md',
  showValue = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const handleClick = (value: number) => {
    if (!readonly && onChange) {
      onChange(value)
    }
  }

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
            aria-label={`${value}점`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                value <= displayRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
