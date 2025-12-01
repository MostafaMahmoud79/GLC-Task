"use server";

import { LoginFormInputs, loginFormSchema } from "@/lib/validation/login-schema";
import { cookies } from "next/headers";


const VALID_USERS = [
  { 
    email: 'admin@example.com', 
    password: '123456', 
    role: 'Admin' as const,
    name: 'Admin User'
  },
  { 
    email: 'manager@example.com', 
    password: '123456', 
    role: 'ProjectManager' as const,
    name: 'Project Manager'
  },
  { 
    email: 'dev@example.com', 
    password: '123456', 
    role: 'Developer' as const,
    name: 'Developer User'
  }
];

type SuccessRes = {
  status: "success";
  message: string;
  token: string;
  user: {
    email: string;
    role: "Admin" | "ProjectManager" | "Developer";
    name: string;
  };
};

type FailedRes = {
  status: "validationError" | "error";
  error: {
    status: number;
    message: string;
  };
};

type ActionResponse = Promise<SuccessRes | FailedRes>;

export async function loginAction(inputs: LoginFormInputs): ActionResponse {

  const result = loginFormSchema.safeParse(inputs);

  if (!result.success) {
    return {
      status: "validationError",
      error: {
        message: "Please provide valid email and password.",
        status: 400,
      },
    };
  }

  const data = result.data;

  try {
    const user = VALID_USERS.find(
      u => u.email.toLowerCase() === data.email.toLowerCase() && 
           u.password === data.password
    );

    if (!user) {
      return {
        status: "error",
        error: {
          message: "Invalid email or password. Please check your credentials.",
          status: 401,
        },
      };
    }

    const fakeToken = `jwt-${user.role}-${Date.now()}`;
    const userInfo = { 
      email: user.email, 
      role: user.role,
      name: user.name 
    };

    const oneWeek = 60 * 60 * 24 * 7;

    (await cookies()).set({
      name: "jwt",
      value: fakeToken,
      httpOnly: true,
      secure: true,
      maxAge: oneWeek,
    });

    (await cookies()).set({
      name: "userRole",
      value: user.role,
      httpOnly: true,
      secure: true,
      maxAge: oneWeek,
    });

    (await cookies()).set({
      name: "userEmail",
      value: user.email,
      httpOnly: true,
      secure: true,
      maxAge: oneWeek,
    });

    return {
      status: "success",
      message: "Successfully Logged In.",
      token: fakeToken,
      user: userInfo,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      error: {
        message: "Internal Server Error!",
        status: 500,
      },
    };
  }
}