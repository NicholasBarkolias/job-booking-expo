import * as React from "react"
import { Text, Pressable, StyleSheet } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline: "",
        secondary: "",
        ghost: "",
        link: "",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const buttonTextVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline: "",
        secondary: "",
        ghost: "",
        link: "",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  default: {
    backgroundColor: '#3b82f6',
  },
  destructive: {
    backgroundColor: '#ef4444',
  },
  outline: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  secondary: {
    backgroundColor: '#f1f5f9',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
  },
  sizeDefault: {
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sizeSm: {
    height: 36,
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  sizeLg: {
    height: 44,
    borderRadius: 6,
    paddingHorizontal: 32,
  },
  sizeIcon: {
    height: 40,
    width: 40,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  textDefault: {
    color: '#ffffff',
  },
  textDestructive: {
    color: '#ffffff',
  },
  textOutline: {
    color: '#1e293b',
  },
  textSecondary: {
    color: '#1e293b',
  },
  textGhost: {
    color: '#1e293b',
  },
  textLink: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  textSizeDefault: {
    fontSize: 16,
  },
  textSizeSm: {
    fontSize: 14,
  },
  textSizeLg: {
    fontSize: 18,
  },
  textSizeIcon: {
    fontSize: 16,
  },
})

interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof Pressable>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Pressable
        style={[
          styles.button,
          variant === 'default' && styles.default,
          variant === 'destructive' && styles.destructive,
          variant === 'outline' && styles.outline,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost' && styles.ghost,
          variant === 'link' && styles.link,
          size === 'default' && styles.sizeDefault,
          size === 'sm' && styles.sizeSm,
          size === 'lg' && styles.sizeLg,
          size === 'icon' && styles.sizeIcon,
        ]}
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
        style={[
          styles.text,
          variant === 'default' && styles.textDefault,
          variant === 'destructive' && styles.textDestructive,
          variant === 'outline' && styles.textOutline,
          variant === 'secondary' && styles.textSecondary,
          variant === 'ghost' && styles.textGhost,
          variant === 'link' && styles.textLink,
          size === 'default' && styles.textSizeDefault,
          size === 'sm' && styles.textSizeSm,
          size === 'lg' && styles.textSizeLg,
          size === 'icon' && styles.textSizeIcon,
        ]}
        ref={ref}
        {...props}
      />
    )
  }
)
ButtonText.displayName = "ButtonText"

export { Button, ButtonText, buttonVariants, buttonTextVariants }