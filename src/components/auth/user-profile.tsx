import { verifySession } from "@/lib/dal";
import UserProvider, { UserType } from "../../context/user-provider";

const verifyUser = async () => {
  const verify = await verifySession();
  if (verify.isAuth) {
    return verify as UserType;
  }
  return null;
};
const WrapUserProfile = async ({ children }: { children: React.ReactNode }) => {
  const User = await verifyUser();

  return <UserProvider user={User}>{children}</UserProvider>;
};
export default WrapUserProfile;
