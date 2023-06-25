'use client';

import { useRouter } from 'next/navigation';
import { Icons } from './Icons';
import { Button } from './ui/Button';

const CloseModal = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      variant="subtle"
      className="h-6 w-6 rounded-md p-0"
      aria-label="Close modal"
    >
      <Icons.close className="h-6 w-6" />
    </Button>
  );
};

export default CloseModal;
