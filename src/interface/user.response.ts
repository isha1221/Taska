export interface UserResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  branch: string;
  profile: string | null;
  bio: string;
  totalTasks: number;
  pendingTask: number;
  inTimeCompletdTask: number;
  overTimecompletedTask: number;
  milestonesAchieved: number;
  rank: number;
}

export interface FriendResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  branch: string;
  profile: string | null;
  rank: number;
}

export type FriendListResponse = FriendResponse[];

export type FriendRankResponse = FriendResponse[];
