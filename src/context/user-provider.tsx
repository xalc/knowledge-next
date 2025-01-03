"use client";
import { UserContext } from "@/context/UserContext";

const UserProvider = ({ children, user }: { children: React.ReactNode; user: any }) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
export default UserProvider;
