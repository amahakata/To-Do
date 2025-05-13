import express from 'express'


const todoRoute = express.Router()

//Get all to-dos for logged in User

todoRoute.get('/', async (req,res)=>{
    
    const userToDos = await prisma.todo.findMany({
        where : {
            userId : req.userId
        }
    })
    res.json(userToDos)

})

//Create a new to-do

todoRoute.post('/',async (req,res)=>{
   
    try {
        const {task} = req.body
        const todo = await prisma.todo.create({
            data : {
                task : task,
                userId : req.userId
            }
        })
        res.json(todo)
    } catch (error) {
        res.status(503).json({message:"Unable to create todo task"})
        
    }

})

//Update to-to
todoRoute.put('/:id', async (req,res)=>{
    try {
        const { completed} = req.body
        const { id } = req.params

        const updateToDo = await prisma.todo.update({
            where : {
                id : parseInt(id),
                userId : req.userId
            },
            data : {
                completed : !!completed
            }
        })
        
        res.json(updateToDo)
    
        
    } catch (error) {
        res.status(503).json("Failed to update task")
        
    }

})

todoRoute.delete('/:id',async (req,res)=>{
    
    try {
        const { id } = req.params
        await prisma.todo.delete({
            where : {
                id : parseInt(id),
                userId : req.userId
            }
        })
        
        res.json({message:"Task deleted"})
        
    } catch (error) {

         res.status(503).json("Failed to delete task")
    }

})
export default todoRoute