import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function Container<T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? 'div';
  return (
    <Component className={cn('mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </Component>
  );
}
