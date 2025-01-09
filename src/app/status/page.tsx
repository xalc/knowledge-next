import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function UnauthorizedPage() {
  return (
    <main>
      <h1>401 - Unauthorized </h1>
      <p> Please log in to access this page.</p>
      <Button
        onClick={async () => {
          "use server";
          redirect("/signin");
        }}
      >
        {" "}
        Sign in first{" "}
      </Button>
    </main>
  );
}
