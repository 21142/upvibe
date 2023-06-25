'use client';

import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CommentVoteRequest } from '@/lib/validation/vote';
import { usePrevious } from '@mantine/hooks';
import { CommentVote, VoteType } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { FC, useState } from 'react';
import { Icons } from './Icons';
import { Button } from './ui/Button';

interface CommentVotesProps {
  commentId: string;
  votesAmount: number;
  currentVote?: Pick<CommentVote, 'type'>;
}

const CommentVotes: FC<CommentVotesProps> = ({
  commentId,
  votesAmount,
  currentVote,
}) => {
  const { loginToast } = useCustomToast();
  const [commentVotesAmount, setCommentVotesAmount] = useState(votesAmount);
  const [currentCommentVote, setCurrentCommentVote] = useState(currentVote);

  const previousVote = usePrevious(currentVote);

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType: type,
      };

      await axios.patch('/api/zenzone/post/comment/vote', payload);
    },
    onError: (error, voteType) => {
      if (voteType === 'UP') {
        setCommentVotesAmount((previousVotesAmount) => previousVotesAmount - 1);
      } else {
        setCommentVotesAmount((previousVotesAmount) => previousVotesAmount + 1);
      }

      setCurrentCommentVote(previousVote);

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
    onMutate: (type: VoteType) => {
      if (currentVote?.type === type) {
        setCurrentCommentVote(undefined);
        if (type === 'UP')
          setCommentVotesAmount(
            (previousVotesAmount) => previousVotesAmount - 1
          );
        else if (type === 'DOWN')
          setCommentVotesAmount(
            (previousVotesAmount) => previousVotesAmount + 1
          );
      } else {
        setCurrentCommentVote({ type });
        if (type === 'UP')
          setCommentVotesAmount(
            (previousVotesAmount) => previousVotesAmount + (currentVote ? 2 : 1)
          );
        else if (type === 'DOWN')
          setCommentVotesAmount(
            (previousVotesAmount) => previousVotesAmount - (currentVote ? 2 : 1)
          );
      }
    },
  });

  return (
    <div className="flex gap-1">
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
              'fill-emerald-500 text-emerald-500':
                currentCommentVote?.type === 'UP',
            }
          )}
        />
      </Button>

      <p className="py-2 text-center text-sm font-medium text-zinc-900">
        {commentVotesAmount}
      </p>

      <Button
        onClick={() => vote('DOWN')}
        size="sm"
        className={cn({
          'text-emerald-500': currentCommentVote?.type === 'DOWN',
        })}
        variant="ghost"
        aria-label="upvote"
      >
        <Icons.down
          className={cn(
            'h-5 w-5 text-zinc-700 hover:fill-red-500 hover:text-red-500',
            {
              'fill-red-500 text-red-500': currentCommentVote?.type === 'DOWN',
            }
          )}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
