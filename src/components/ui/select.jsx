import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const SelectContext = React.createContext();

export function Select({ children, value, onValueChange }) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (
        triggerRef.current && 
        !triggerRef.current.contains(target) &&
        contentRef.current &&
        !contentRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      // Use a small delay to avoid immediate closing
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, triggerRef, contentRef }}>
      <div className="relative" ref={selectRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className, ...props }) {
  const { open, setOpen, triggerRef } = React.useContext(SelectContext);
  
  return (
    <button
      type="button"
      ref={triggerRef}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", open && "rotate-180")} />
    </button>
  );
}

export function SelectValue({ placeholder, ...props }) {
  const { value } = React.useContext(SelectContext);
  return <span {...props}>{value || placeholder}</span>;
}

export function SelectContent({ children, className, ...props }) {
  const { open, triggerRef, contentRef } = React.useContext(SelectContext);
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 });

  const updatePosition = React.useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        // The dropdown is rendered with `position: fixed`, so coordinates must be viewport-relative.
        // `getBoundingClientRect()` is already viewport-relative; adding scroll offsets would push it off-screen.
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [triggerRef]);

  React.useEffect(() => {
    if (open) {
      updatePosition();
      
      // Update position on scroll and resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [open, updatePosition]);

  if (!open) return null;
  
  const content = (
    <div
      ref={contentRef}
      className="fixed z-[9999] min-w-[8rem] max-h-[300px] overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
    >
      <div className={cn("p-1", className)} {...props}>
        {children}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

export function SelectItem({ children, value, className, ...props }) {
  const { onValueChange, setOpen } = React.useContext(SelectContext);

  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
}




