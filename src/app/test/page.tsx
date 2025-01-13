export const dynamic = "force-static";
const badgesUrl = `https://www.credly.com/users/xalc/badges`;
const getCredlyStatic = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 10 },
  };
  const response = await fetch(badgesUrl, options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const responseData = await response.json();
  return responseData.data;
};
const TestPage = async () => {
  const badges = await getCredlyStatic();

  return (
    <div className="container mx-auto mt-12 lg:max-w-[1024px]">
      {badges.map(badge => (
        <div key={badge.id}>{badge.id}</div>
      ))}
    </div>
  );
};

export default TestPage;
