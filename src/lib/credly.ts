import { unstable_cache } from "next/cache";
const badgesUrl = `https://www.credly.com/users/xalc/badges`;

const getCredly = unstable_cache(
  async () => {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };
    const response = await fetch(badgesUrl, options);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData.data;
  },
  ["credly"],
  { revalidate: 3600 * 24 * 7, tags: ["credly"] },
);
const getCredlyStatic = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  const response = await fetch(badgesUrl, options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const responseData = await response.json();
  return responseData.data;
};

export { getCredly, getCredlyStatic };
