import * as React from "react"
import { Text, Pressable } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group flex items-center justify-center rounded-md web:ring-offset-background web:ring-ring web:ring-offset-2 web:focus-within:ring-2 web:focus-within:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary web:ring-primary",
        destructive: "bg-destructive web:ring-destructive",
        outline: "border border-input bg-background web:ring-ring",
        secondary: "bg-secondary web:ring-secondary",
        ghost: "",
        link: "web:underline-offset-4 web:hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const buttonTextVariants = cva(
  "text-sm font-medium text-foreground web:group-focus-within:ring-2",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        destructive: "text-destructive-foreground",
        outline: "text-foreground",
        secondary: "text-secondary-foreground",
        ghost: "text-foreground",
        link: "text-primary web:underline",
      },
      size: {
        default: "text-base",
        sm: "text-sm",
        lg: "text-lg",
        icon: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof Pressable>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Pressable
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

interface ButtonTextProps
  extends React.ComponentPropsWithoutRef<typeof Text>,
    VariantProps<typeof buttonTextVariants> {}

const ButtonText = React.forwardRef<React.ElementRef<typeof Text>, ButtonTextProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Text
        className={cn(buttonTextVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
ButtonText.displayName = "ButtonText"

export { Button, ButtonText, buttonVariants, buttonTextVariants }