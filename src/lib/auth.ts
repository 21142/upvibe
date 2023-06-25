import { db } from '@/lib/db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { nanoid } from 'nanoid';
import { NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },

    async jwt({ token, user }) {
      const userFromDb = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!userFromDb) {
        token.id = user.id;
        return token;
      }

      if (!userFromDb.username) {
        await db.user.update({
          where: {
            id: userFromDb.id,
          },
          data: {
            username: nanoid(10),
          },
        });
      }

      return {
        id: userFromDb.id,
        name: userFromDb.name,
        email: userFromDb.email,
        picture: userFromDb.image,
        username: userFromDb.username,
      };
    },

    redirect() {
      return '/';
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
