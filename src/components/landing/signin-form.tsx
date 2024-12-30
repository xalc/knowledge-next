'use client'
import { Card, CardContent } from "../ui/card";
import { SigninFormSchema } from "./signin";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signin } from "@/actions/auth";

import { useActionState, startTransition } from 'react'

export default function SignInForm() {
  const form = useForm<z.infer<typeof SigninFormSchema>>({
    resolver: zodResolver(SigninFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const [state, formAction, pending] = useActionState(signin, undefined)
  const onSubmit = async (values: z.infer<typeof SigninFormSchema>) => {
    console.log(values);
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key])
    }
    startTransition(async () => {
      await formAction(formData)
    })

  }
  return <Card>
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-8" >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input placeholder="type email " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>{pending ? "Submitting..." : "Submit"}</Button>

          {
            state?.message && <p>{state.message}</p>
          }
        </form>
      </Form>
    </CardContent>
  </Card>
}