import express, { Request, Response, response } from "express";
import { createTask } from "./tasks/task.api";
import { createUser } from "./users/users.signup";
import { getUser } from "./users/user.login";

const app = express();
const port = 6969;

interface TaskInput {
  userId: number;
  task: string;
  status: string;
  startTime: Date;
  endTime: Date;
}
app.use(express.json());//middelware to accept /access the json request body
app.get("/", (req: Request, res: Response) => {
  // res.send('Hello World!');
  return res.json({ heloooo: "hello world" });
});

app.post("/task", async (req: Request, res: Response) => {
  try {
    // const taskInput = {
    //   userId: req.body.userId,
    //   task: req.body.task,
    //   status: req.body.status,
    // };
    const newTask = await createTask(  //constant to store data returned by create task function
      req.body.userId as number,
      req.body.task as string,
      req.body.status as string
    );
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/user", async(req:Request,res:Response)=>{
  try{
    const user= await createUser(
      req.body.username as string,
      req.body.fullName as string,
      req.body.email as string,
      req.body.branch as string,
      req.body.password as string,
      req.body.bio as string,
    );
    res.json(user).status(201);
  }catch (error: any){
    res.status(500).json({ error: error.message });
  }
 
})


app.post("/user/login", async(req:Request,res:Response)=>{
  try{
    const user= await getUser(
      req.body.username as string,
      req.body.password as string,
     
    );
    if(!user){
     return res.json({error:"login fail"}).status(400);
    }
    res.json(user).status(200);
  }catch (error: any){
    res.status(500).json({ error: error.message });
  }
 
})


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

