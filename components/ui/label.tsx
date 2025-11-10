import * as React from "react"
import { Text as LabelText, StyleSheet } from "react-native"

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelText> {}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
})

const Label = React.forwardRef<React.ElementRef<typeof LabelText>, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelText
      ref={ref}
      style={styles.label}
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Label }