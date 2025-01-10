import SignInForm from "@/components/auth/signin-form";

export default function Page() {
  return (
    <div className="container mx-auto mt-16 max-w-[768px]">
      <div className="mx-8 space-y-8">
        <h1> Login in</h1>
        <SignInForm />
      </div>
    </div>
  );
}
