'use client';

import { toast } from '@/hooks/use-toast';
import { uploadFiles } from '@/lib/uploadthing';
import { shortenPathname } from '@/lib/utils';
import { CreatePostRequest, PostValidator } from '@/lib/validation/post';
import type EditorJS from '@editorjs/editorjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';

interface EditorProps {
  zenZoneId: string;
}

export const Editor: FC<EditorProps> = ({ zenZoneId }) => {
  const [isMounted, setIsMounted] = useState(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const ref = useRef<EditorJS>();
  const router = useRouter();
  const pathname = usePathname();

  const inializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const Embed = (await import('@editorjs/embed')).default;
    const Table = (await import('@editorjs/table')).default;
    const List = (await import('@editorjs/list')).default;
    const Code = (await import('@editorjs/code')).default;
    const LinkTool = (await import('@editorjs/link')).default;
    const InlineCode = (await import('@editorjs/inline-code')).default;
    const ImageTool = (await import('@editorjs/image')).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor;
        },
        placeholder: 'Start writing your post...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], 'imageUploader');

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          embed: Embed,
          table: Table,
          list: List,
          code: Code,
          inlineCode: InlineCode,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      zenZoneId,
      title: '',
      content: null,
    },
  });

  useEffect(() => {
    const initEditor = async () => {
      await inializeEditor();

      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    };

    if (isMounted) {
      initEditor();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, inializeEditor]);

  useEffect(() => {
    if (Object.keys(errors).length) {
      // eslint-disable-next-line no-unused-vars
      for (const [_key, value] of Object.entries(errors)) {
        value;
        toast({
          title: 'Error',
          description: (value as { message: string }).message,
          variant: 'destructive',
        });
      }
    }
  }, [errors]);

  const { mutate: createPost } = useMutation({
    mutationFn: async ({ title, content, zenZoneId }: CreatePostRequest) => {
      const payload: CreatePostRequest = {
        title,
        content,
        zenZoneId,
      };
      const { data } = await axios.post('/api/zenzone/post/create', payload);
      return data;
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Something went wrong while creating your post',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      router.push(shortenPathname(pathname));

      router.refresh();

      return toast({
        title: 'Success',
        description: 'Your post has been published.',
        variant: 'success',
      });
    },
  });

  async function onSubmit(data: CreatePostRequest) {
    const editorContent = await ref.current?.save();

    const payload: CreatePostRequest = {
      title: data.title,
      content: editorContent,
      zenZoneId,
    };

    createPost(payload);
  }

  if (!isMounted) return null;

  const { ref: titleRef, ...rest } = register('title');

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <form
        id="zenzone-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
        </div>
        <div
          id="editor"
          className="min-h-[500px]"
        />
        <p className="text-sm text-gray-500">
          Use{' '}
          <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
            Tab
          </kbd>{' '}
          to open the command menu. (Comming soon)
        </p>
      </form>
    </div>
  );
};

export default Editor;
