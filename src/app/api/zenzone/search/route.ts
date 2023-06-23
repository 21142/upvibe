import { db } from "@/lib/db"

export async function GET(req: Request) {
   const url = new URL(req.url)
   const query = url.searchParams.get('q')

   if (!query) return new Response("No search query provided", { status: 400 })

   const results = await db.zenZone.findMany({
      where: {
         name: {
            startsWith: query,
         }
      },
      include: {
         _count: true
      },
      take: 5
   })

   if (!results) return new Response("No results found", { status: 404 })

   return new Response(JSON.stringify(results));
}