'use client'

import { useRef } from 'react'
import { useDaumPostcodePopup } from 'react-daum-postcode'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Search } from 'lucide-react'

export interface AddressData {
  zonecode: string
  address: string
  detailAddress: string
}

interface AddressSearchProps {
  value: AddressData
  onChange: (data: AddressData) => void
  error?: string
}

export default function AddressSearch({ value, onChange, error }: AddressSearchProps) {
  const detailRef = useRef<HTMLInputElement>(null)
  const open = useDaumPostcodePopup()

  const handleSearch = () => {
    open({
      onComplete: (data) => {
        let fullAddress = data.address
        let extraAddress = ''

        if (data.addressType === 'R') {
          if (data.bname) extraAddress += data.bname
          if (data.buildingName) {
            extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName
          }
          if (extraAddress) {
            fullAddress += ` (${extraAddress})`
          }
        }

        onChange({
          zonecode: data.zonecode,
          address: fullAddress,
          detailAddress: '',
        })

        setTimeout(() => detailRef.current?.focus(), 100)
      },
    })
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        배송 주소
      </label>

      <div className="flex gap-2 mb-2">
        <Input
          value={value.zonecode}
          readOnly
          placeholder="우편번호"
          className="w-32"
        />
        <Button type="button" variant="outline" onClick={handleSearch}>
          <Search className="w-4 h-4 mr-1" />
          주소 검색
        </Button>
      </div>

      <Input
        value={value.address}
        readOnly
        placeholder="주소 검색 버튼을 클릭해주세요"
        className="mb-2"
      />

      <Input
        ref={detailRef}
        value={value.detailAddress}
        onChange={(e) => onChange({ ...value, detailAddress: e.target.value })}
        placeholder="상세주소를 입력해주세요 (동/호수 등)"
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
