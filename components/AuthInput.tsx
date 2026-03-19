import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form"

interface AuthInputProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  type?: string;
  placeholder?: string;
}

export const AuthInput: FC<AuthInputProps> = ({ 
  label, 
  error, 
  register, 
  type = "text",
  placeholder 
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-center px-0.5">
        <Label className="text-base font-medium text-gray-700">{label}</Label>
      </div>
      <Input 
        type={type} 
        placeholder={placeholder}
        {...register} 
        className={cn(
          "h-12 px-4 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm transition-all duration-200",
          "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white",
          "placeholder:text-gray-400 text-base",
          error && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1 px-0.5">{error}</p>}
    </div>
  )
}