import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
   const token = await getToken({ req })

   if (!token) {
      return NextResponse.redirect(new URL('/sign-in', req.nextUrl))
   }
}

export const config = {
   matcher: ['/zenzone/:path*/submit', '/zenzone/create'],
}