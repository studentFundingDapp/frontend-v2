import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import AuthLayout2 from "../components/AuthLayout2";
import { Button } from "../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

// eslint-disable-next-line no-empty-pattern
const Login = ({ }: { setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
  setIsLoading(true);
  try {
    const res = await fetch("http://studybae.online:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    let result: unknown = {};
    try {
      result = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (jsonError) {
      // If response is not JSON, fallback to text
      const text = await res.text();
      result = { message: text || "Unknown error" };
    }

    if (!res.ok) {
      console.error("Login failed:", result);
      const errorMessage =
        typeof result === "object" && result !== null && "message" in result
          ? (result as { message?: string }).message
          : undefined;
      throw new Error(errorMessage || "Invalid email or password");
    }

    // OPTIONAL: Store JWT or user info
    const { token, user } = result as { token: string; user?: { role?: string } };
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", user?.role || "");

    toast.success("Login successful!");
    navigate("/dashboard");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to login. Please check your credentials.";
    toast.error(errorMessage);
    console.error("Login error:", error);
  } finally {
    setIsLoading(false);
  }
};
  

  return (
    <AuthLayout2>
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto">
        {/* Auth Form */}
        <div className="w-full md:w-1/2 p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Welcome back
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
            Sign in to your account to continue
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Reasons to Trust DSFS */}
        <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Why Choose DSFS?</h2>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300">
            <li>✔️ Transparent blockchain-based funding.</li>
            <li>✔️ Fast and secure transactions.</li>
            <li>✔️ Empowering students globally.</li>
          </ul>
        </div>
      </div>
    </AuthLayout2>
  );
};

export default Login;
