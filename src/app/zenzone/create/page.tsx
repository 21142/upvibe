"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast"
import { CreateZenZone } from "@/lib/validation/zenzone"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from 'axios'
import { useRouter } from "next/navigation"
import { ChangeEvent, useState } from "react"

const Page = () => {
   const [input, setInput] = useState("")
   const router = useRouter()
   const { loginToast } = useCustomToast()

   const { mutate: createZenZone, isLoading } = useMutation({
      mutationFn: async () => {
         const payload: CreateZenZone = {
            name: input,
         }
         const { data } = await axios.post("/api/zenzone", payload)
         return data as string
      },
      onError: (err) => {
         if (err instanceof AxiosError) {
            if (err.response?.status === 409) {
               return toast({
                  title: "Zen Zone already exists",
                  description: "Please choose another name.",
                  variant: "destructive",
               })
            }

            if (err.response?.status === 422) {
               return toast({
                  title: "Zen Zone name is invalid",
                  description: "Please choose a unique name between 3 and 21 characters.",
                  variant: "destructive",
               })
            }

            if (err.response?.status === 401) {
               return loginToast()
            }
         }

         toast({
            title: "Something went wrong",
            description: "Could not create Zen Zone.",
            variant: "destructive",
         })
      },
      onSuccess: (data) => {
         router.push(`/zenzone/${data}`)
      }
   })

   return (
      <div className="container flex items-center h-full max-w-3xl mx-auto">
         <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
            <div className="flex justify-between items-center">
               <h1 className="text-xl font-semibold">Create a community</h1>
            </div>

            <hr className="bg-zinc-500 h-px" />

            <div>
               <p className="text-lg font-medium">Name your Zen Zone</p>
               <p className="text-xs pb-2">The name you will choose cannot be changed in the future.
               </p>

               <div className="relative">
                  <p className="absolute text-sm left-2 w-8 inset-y-0 grid place-items-center text-zinc-400">
                     zenzone/
                  </p>
                  <Input value={input} onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} className="pl-[4.3rem]" />
               </div>

               <div className="flex justify-end gap-4 pt-2">
                  <Button variant='subtle' onClick={() => router.back()}>Cancel</Button>
                  <Button onClick={() => createZenZone()} isLoading={isLoading} disabled={input.length === 0}>Create</Button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Page