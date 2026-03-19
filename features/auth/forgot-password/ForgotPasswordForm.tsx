"use client"

import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUIStore } from "@/app/store/ui-store"
import { forgotPasswordSchema } from "@/components/schema/auth_schema"
import { ForgotPasswordTypes } from "@/lib/types"
import { AuthInput } from "@/components/AuthInput"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { BackgroundSplit } from "@/components/ui/background-split"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export default function ForgotPasswordForm() {
  const isMobile = useIsMobile()
  const { isLoading, setLoading } = useUIStore()
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordTypes>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordTypes) => {
    setLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Forgot password data:", data)
      // Here you would call your actual reset API
    } catch (error) {
      console.error("Reset failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background with Animation */}
      <div className="absolute inset-0 z-0">
        <BackgroundGradientAnimation
          containerClassName="h-full w-full"
          className="z-0"
        />
      </div>

      <BackgroundSplit 
        className="min-h-screen"
        splitClassName="bg-white"
        variant="diagonal"
      >
        <div className={cn(
          "absolute z-20 transition-all duration-300",
          isMobile ? "top-6 left-1/2 -translate-x-1/2" : "top-8 left-8"
        )}>
          <h1 className={cn(
            "font-bold tracking-tight text-white",
            isMobile ? "text-xl" : "text-2xl"
          )}>Nabula</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "w-full bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden border border-white/20 z-30 transition-all duration-300",
            isMobile ? "rounded-t-[32px] mt-20" : "max-w-[480px] rounded-[32px]"
          )}
        >
          <div className={cn(
            "transition-all duration-300",
            isMobile ? "p-8 md:p-10" : "p-10 md:p-12"
          )}>
            <div className="mb-10">
              <Link 
                href="/login" 
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors mb-6 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to sign in
              </Link>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Forgot password?</h2>
              <p className="text-gray-500 mt-2">Enter your email and we'll send you a link to reset your password.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <AuthInput
                label="Email Address"
                placeholder="Enter your email"
                register={register("email")}
                error={errors.email?.message}
              />

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] mt-2"
              >
                {isLoading && <AiOutlineLoading3Quarters className="animate-spin mr-2" />}
                {isLoading ? "Sending link..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-gray-50 pt-6">
              <p className="text-sm text-gray-500">
                Wait, I remember it!{" "}
                <Link
                  href="/login"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </BackgroundSplit>
    </div>
  )
}
