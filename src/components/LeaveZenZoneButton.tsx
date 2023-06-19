"use client"

import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { SubscribeToZenZone } from '@/lib/validation/zenzone'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { Button } from './ui/Button'

interface LeaveZenZoneButtonProps {
   isSubscribed: boolean
   zenZoneId: string
   zenZoneName: string
}

const LeaveZenZoneButton = ({ isSubscribed, zenZoneId, zenZoneName }: LeaveZenZoneButtonProps) => {
   const router = useRouter()
   const { loginToast } = useCustomToast()

   const { mutate: subscribeToZenZone, isLoading } = useMutation({
      mutationFn: async () => {
         const payload: SubscribeToZenZone = {
            zenZoneId,
         }
         const { data } = await axios.post("/api/zenzone/subscribe", payload)
         return data as string
      },
      onError: (err) => {
         if (err instanceof AxiosError) {
            if (err.response?.status === 401) {
               return loginToast()
            }
         }

         return toast({
            title: "Something went wrong",
            description: "Could not subscribe to Zen Zone.",
            variant: "destructive",
         })
      },
      onSuccess: () => {
         startTransition(() => {
            router.refresh()
         })

         return toast({
            title: "Subscribed to Zen Zone",
            description: `You are now subscribed to zenzone / ${zenZoneName}.`,
         })
      }
   })

   const { mutate: unsubscribeFromZenZone, isLoading: isLeaveLoading } = useMutation({
      mutationFn: async () => {
         const payload: SubscribeToZenZone = {
            zenZoneId,
         }
         const { data } = await axios.post("/api/zenzone/unsubscribe", payload)
         return data as string
      },
      onError: (err) => {
         if (err instanceof AxiosError) {
            if (err.response?.status === 401) {
               return loginToast()
            }
         }

         return toast({
            title: "Something went wrong",
            description: "Could not subscribe to Zen Zone.",
            variant: "destructive",
         })
      },
      onSuccess: () => {
         startTransition(() => {
            router.refresh()
         })

         return toast({
            title: "Unsubscribed from Zen Zone",
            description: `You are no longer subscribed to zenzone / ${zenZoneName}.`,
         })
      }
   })

   return isSubscribed ? (
      <Button
         onClick={() => unsubscribeFromZenZone()}
         isLoading={isLeaveLoading}
         className='w-full mt-1 mb-4'>
         Leave Zen Zone
      </Button>
   ) : (
      <Button
         onClick={() => subscribeToZenZone()}
         isLoading={isLoading}
         className='w-full mt-1 mb-4'>
         Join to post
      </Button>
   )
}

export default LeaveZenZoneButton