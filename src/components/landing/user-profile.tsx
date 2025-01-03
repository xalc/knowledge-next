import { verifySession } from "@/lib/dal";

import { UserContext } from "@/context/UserContext";
import UserProvider from "../../context/user-provider";

const verifyUser = async () => {
  const verify = await verifySession();
  if (verify.isAuth) {
    return verify;
  }
  return null;
};
const WrapUserProfile = async ({ children }: { children: React.ReactNode }) => {
  const User = await verifyUser();

  return <UserProvider user={User}>{children}</UserProvider>;
};
export default WrapUserProfile;
