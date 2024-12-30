import { verifySession } from '@/lib/dal';

import { UserContext } from '@/context/UserContext';
import UserProvider from './user-provider';

const verifyUser = async () => {
  const verify = await verifySession();
  if (verify.isAuth) {
    return verify;
  }
  return null;
}
const UserProfile = async ({ children }: {
  children: React.ReactNode
}) => {
  const User = await verifyUser();

  return (

    <UserProvider user={User}>
      {children}
    </UserProvider>

  );
}
export default UserProfile;