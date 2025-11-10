import * as React from "react"
import { TextInput, StyleSheet } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "",
  {
    variants: {
      size: {
        default: "",
        sm: "",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: 14,
  },
  sizeDefault: {
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sizeSm: {
    height: 36,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
})

interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <TextInput
        style={[
          styles.input,
          size === 'default' && styles.sizeDefault,
          size === 'sm' && styles.sizeSm,
        ]}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }