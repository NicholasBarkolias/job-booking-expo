import * as React from "react"
import { TextInput } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "web:flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm web:ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium web:placeholder:text-muted-foreground web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
  {
    variants: {
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-9 px-2 py-1",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <TextInput
        className={cn(inputVariants({ size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }