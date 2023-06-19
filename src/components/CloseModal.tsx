"use client"

import { useRouter } from 'next/navigation'
import { Icons } from './Icons'
import { Button } from './ui/Button'

const CloseModal = () => {
  const router = useRouter();
  return (
    <Button onClick={() => router.back()} variant='subtle' className='h-6 w-6 p-0 rounded-md' aria-label="Close modal">
      <Icons.close className="w-6 h-6" />
    </Button>
  )
}

export default CloseModal