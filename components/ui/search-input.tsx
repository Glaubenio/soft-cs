'use client'

import * as React from 'react'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const disabled = props.value === '' || props.value === undefined || props.disabled


  return (
    <div className="relative">
      <Input
        type="text"
        className={cn('pr-10', className)}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        disabled={disabled}
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  )
})
SearchInput.displayName = 'SearchInput'

export { SearchInput }