export default function BlogLayout({ children }) {
  return (
    <>
      <div className="mx-auto w-5/6 min-w-96 max-w-[1000px]">{children}</div>
    </>
  );
}
