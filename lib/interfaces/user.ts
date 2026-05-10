export interface UserProps {
  id: string;
  imageUrl: string;
  username: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}
