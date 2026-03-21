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

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { toast } from "@/app/store/toast-store"

export default function ForgotPasswordForm() {
  const isMobile = useIsMobile()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")
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
      setEmail(data.email)
      setIsSubmitted(true)
      toast.success("Reset link sent to your email!");
    } catch (error) {
      console.error("Reset failed:", error)
      toast.error("Failed to send reset link. Please try again.");
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
            {!isSubmitted ? (
              <>
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
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Check your email</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>. 
                  Please check your inbox and follow the instructions.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full h-14 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition-all active:scale-[0.98]"
                >
                  Didn't get the email? Try again
                </Button>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full mt-6 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Link>
              </motion.div>
            )}

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
