import { SignupForm } from "@/components/auth/signup-form";

export default function SingupPage() {
  return (
    <div className="container mx-auto mt-16 max-w-[768px]">
      <div className="mx-8 space-y-8">
        <h1>Signup</h1>
        <SignupForm></SignupForm>
      </div>
    </div>
  );
}
