export interface UserResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  branch: string;
  bio: string;
  totalTasks: number;
  pendingTask: number;
  inTimeCompletdTask: number;
  overTimecompletedTask: number;
  milestonesAchieved: number;
  rank: number;
}

export interface FriendResponse{
  id: number;
  username: string;
  fullName: string;
  email: string;
  branch: string;
  rank: number;

}

export type FriendListResponse= FriendResponse[];