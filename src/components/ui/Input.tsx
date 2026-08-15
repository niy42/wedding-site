import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldStyles =
  "w-full rounded-[var(--radius-sm)] border border-ink/20 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-clay transition-colors";

interface FieldWrapperProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

interface InputProps
  extends FieldWrapperProps,
    InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-xs font-medium uppercase tracking-wide text-sage">
          {label}
          {required && <span aria-hidden className="text-clay"> *</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(fieldStyles, error && "border-clay", className)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          required={required}
          {...props}
        />
        {hint && !error && <p className="text-xs text-sage">{hint}</p>}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-clay">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextAreaProps
  extends FieldWrapperProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-xs font-medium uppercase tracking-wide text-sage">
          {label}
          {required && <span aria-hidden className="text-clay"> *</span>}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={cn(fieldStyles, "resize-none", error && "border-clay", className)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          required={required}
          {...props}
        />
        {hint && !error && <p className="text-xs text-sage">{hint}</p>}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-clay">
            {error}
          </p>
        )}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";
