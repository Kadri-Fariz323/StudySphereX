import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-indigo-700 placeholder:text-black",
        "selection:bg-indigo-600 selection:text-white",
        "border-indigo-300 dark:border-indigo-700",
        "dark:bg-indigo-900/20",
        "focus-visible:border-indigo-500 focus-visible:ring-indigo-500/40 focus-visible:ring-[3px]",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500",
        "h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow]",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}


export { Input }
