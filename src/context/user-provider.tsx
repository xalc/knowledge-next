"use client";
import { UserContext } from "@/context/UserContext";
export type UserType = {
  id: string;
  name: string;
  email: string;
  updatedAt: Date;
  createdAt: Date;
  isAuth?: boolean;
};
const UserProvider = ({ children, user }: { children: React.ReactNode; user: UserType }) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
export default UserProvider;
