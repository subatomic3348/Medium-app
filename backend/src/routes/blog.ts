import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt';
import {  createPostInput, updatePostInput } from "@subatomic3348/zod-common"

export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL :string,
        JWT_SECRET:string

    },
    Variables:{
        userId:string

    },
    
   
    
}>
blogRouter.use('/*',async(c,next)=>{
    const header = c.req.header("Authorization")||""
    
    
    try{
        const user = await verify(header,c.env.JWT_SECRET);
        c.set("userId",String(user.id));
        await next();


    }
    catch(e){
        c.status(403)
        return c.json({
            error:"you are not authenticated! bhai jaake perms nhi hai "
        })
    }

})

blogRouter.post('/create',async(c)=>{

 const body = await c.req.json();
    const authorId = c.get("userId");
    const { success } = createPostInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
   
    const blog = await prisma.post.create({
        data:{
            title:body.title,
            content:body.content,
            authorId:authorId
        }
    })
    return c.json({
        id:blog.id
    })



})
blogRouter.put('/update', async (c) => {
    const authorId = c.get("userId");
    const body = await c.req.json();
    const { success } = updatePostInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const updatedBlogs = await prisma.post.update({
            where: {
                id: body.id,
                authorId: authorId,
            },
            data: {
                title: body.title,
                content: body.content,
            },
        });

        c.status(200);
        return c.json({
            updatedBlogs,
        });
    } catch (e) {
        c.status(500); 
        return c.json({
            message: "Something went wrong / you are not allowed",
        });
    }
});
blogRouter.get('/bulk', async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const allBlogs = await prisma.post.findMany();
        c.status(200)
        return c.json({
            allBlogs
        })
    } 
    catch (error) {
         c.status(404)
        return c.json({
            message: "Something went wrong/you are not logged in"
        })
        
    }

})
blogRouter.get('/:id',async(c)=>{
    const authorId = c.get('userId')
    const blogId = c.req.param('id')
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
      try{
        const blog = await prisma.post.findUnique({
            where:{
                id:blogId,
                authorId:authorId

            }
        })
        c.status(200)
        return c.json({
            blog
        })

      }
      catch(e){
        c.status(404)
        return c.json({
            error:"blog not found/there is author with this id"
        })

      }
})
