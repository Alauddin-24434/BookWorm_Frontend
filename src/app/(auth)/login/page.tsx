"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLoginUserMutation } from "@/redux/features/auth/authApi"
import { setUser } from "@/redux/features/auth/authSlice"
import { useAppDispatch } from "@/redux/hooks"

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get redirect path or default to home
  const redirectTo = searchParams.get("redirectTo") || "/"
  
  const [login, { isLoading }] = useLoginUserMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>()

  /**
   * Handles the login submission
   * Added checks for nested data structures to prevent "Unexpected Error"
   */
  const onSubmit = async (data: LoginFormData) => {
    const toastId = toast.loading("Authenticating...")
    
    try {
      const response = await login(data).unwrap();
      
      /** * FIX: Backend responses often vary. 
       * We check both response.data.data and response.data 
       */
      const authData = response?.data || response;
      const { result, accessToken } = authData;

      if (!accessToken) {
        throw new Error("Invalid credentials or server error");
      }

      // 1. Update Redux State
      dispatch(setUser({ user: result, token: accessToken }))

      toast.success("Welcome back!", { id: toastId })
      
      // 2. Clear form
      reset()

      // 3. Redirect and Refresh
      // Using router.push and window.location.replace for cleaner state reset
      router.push(redirectTo);
      router.refresh(); 
      
    } catch (err: any) {
      console.error("Login Debug:", err);
      // Catch RTK Query error structure or fallback to generic message
      const errorMessage = err?.data?.message || err?.message || "Something went wrong";
      toast.error(errorMessage, { id: toastId })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-slate-50 opacity-50 -z-10" />
      
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-serif">Welcome Back</h1>
            <p className="text-slate-500">Sign in to manage your library</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                })}
                className="rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
                className="rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#bf9310] hover:bg-[#a37d0d] text-white font-bold py-6 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-slate-600">
              New here?{" "}
              <Link href="/signup" className="text-[#bf9310] hover:underline font-bold">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Global Toaster Configuration */}
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  )
}