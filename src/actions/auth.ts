'use server'

import { FormState, SignupFormSchema } from "@/components/landing/signup";
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs";
const prisma = new PrismaClient()

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })


  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Call the provider or db to create a user...
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
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