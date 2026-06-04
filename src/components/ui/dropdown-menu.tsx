import * as React from 'react'
import {
  DropdownMenu as RadixDropdownMenu,
  DropdownMenuContent as RadixDropdownMenuContent,
  DropdownMenuItem as RadixDropdownMenuItem,
  DropdownMenuTrigger as RadixDropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

const DropdownMenu = React.forwardRef<
  React.ElementType<typeof RadixDropdownMenu>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenu>
>((props, ref) => (
  <RadixDropdownMenu ref={ref} {...props} />
))
DropdownMenu.displayName = RadixDropdownMenu.displayName

const DropdownMenuTrigger = React.forwardRef<
  React.ElementType<typeof RadixDropdownMenuTrigger>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenuTrigger>
>((props, ref) => (
  <RadixDropdownMenuTrigger ref={ref} {...props} />
))
DropdownMenuTrigger.displayName = RadixDropdownMenuTrigger.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementType<typeof RadixDropdownMenuContent>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenuContent>
>(({ className, children, ...props }, ref) => (
  <RadixDropdownMenuContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  >
    {children}
  </RadixDropdownMenuContent>
))
DropdownMenuContent.displayName = RadixDropdownMenuContent.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementType<typeof RadixDropdownMenuItem>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenuItem>
>(({ className, children, ...props }, ref) => (
  <RadixDropdownMenuItem
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </RadixDropdownMenuItem>
))
DropdownMenuItem.displayName = RadixDropdownMenuItem.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
}