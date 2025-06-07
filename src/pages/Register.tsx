import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

// Import your type-safe API client
// import { studentApi } from "../api/client"; // Adjust the path to your api client file

import AuthLayout2 from "../components/AuthLayout2";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { studentApi } from "../lib/api";

// 1. Updated Schema to match the StudentRegistrationRequest interface
const registerStudentSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    full_name: z.string().min(3, "Full name is required"),
    institution: z.string().min(3, "Institution name is required"),
    student_id: z.string().min(1, "Student ID is required"),
    field_of_study: z.string().min(3, "Field of study is required"),
    // Use z.coerce to safely convert the input string to a number for validation
    year_of_study: z.coerce
      .number({ invalid_type_error: "Year must be a number" })
      .min(1, "Please enter a valid year"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterStudentValues = z.infer<typeof registerStudentSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<RegisterStudentValues>({
    resolver: zodResolver(registerStudentSchema),
    defaultValues: {
      username: "",
      email: "",
      full_name: "",
      institution: "",
      student_id: "",
      field_of_study: "",
      year_of_study: undefined, // Initialize as undefined for number inputs
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // 2. Updated onSubmit to use the type-safe studentApi client
  const onSubmit = async (data: RegisterStudentValues) => {
    setIsLoading(true);
    setApiError(null);

    // The API client handles sending the correct payload.
    // We don't need to manually pick fields like 'confirmPassword' or 'terms'.
    const response = await studentApi.register({
      email: data.email,
      password: data.password,
      username: data.username,
      full_name: data.full_name,
      institution: data.institution,
      student_id: data.student_id,
      field_of_study: data.field_of_study,
      year_of_study: data.year_of_study,
    });

    setIsLoading(false);

    if (response.success) {
      toast.success("Registration successful! Please check your email to verify your account.");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setApiError(response.error);
      toast.error(response.error);
    }
  };

  return (
    <AuthLayout2>
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Create your Student Account 🧑‍🎓
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Join to access student funding opportunities.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* 3. Form fields updated to match the new schema */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="john_doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" type="email" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="University of Example" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Your student ID" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="field_of_study"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field of Study</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Computer Science" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year_of_study"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of Study</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 3" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Create a password" type="password" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm your password" type="password" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3 pt-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </FormControl>
                <div>
                  <FormLabel>
                    I agree to the{" "}
                    <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Terms of Service
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          {apiError && <p className="text-sm text-red-500 text-center">{apiError}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout2>
  );
};

export default Register;