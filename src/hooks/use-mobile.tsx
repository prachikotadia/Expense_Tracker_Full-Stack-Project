
import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

interface MobileNavProps {
  items: {
    name: string
    path: string
    icon: React.ReactNode
  }[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ items, open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0">
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 border-b">
            <Link 
              to="/"
              className="flex items-center gap-2 text-lg font-semibold"
              onClick={() => onOpenChange(false)}
            >
              ExpensiMate
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="flex flex-col gap-1 px-2">
              {items.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  asChild
                  className="justify-start"
                  onClick={() => onOpenChange(false)}
                >
                  <Link to={item.path} className="flex items-center gap-3 px-2">
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
