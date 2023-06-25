'use client';

import { Prisma } from '@prisma/client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FC } from 'react';

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  {
    ssr: false,
  }
);

interface DisplayEditorOutputProps {
  content: Prisma.JsonValue;
}

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative min-h-[15rem] w-full">
      <Image
        alt="image"
        src={src}
        className="object-contain"
        fill
      />
    </div>
  );
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="rounded-md bg-gray-800 p-4">
      <code className="text-sm text-gray-100">{data.code}</code>
    </pre>
  );
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
};

const DisplayEditorOutput: FC<DisplayEditorOutputProps> = ({ content }) => {
  return (
    <Output
      className="text-sm"
      style={style}
      data={content}
      renderers={renderers}
    />
  );
};

export default DisplayEditorOutput;
