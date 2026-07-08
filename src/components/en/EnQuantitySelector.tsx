"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

// 영문 사이트용 수량 선택기 — QuantitySelector와 동일 구조, aria-label만 영문
interface EnQuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function EnQuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
}: EnQuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
      setInputValue((value - 1).toString());
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
      setInputValue((value + 1).toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // 숫자만 허용
    if (/^\d*$/.test(newValue)) {
      const num = parseInt(newValue, 10);
      if (!isNaN(num) && num >= min && num <= max) {
        onChange(num);
      }
    }
  };

  const handleInputBlur = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num < min) {
      setInputValue(min.toString());
      onChange(min);
    } else if (num > max) {
      setInputValue(max.toString());
      onChange(max);
    } else {
      setInputValue(num.toString());
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus size={16} className="text-gray-600" />
      </button>

      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
        aria-label="Quantity"
      />

      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus size={16} className="text-gray-600" />
      </button>
    </div>
  );
}
