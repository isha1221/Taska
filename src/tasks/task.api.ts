import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTask = async ( task: string, status: string, res: Response) => {
    

    try {
        // Check if userId is provided in the request body
       

        // Create the task using Prisma
        const newTask = await prisma.task.create({
            data: {
                userId: 1,
                task: task,
                status: status,
                startTime: new Date(Date.now()),
                endTime: new Date(Date.now()+10)
            }
        });

        // Send the newly created task in the response
        res.json(newTask);
    } catch (error) {
        // Handle errors
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
};
