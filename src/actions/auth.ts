'use server'

import { FormState, SignupFormSchema } from "@/components/landing/signup";
import { SignInFormState, SigninFormSchema } from "@/components/landing/signin";
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from "next/navigation";
const prisma = new PrismaClient()

export async function signup(state: FormState, formData: FormData) {

  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }


  const { name, email, password } = validatedFields.data;

  let user = await prisma.user.findUnique({
    where: {
      email
    }
  })
  if (user) {
    return {
      message: 'The email is already inuse change one.'
    }
  }


  const hashedPassword = await bcrypt.hash(password, 10);
  user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      updatedAt: new Date(),
    }
  });
  if (!user) {
    return {
      message: 'An error occurred while creating your account.'
    }
  }
  return {
    message: 'Account created successfully.'
  };
}


export async function signin(state: SignInFormState, formData: FormData) {

  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  const { email, password } = validatedFields.data;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return { message: "User not found" };
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return { message: "Invalid password" };
  }
  await createSession(user.id);
  redirect('/blogs');
  return { message: "Logged in successfully" };
}


export async function signoff() {
  await deleteSession();
  redirect('/signin');
}