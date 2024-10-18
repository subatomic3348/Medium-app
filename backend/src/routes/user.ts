import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt';
import { signinInput, signupInput } from "@subatomic3348/zod-common"


export const userRouter= new Hono<{
    Bindings:{
        DATABASE_URL :string,
        JWT_SECRET:string

    },
    Variables:{
        userId:string

    },
    
   
    
}>
userRouter.post('/signup',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
    
    try{
      const user = await prisma.user.create({
        data:{
          email:body.email,
          password:body.password,
          name:body.name
          
        }
      });
      const jwt = await sign({id:user.id},c.env.JWT_SECRET);
      return c.text(jwt);
    
    } 
    catch(err){
      c.status(403)
      return c.json({
        error:"error while signin up"
      })
    }
     

})
userRouter.post('/signin',async(c)=>{
    const prisma =  new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
        const body = await c.req.json();
        const { success } = signinInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
       
          const user = await prisma.user.findUnique({
            where:{
              email:body.email
              
            }
    
          })
          if(!user){
            c.status(403)
            return c.json({
              message:"user doesnot exist/invalid inputs"
            })
          }
          const jwt =  await sign({id:user.id},c.env.JWT_SECRET);
          return c.text(jwt);    

})

