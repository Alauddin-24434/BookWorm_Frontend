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
  const redirectTo = searchParams.get("redirectTo") || "/"
  const [login, { isLoading }] = useLoginUserMutation()

  const {
    register,
    handleSubmit,
    reset,
    setValue, // Added setValue to programmatically set form values
    formState: { errors },
  } = useForm<LoginFormData>()

  // === Handle form submission ===
  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data).unwrap();
      const { user, accessToken } = response.data
      // === Save user and token to Redux store ===
      dispatch(setUser({ user, token: accessToken }))
      // === Reset form and navigate ===
      reset()
      router.replace(redirectTo)
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred")
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* === Background image overlay === */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10" />
      <div className="relative w-full max-w-md">
        {/* === Login Card === */}
        <div className="bg-main rounded-2xl p-8 shadow-2xl">
          {/* === Header === */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold title mb-2">Welcome Back</h1>
            <p className="text-foreground">Sign in to your resort account</p>
          </div>
          {/* === Login Form === */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* === Email Input === */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="bg-background border-slate-600 text-foreground placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20"
              />
              {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
            </div>
            {/* === Password Input === */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
                className="bg-background border-slate-600 text-foreground placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20"
              />
              {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
            </div>
        
             {/* === Submit Button === */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#bf9310] cursor-pointer hover:bg-yellow-500 text-foreground font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-orange-500/25 disabled:opacity-50"
            >
             {isLoading ? "Loading..." : "Sign In"} 
            </Button>
          
            
          </form>


          {/* === Signup Redirect Link === */}
          <div className="text-center mt-6">
            <p className="text-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="title hover:text-yellow-500 font-medium transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* === Toast Container for Notifications === */}
      <Toaster position="top-right" />
    </div>
  )
}