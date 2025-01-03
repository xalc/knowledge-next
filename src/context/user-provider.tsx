"use client";
import { UserContext } from "@/context/UserContext";
type User = {
  id: string;
  name: string;
  email: string;
  updatedAt: Date;
  createdAt: Date;
};
const UserProvider = ({ children, user }: { children: React.ReactNode; user: User }) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
export default UserProvider;
