import * as React from "react"
import { View, Text, StyleSheet } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  default: {
    borderColor: '#e2e8f0',
  },
  outline: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  header: {
    flexDirection: 'column',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  footer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
    paddingTop: 0,
  },
})

interface CardProps
  extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<React.ElementRef<typeof View>, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <View
      ref={ref}
      style={[
        styles.card,
        variant === 'default' && styles.default,
        variant === 'outline' && styles.outline,
      ]}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<React.ElementRef<typeof View>, React.ComponentPropsWithoutRef<typeof View>>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      style={styles.header}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<React.ElementRef<typeof Text>, React.ComponentPropsWithoutRef<typeof Text>>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      style={styles.title}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<React.ElementRef<typeof Text>, React.ComponentPropsWithoutRef<typeof Text>>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      style={styles.description}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<React.ElementRef<typeof View>, React.ComponentPropsWithoutRef<typeof View>>(
  ({ className, ...props }, ref) => (
    <View ref={ref} style={styles.content} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<React.ElementRef<typeof View>, React.ComponentPropsWithoutRef<typeof View>>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      style={styles.footer}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }