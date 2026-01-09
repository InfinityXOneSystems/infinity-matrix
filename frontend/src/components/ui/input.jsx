
import React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // Default Styles
        'flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground transition-all duration-300',
        // Border: Always Silver by default as requested
        'border border-[#C0C0C0]',
        // Focus State: Neon Green Glow & Border
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#39FF14] focus-visible:border-[#39FF14] focus-visible:shadow-[0_0_10px_rgba(57,255,20,0.3)]',
        // Hover State
        'hover:border-[#39FF14]/70 hover:shadow-[0_0_5px_rgba(57,255,20,0.1)]',
        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
