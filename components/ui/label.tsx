import * as React from "react"
import { Text as LabelText } from "@rn-primitives/label"
import { cn } from "@/lib/utils"

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelText> {}

const Label = React.forwardRef<React.ElementRef<typeof LabelText>, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelText
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Label }