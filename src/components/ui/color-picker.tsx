
import * as React from "react"
import { cn } from "@/lib/utils"

interface ColorPickerProps extends React.HTMLAttributes<HTMLDivElement> {
  colors: string[]
  selectedColor?: string
  onColorSelect: (color: string) => void
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ className, colors, selectedColor, onColorSelect, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn("flex flex-wrap gap-2", className)} 
        {...props}
      >
        {colors.map((color) => (
          <button
            key={color}
            className={cn(
              "h-8 w-8 rounded-full transition-all hover:scale-110 border",
              selectedColor === color && "ring-2 ring-primary ring-offset-2"
            )}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
            type="button"
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
    )
  }
)

ColorPicker.displayName = "ColorPicker"

export { ColorPicker }
