'use client';

import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PostVoteRequest } from '@/lib/validation/vote';
import { usePrevious } from '@mantine/hooks';
import { VoteType } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';
import { Icons } from './Icons';
import { Button } from './ui/Button';

interface PostVotesClientProps {
  postId: string;
  initialVotesAmount: number;
  initialVote?: VoteType | null;
}

const PostVotesClient: FC<PostVotesClientProps> = ({
  postId,
  initialVotesAmount,
  initialVote,
}) => {
  const { loginToast } = useCustomToast();
  const [votesAmount, setVotesAmount] = useState(initialVotesAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);

  const previousVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutateAsync: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        voteType: type,
        postId,
      };

      await axios.patch('/api/zenzone/post/vote', payload);
    },
    onError: (error, voteType) => {
      if (voteType === 'UP') {
        setVotesAmount((previousVotesAmount) => previousVotesAmount - 1);
      } else {
        setVotesAmount((previousVotesAmount) => previousVotesAmount + 1);
      }

      setCurrentVote(previousVote);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          loginToast();
        }
      }

      return toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    },
    onMutate: (voteType: VoteType) => {
      if (currentVote === voteType) {
        setCurrentVote(undefined);
        if (voteType === 'UP')
          setVotesAmount((previousVotesAmount) => previousVotesAmount - 1);
        else if (voteType === 'DOWN')
          setVotesAmount((previousVotesAmount) => previousVotesAmount + 1);
      } else {
        setCurrentVote(voteType);
        if (voteType === 'UP')
          setVotesAmount(
            (previousVotesAmount) => previousVotesAmount + (currentVote ? 2 : 1)
          );
        else if (voteType === 'DOWN')
          setVotesAmount(
            (previousVotesAmount) => previousVotesAmount - (currentVote ? 2 : 1)
          );
      }
    },
  });

  return (
    <div className="flex flex-col gap-4 pb-4 pr-6 sm:w-20 sm:gap-0 sm:pb-0">
      <Button
        onClick={() => vote('UP')}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <Icons.up
          className={cn(
            'h-5 w-5 text-zinc-700 hover:fill-emerald-500 hover:text-emerald-500',
            {
              'fill-emerald-500 text-emerald-500': currentVote === 'UP',
            }
          )}
        />
      </Button>

      <p className="py-2 text-center text-sm font-medium text-zinc-900">
        {votesAmount}
      </p>

      <Button
        onClick={() => vote('DOWN')}
        size="sm"
        className={cn({
          'text-emerald-500': currentVote === 'DOWN',
        })}
        variant="ghost"
        aria-label="upvote"
      >
        <Icons.down
          className={cn(
            'h-5 w-5 text-zinc-700 hover:fill-red-500 hover:text-red-500',
            {
              'fill-red-500 text-red-500': currentVote === 'DOWN',
            }
          )}
        />
      </Button>
    </div>
  );
};

export default PostVotesClient;
