
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-transparent',
	{
		variants: {
			variant: {
				default: 
          'bg-primary text-primary-foreground hover:bg-[#39FF14] hover:text-black hover:border-[#39FF14] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]',
				destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]',
				outline:
          'border-[#C0C0C0] bg-transparent hover:bg-[#39FF14]/10 hover:text-[#39FF14] hover:border-[#39FF14] hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]',
				secondary:
          'bg-secondary text-secondary-foreground hover:bg-[#39FF14]/20 hover:text-[#39FF14] hover:border-[#39FF14]/50',
				ghost: 
          'hover:bg-[#39FF14]/10 hover:text-[#39FF14]',
				link: 
          'text-primary underline-offset-4 hover:underline hover:text-[#39FF14] hover:drop-shadow-[0_0_5px_rgba(57,255,20,0.6)]',
        neon:
          'bg-[#39FF14] text-black font-bold border border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:bg-[#32cc12] hover:shadow-[0_0_30px_rgba(57,255,20,0.7)] hover:scale-105'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };
