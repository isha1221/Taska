import express, { Request, Response } from 'express';
import { createTask } from './tasks/task.api';

const app = express();
const port = 6969;

app.get('/', (req: Request, res: Response) => {
    // res.send('Hello World!');
    return res.json({heloooo :"hello world"});
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

app.post("/task", (req: Request, res: Response)=>{
     createTask(req.body.task, req.body.status,res);


});

