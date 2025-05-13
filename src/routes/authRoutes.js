import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const authRoutes = express.Router()

// Register new user /auth/register
authRoutes.post('/register', async (req,res)=>{
    const { username , password } = req.body

    const hashedPassword = bcrypt.hashSync(password,8)
   
    try {

       const user = await prisma.user.create({
        data : {
            username: username,
            password: hashedPassword
        }
       })
        
        const defaultTodo = `Hello! ${username}, create your first todo`
       await prisma.todo.create({
        data : {
            task: defaultTodo,
            userId : user.id
        }
       })

        
        const token = jwt.sign({id: user.id},process.env.JWT_SECRET,{expiresIn : '24h'})
        res.json({token})
        
    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
        
    }

})

authRoutes.post('/login',async (req,res)=>{
    const { username , password } = req.body
    
    
    try {
        const user = await prisma.user.findUnique({
            where :{
                username : username
            }
        })
        if(!user){
            return res.status(404).send({message:'User not found'})
        }
        const passwordIsValid = bcrypt.compareSync(password,user.password)
        if (!passwordIsValid){ return res.status(401).send({message:"Invalid credentials"})}
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET,{expiresIn:'24h'})
        res.json({token})
        
    } catch (error) {
        
        console.log(error.message)
        res.sendStatus(503)
    }

})

export default authRoutes