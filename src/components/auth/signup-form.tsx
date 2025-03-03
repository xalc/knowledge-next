"use client";

import { signup } from "@/actions/auth";
import { useActionState } from "react";
import { Card, CardContent } from "../ui/card";

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  return (
    <Card>
      <CardContent>
        <form action={action} className="space-y-12">
          <div className="space-x-6">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" placeholder="Name" />
          </div>
          {state?.errors?.name && <p>{state.errors.name}</p>}
          <div className="space-x-6">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Email" />
          </div>
          {state?.errors?.email && <p>{state.errors.email}</p>}
          <div className="space-x-6">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          {state?.errors?.password && (
            <div>
              <p>Password must:</p>
              <ul>
                {state.errors.password.map(error => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          )}
          <button disabled type="submit">
            {pending ? "pending" : "sigh up"}
          </button>
          {state?.message && <p>{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
