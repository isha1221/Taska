import express, { Request, Response } from "express";
import { createTask } from "./tasks/task.api";

const app = express();
const port = 6969;

interface TaskInput {
  userId: number;
  task: string;
  status: string;
  startTime: Date;
  endTime: Date;
}
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  // res.send('Hello World!');
  return res.json({ heloooo: "hello world" });
});

app.post("/task", async (req: Request, res: Response) => {
  try {
    const taskInput = {
      userId: req.body.userId,
      task: req.body.task,
      status: req.body.status,
    };
    const newTask = await createTask(
      req.body.userId as number,
      req.body.task as string,
      req.body.status as string
    );
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
