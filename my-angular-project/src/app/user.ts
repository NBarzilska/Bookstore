export interface User {
  _id: string;
  email: string;
  username: string;
  password: string;
  created_at: string;
  updatedAt: string;
  __v: number;
}

export interface UserForAuth {
  username: string;
  email: string;
  password: string;
  _id: string;
}

export interface ProfileDetails {
  username: string;
  email: string;
}
