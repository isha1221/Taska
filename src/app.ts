import express, { Request, Response } from "express";
import { createTask } from "./tasks/create.task.";
import { createUser } from "./users/users.signup";
import { getUser } from "./users/user.login";
import { deleteUser } from "./users/delete.user";
import { getTask } from "./tasks/get.task";
import { getTasksForUser } from "./tasks/get.user.task";
import { deleteTask } from "./tasks/delete.task";
import { updateTask } from "./tasks/update.task";
import cookieParser from "cookie-parser";
import { authenticateUser } from "./middleware/middleware";
import { getAuthUser } from "./users/get.auth";
import { getFriendList } from "./users/friendlist";
import {  FriendListResponse, UserResponse } from "./interface/user.response";

const app = express();
const port = 6969;

// Middleware to accept JSON request bodies
app.use(express.json());
app.use(cookieParser());

// Example root endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello, world!" });
});

app.get("/getAuth", getAuthUser);

// Endpoint to create a new task
app.post("/task", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { userId, taskTitle, taskDescription, status } = req.body;

    // Basic validation to check required fields
    if (!userId || !taskTitle || !taskDescription || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTask = await createTask(
      userId as number,
      taskTitle as string,
      taskDescription as string,
      status as string
    );

    res.status(201).json(newTask);
  } catch (error: any) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to create a new user
app.post("/user/signup", async (req: Request, res: Response) => {
  try {
    const { username, fullName, email, branch, password, bio } = req.body;

    // Basic validation to check required fields
    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newUser = await createUser(
      username,
      fullName,
      email,
      branch,
      password,
      bio
    );
    const userResponse: UserResponse = {
      id: newUser.user.id,
      username: newUser.user.username,
      fullName: newUser.user.fullName,
      email: newUser.user.email,
      branch: newUser.user.branch,
      bio: newUser.user.bio,
      totalTasks: newUser.user.totalTasks,
      pendingTask: newUser.user.pendingTask,
      inTimeCompletdTask: newUser.user.inTimeCompletedTask,
      overTimecompletedTask: newUser.user.overTimecompletedTask,
      milestonesAchieved: newUser.user.milestonesAchieved,
      rank: newUser.user.rank,
    };
    res.cookie("token", newUser.token);
    res.status(201).json(userResponse);
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to log in a user
app.post("/user/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; // Changed to 'email' since login typically uses email
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await getUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const userResponse: UserResponse = {
      id: user.user.id,
      username: user.user.username,
      fullName: user.user.fullName,
      email: user.user.email,
      branch: user.user.branch,
      bio: user.user.bio,
      totalTasks: user.user.totalTasks,
      pendingTask: user.user.pendingTask,
      inTimeCompletdTask: user.user.inTimeCompletedTask,
      overTimecompletedTask: user.user.overTimecompletedTask,
      milestonesAchieved: user.user.milestonesAchieved,
      rank: user.user.rank,
    };

    res.cookie("token", user.token);
    res.status(200).json(userResponse);
  } catch (error: any) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get single user
app.post(
  "/user/delete",
  authenticateUser,
  async (req: Request, res: Response) => {
    if (!req.body.consent) {
      res.status(400).json({
        error: "don't you want to delete your account mand",
      });
    } else if (req.body.consent == false) {
      res.status(400).json({
        error: "don't you want to delete your account mand",
      });
    } else {
      deleteUser(req, res);
      res.status(200).json({
        error: "user deleted successfully",
      });
    }
  }
);

app.get("/friendlist", authenticateUser, async (req: Request, res: Response) => { // Changed to POST for handling body data
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const friendList: FriendListResponse = await getFriendList(userId);
    
    res.status(200).json(friendList);
  } catch (error: any) {
    console.error("Error fetching friend list:", error);
    res.status(500).json({ error: error.message });
  }
});


app.get(
  "/task/:taskId",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      if (!taskId) {
        return res.status(400).json({ error: "Task ID is required" });
      }
      const task = await getTask(req, res);
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.put(
  "/task/:taskId",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;

      if (!taskId) {
        return res.status(400).json({ error: "Task ID is required" });
      }

      const updatedTask = await updateTask(req, res);
      res.status(200).json(updatedTask);
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.delete(
  "/task/:taskId",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;

      if (!taskId) {
        return res.status(400).json({ error: "Task ID is required" });
      }

      await deleteTask(req, res);
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.get("/tasks", authenticateUser, async (req: Request, res: Response) => {
  try {
    const tasks = await getTasksForUser(req, res);
    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
