import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import AuthLayout2 from "../components/AuthLayout2";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";

const registerSchema = z.object({
  username: z.string().min(3, "Username is required"),
  email: z.string().email("Enter a valid email"),
  full_name: z.string().min(3, "Full name is required"),
  wallet_address: z.string().min(10, "Wallet address is required"),
  role: z.enum(["student", "donor", "admin"], { message: "Select a valid role" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Removed unused apiError state
  const navigate = useNavigate();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      full_name: "",
      wallet_address: "",
      role: "student", // default selected option
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setApiError(null);

    try {
      // Log the request payload for debugging
    console.log("Request payload:", {
      email: data.email,
      username: data.username,
      password: data.password,
      full_name: data.full_name,
      wallet_address: data.wallet_address,
      role: data.role,
    });
      // Call the API to register the user
      const response = await fetch("http://studybae.online:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
          full_name: data.full_name,
          wallet_address: data.wallet_address,
          role: data.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
        console.error("Backend error response:", errorData);
        throw new Error(errorData.message || "Registration failed");
      }

      await response.json();

      // Show success message
      toast.success("Registration successful! Please login with your credentials");

      // Redirect to login after registration
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("Registration error:", error);

      // Check if it's a network error
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        setApiError("Unable to connect to the server. Please check your internet connection or try using HTTP instead of HTTPS.");
        toast.error("Connection error. Server may be unavailable.");
      } else {
        setApiError(error instanceof Error ? error.message : "Failed to register. Please try again.");
        toast.error(error instanceof Error ? error.message : "Failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout2>
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Create your account
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Join DSFS to access student funding opportunities
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name="wallet_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet Address</FormLabel>
                <FormControl>
                  <Input placeholder="0x123456789abcdef" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={isLoading}
                    className="w-full border border-gray-300 rounded-md p-2 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="donor">Donor</option>
                    <option value="admin">Admin</option>
                  </select>
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
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </FormControl>
                <div>
                  <FormLabel>
                    I agree to the{" "}
                    <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Privacy Policy
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout2>
  );
};

export default Register;

function setApiError(arg0: string | null) {
  console.error(arg0); // Log the error for debugging
}

