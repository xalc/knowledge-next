export default function BlogLayout({ children }) {
  return (
    <>
      <div className="container mx-auto my-8 min-w-96 lg:max-w-[1024px]">{children}</div>
    </>
  );
}
