import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-center px-0.5">
        <Label className="text-base font-medium text-gray-700">{label}</Label>
      </div>
      <div className="relative">
        <Input 
          type={isPassword ? (showPassword ? "text" : "password") : type} 
          placeholder={placeholder}
          {...register} 
          className={cn(
            "h-12 px-4 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm transition-all duration-200",
            "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white",
            "placeholder:text-gray-400 text-base",
            isPassword && "pr-12",
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1 px-0.5">{error}</p>}
    </div>
  )
}