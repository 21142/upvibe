"use client"

import { toast } from '@/hooks/use-toast'
import { UsernameRequest, UsernameValidator } from '@/lib/validation/username'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from './ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card'
import { Input } from './ui/Input'
import { Label } from './ui/Label'

interface UserNameFormProps {
   user: Pick<User, 'id' | 'name'>
}

const UserNameForm: FC<UserNameFormProps> = ({ user }) => {
   const router = useRouter()
   const { handleSubmit, register, formState: { errors } } = useForm<UsernameRequest>({
      resolver: zodResolver(UsernameValidator),
      defaultValues: {
         name: user.name || '',
      }
   })

   const { mutate: updateUsername, isLoading } = useMutation({
      mutationFn: async ({ name }: UsernameRequest) => {
         const payload: UsernameRequest = { name }

         const { data } = await axios.patch(`/api/username/`, payload)
         return data
      },
      onError: (err) => {
         if (err instanceof AxiosError) {
            if (err.response?.status === 409) {
               return toast({
                  title: 'Username already taken.',
                  description: 'Please choose another username.',
                  variant: 'destructive',
               })
            }
         }

         return toast({
            title: 'Something went wrong.',
            description: 'Your username was not updated. Please try again.',
            variant: 'destructive',
         })
      },
      onSuccess: () => {
         toast({
            description: 'Your username has been updated.',
         })
         router.refresh()
      },
   })

   return <form onSubmit={handleSubmit((e) => updateUsername(e))}>
      <Card>
         <CardHeader>
            <CardTitle>Change Username</CardTitle>
            <CardDescription>
               Please enter a new name.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <div className='relative grid gap-1'>
               <Label className='sr-only' htmlFor='name'>
                  Name
               </Label>
               <Input
                  id='name'
                  className='w-[400px] pl-3'
                  size={32}
                  {...register('name')}
               />
               {errors?.name && (
                  <p className='px-1 text-xs text-red-600'>{errors.name.message}</p>
               )}
            </div>
         </CardContent>
         <CardFooter>
            <Button isLoading={isLoading}>Change name</Button>
         </CardFooter>
      </Card>
   </form>
}

export default UserNameForm