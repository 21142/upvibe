import { Prisma } from '@prisma/client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { FC } from 'react'

const Output = dynamic(async () => (await import('editorjs-react-renderer')).default, {
   ssr: false
})

interface DisplayEditorOutputProps {
   content: Prisma.JsonValue
}

function CustomImageRenderer({ data }: any) {
   const src = data.file.url

   return (
      <div className="relative w-full min-h-[15rem]">
         <Image alt="image" src={src} className="object-contain" fill />
      </div>
   )
}

function CustomCodeRenderer({ data }: any) {
   return (
      <pre className='bg-gray-800 rounded-md p-4'>
         <code className='text-gray-100 text-sm'>{data.code}</code>
      </pre>
   )
}

const renderers = {
   image: CustomImageRenderer,
   code: CustomCodeRenderer,
}

const style = {
   paragraph: {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
   }
}

const DisplayEditorOutput: FC<DisplayEditorOutputProps> = ({ content }) => {
   return <Output className="text-sm" style={style} data={content} renderers={renderers} />
}

export default DisplayEditorOutput