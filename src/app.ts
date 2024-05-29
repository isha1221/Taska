import cors from "cors";
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
import {
  FriendListResponse,
  FriendRankResponse,
  UserResponse,
} from "./interface/user.response";
import { getAndRankUsers } from "./analytics/user.rank";
import { updateTaskStatus } from "./tasks/task.complete";
import { getPendingTasks } from "./tasks/pending.task";
import { getCompletedTasks } from "./tasks/completed.task";
import { getDailyRanks } from "./analytics/rank.data";
import { getSingleUser } from "./users/get.user";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { logMiddleware } from "./middleware/logging";
import { userLogout } from "./users/user.logout";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "";

const app = express();
const port = 6969;

// Middleware to accept JSON request bodies
app.use(
  cors({
    origin: "http://localhost:5173", // Update this to match your frontend URL
    credentials: true, // Allow credentials (cookies) to be included in requests
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(logMiddleware);

// Example root endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello, world!" });
});

app.get("/getAuth", getAuthUser);

// Endpoint to create a new task
app.post("/task", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { taskTitle, taskDescription, startTime, endTime } = req.body;
    const token = req.cookies.token;

    // Basic validation to check required fields
    if (!taskTitle || !taskDescription) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTask = await createTask(
      token as string,
      taskTitle as string,
      taskDescription as string,
      startTime as Date,
      endTime as Date
    );

    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error", msg: error });
  }
});

app.post("/profile", authenticateUser, async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const decodedToken = jwt.verify(token, jwtSecret) as { userId: number };

  const { userId } = decodedToken;
  try {
    const user = await getSingleUser(userId);

    if (!user) {
      return res.status(404).json({ error: "User details not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error });
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
      profile: newUser.user.profile,
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
    const userResponse: UserResponse = {
      id: user.user.id,
      username: user.user.username,
      fullName: user.user.fullName,
      email: user.user.email,
      branch: user.user.branch,
      profile: user.user.profile,
      bio: user.user.bio,
      totalTasks: user.user.totalTasks,
      pendingTask: user.user.pendingTask,
      inTimeCompletdTask: user.user.inTimeCompletedTask,
      overTimecompletedTask: user.user.overTimecompletedTask,
      milestonesAchieved: user.user.milestonesAchieved,
      rank: user.user.rank,
    };

    res.cookie("token", user.token, {
      httpOnly: true, // Make the cookie HTTP-only for security
      secure: true, // Set to true if using HTTPS
      sameSite: "none",
      path: "/",
    });
    res.status(200).json(userResponse);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    } else if (error.name === "AuthenticationError") {
      return res.status(401).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
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

app.post("/logout", authenticateUser, async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }
    const user = await userLogout(token);
    if (user === "User not found") {
      return res
        .status(401)
        .json({ error: "User not found or you are not authorized" });
    }
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 0,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(500).json({ error: "An error occurred during logout" });
  }
});

app.post(
  "/friendlist",
  authenticateUser,
  async (req: Request, res: Response) => {
    // Changed to POST for handling body data
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const friendList: FriendListResponse = await getFriendList(userId);

      res.status(200).json(friendList);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

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

app.patch(
  "/task/:taskId",
  authenticateUser,
  async (req: Request, res: Response) => {
    const token = req.cookies.token;
    try {
      const { taskId } = req.params;

      if (!taskId) {
        return res.status(400).json({ error: "Task ID is required" });
      }

      const updatedTask = await updateTask(req, res, token);
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
  const token = req.cookies.token;
  try {
    const tasks = await getTasksForUser(token);
    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/tasks/:taskId/status", async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }
  await updateTaskStatus(req, res, token);
});

app.post(
  "/task/pending",
  authenticateUser,
  async (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Token required" });
    }
    try {
      const tasks = await getPendingTasks(token);
      res.status(200).json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post(
  "/task/completed",
  authenticateUser,
  async (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Token required" });
    }
    try {
      const tasks = await getCompletedTasks(token);
      res.status(200).json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post(
  "/users/rank",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const rankedUsers: FriendRankResponse = await getAndRankUsers();
      res.json(rankedUsers);
    } catch (error) {
      res.status(500).json({ error: "Internal server error", msg: error });
    }
  }
);

app.post(
  "/user/rank-history",
  authenticateUser,
  async (req: Request, res: Response) => {
    const token: string = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Token required" });
    }
    try {
      const rankHistory = await getDailyRanks(token);
      res.status(200).json(rankHistory);
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
