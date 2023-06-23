"use client"

import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList
} from "@/components/ui/Command"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"
import { Prisma, ZenZone } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import debounce from "lodash.debounce"
import { usePathname, useRouter } from "next/navigation"
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Icons } from "./Icons"

interface SearchProps {

}

const Search: FC<SearchProps> = ({ }) => {
   const [input, setInput] = useState("")
   const router = useRouter()

   const { data: results, refetch, isFetched, isFetching } = useQuery({
      queryFn: async () => {
         if (!input) return []

         const { data } = await axios.get(`/api/zenzone/search?q=${input}`)
         return data as (ZenZone & { _count: Prisma.ZenZoneCountOutputType })[]
      },
      queryKey: ['search-query'],
      enabled: false,
   })

   const debounceRequest = debounce(() => {
      refetch()
   }, 300)

   const debounceInput = useCallback(() => {
      debounceRequest()
   }, [])

   const searchRef = useRef<HTMLDivElement>(null)
   const pathname = usePathname()

   useOnClickOutside(searchRef, () => {
      setInput("")
   })

   useEffect(() => {
      setInput("")
   }, [pathname])


   return <Command ref={searchRef} className="relative rounded-lg border max-w-lg overflow-visible z-50">
      <CommandInput
         value={input}
         onValueChange={(value) => {
            setInput(value)
            debounceInput()
         }}
         className='outline-none border-none focus:border-none focus:outline-none ring-0'
         placeholder='Search zen zones...'
      />

      {input.length > 0 && (
         <CommandList className='absolute bg-white top-full inset-x-0 shadow rounded-b-md'>
            {isFetched && <CommandEmpty>No results found for {input}</CommandEmpty>}
            {(results?.length ?? 0) > 0 ? (
               <CommandGroup heading='Zen Zones'>
                  {results?.map((zenZone) => (
                     <CommandItem onSelect={(selectedResult) => {
                        router.push(`/zenzone/${selectedResult}`)
                        router.refresh()
                     }} key={zenZone.id} value={zenZone.name}>
                        <Icons.users className='mr-2 h-4 w-4' />
                        <a href={`/zenzone/${zenZone.name}`}>zenzone / {zenZone.name}</a>
                     </CommandItem>
                  ))}
               </CommandGroup>
            ) : null}
         </CommandList>
      )}
   </Command>
}

export default Search