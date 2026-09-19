"use client";

import React, {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";
import { cn } from "@/lib/utils";

/* ============================================================
 * BUTTON
 * ============================================================ */

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-medium transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variants: Record<ButtonVariant, string> = {
      primary:
        "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] shadow-sm",
      secondary:
        "bg-[var(--accent)] text-[var(--primary-foreground)] hover:bg-[var(--accent-hover)]",
      ghost:
        "bg-transparent text-[var(--text)] hover:bg-[var(--surface-muted)]",
      outline:
        "bg-transparent border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--surface-muted)]",
      danger:
        "bg-[var(--danger)] text-white hover:opacity-90",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-9 px-4 text-sm rounded-md",
      lg: "h-11 px-5 text-base rounded-md",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              opacity="0.25"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon && !isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";

/* ============================================================
 * CARD
 * ============================================================ */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export function Card({
  className,
  padding = "md",
  hover,
  ...props
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-6",
  };
  return (
    <div
      className={cn(
        "bg-[var(--surface)] border border-[var(--border)] rounded-lg",
        hover &&
          "transition-all hover:border-[var(--border-strong)] hover:shadow-sm cursor-pointer",
        paddings[padding],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between pb-4 mb-4 border-b border-[var(--border)]",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold text-[var(--text)]", className)}
      {...props}
    />
  );
}

/* ============================================================
 * INPUT
 * ============================================================ */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-9 px-3 bg-[var(--surface)] border border-[var(--border)] rounded-md text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] transition-colors focus-ring",
              "focus:border-[var(--ring)] focus:bg-[var(--surface)]",
              error && "border-[var(--danger)]",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-[var(--danger)]">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-xs text-[var(--text-subtle)]">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

/* ============================================================
 * TEXTAREA
 * ============================================================ */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full min-h-[80px] px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] transition-colors focus-ring",
            "focus:border-[var(--ring)]",
            error && "border-[var(--danger)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-[var(--danger)]">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

/* ============================================================
 * SELECT
 * ============================================================ */

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-9 px-3 bg-[var(--surface)] border border-[var(--border)] rounded-md text-sm text-[var(--text)] transition-colors focus-ring",
            "focus:border-[var(--ring)]",
            error && "border-[var(--danger)]",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-xs text-[var(--danger)]">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

/* ============================================================
 * BADGE
 * ============================================================ */

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  ...props
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-[var(--surface-muted)] text-[var(--text-muted)]",
    primary: "bg-[var(--primary)]/10 text-[var(--primary)]",
    success: "bg-[var(--success-bg)] text-[var(--success)]",
    warning: "bg-[var(--warning-bg)] text-[var(--warning)]",
    danger: "bg-[var(--danger-bg)] text-[var(--danger)]",
    info: "bg-[var(--info-bg)] text-[var(--info)]",
    outline: "bg-transparent border border-[var(--border-strong)] text-[var(--text-muted)]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-md whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

/* ============================================================
 * STATUS BADGE (consistent across app)
 * ============================================================ */

const STATUS_STYLES: Record<string, BadgeVariant> = {
  new: "info",
  contacted: "info",
  followup: "warning",
  quoted: "primary",
  negotiation: "warning",
  approved: "success",
  accepted: "success",
  completed: "success",
  paid: "success",
  active: "success",
  published: "success",

  rejected: "danger",
  cancelled: "danger",
  failed: "danger",
  overdue: "danger",
  suspended: "danger",
  urgent: "danger",

  draft: "default",
  archived: "default",
  inactive: "default",
  pending: "warning",
  partial: "warning",
  follow_up: "warning",
  sent: "primary",
  viewed: "primary",
  expired: "outline",
  refunded: "outline",

  planning: "default",
  design: "primary",
  measurement: "info",
  procurement: "warning",
  manufacturing: "primary",
  installation: "warning",

  low: "default",
  medium: "info",
  high: "warning",

  in_progress: "primary",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  followup: "Follow-up",
  follow_up: "Follow-up",
  quoted: "Quoted",
  negotiation: "Negotiation",
  approved: "Approved",
  accepted: "Accepted",
  rejected: "Rejected",
  completed: "Completed",
  archived: "Archived",
  draft: "Draft",
  sent: "Sent",
  viewed: "Viewed",
  expired: "Expired",
  cancelled: "Cancelled",
  planning: "Planning",
  design: "Design",
  measurement: "Measurement",
  procurement: "Procurement",
  manufacturing: "Manufacturing",
  installation: "Installation",
  pending: "Pending",
  in_progress: "In Progress",
  paid: "Paid",
  partial: "Partial",
  failed: "Failed",
  refunded: "Refunded",
  overdue: "Overdue",
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
  published: "Published",
};

export function StatusBadge({
  status,
  size = "sm",
}: {
  status: string;
  size?: "sm" | "md";
}) {
  const variant = STATUS_STYLES[status] || "default";
  const label = STATUS_LABELS[status] || status.replace(/_/g, " ");
  return (
    <Badge variant={variant} size={size}>
      {label}
    </Badge>
  );
}

/* ============================================================
 * USER AVATAR
 * ============================================================ */

interface UserAvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  imageUrl?: string | null;
}

export function UserAvatar({
  name,
  size = "md",
  imageUrl,
  className,
}: UserAvatarProps) {
  const sizes = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (imageUrl) {
    return (
      <div
        className={cn(
          "rounded-full overflow-hidden bg-[var(--surface-muted)] border border-[var(--border)]",
          sizes[size],
          className
        )}
      >
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  // Generate consistent color based on name
  const colors = [
    "bg-[#6b4423]/15 text-[#6b4423]",
    "bg-[#a87b4f]/15 text-[#a87b4f]",
    "bg-[#4f7a3f]/15 text-[#4f7a3f]",
    "bg-[#2f6b8a]/15 text-[#2f6b8a]",
    "bg-[#a03a2a]/15 text-[#a03a2a]",
    "bg-[#8a5a2f]/15 text-[#8a5a2f]",
  ];
  const colorIndex =
    name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
    colors.length;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold border border-[var(--border)]",
        sizes[size],
        colors[colorIndex],
        className
      )}
    >
      {initials || "?"}
    </div>
  );
}

/* ============================================================
 * MODAL / DIALOG
 * ============================================================ */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  footer,
}: ModalProps) {
  if (!open) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-xl w-full animate-fade-in",
          sizes[size]
        )}
      >
        {title && (
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text)]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--text-subtle)] hover:text-[var(--text)] transition-colors"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--border)] flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * CONFIRM DIALOG
 * ============================================================ */

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-[var(--text-muted)]">{message}</p>
    </Modal>
  );
}

/* ============================================================
 * SKELETON
 * ============================================================ */

export function Skeleton({
  className,
  height = "h-4",
  width = "w-full",
}: {
  className?: string;
  height?: string;
  width?: string;
}) {
  return <div className={cn("skeleton", height, width, className)} />;
}

/* ============================================================
 * EMPTY STATE
 * ============================================================ */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="mb-4 text-[var(--text-subtle)] opacity-60">{icon}</div>
      )}
      <h3 className="text-base font-semibold text-[var(--text)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--text-muted)] max-w-md mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

/* ============================================================
 * TOAST (simple implementation)
 * ============================================================ */

interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
}

let toastListeners: ((toasts: ToastMessage[]) => void)[] = [];
let currentToasts: ToastMessage[] = [];

export function toast(
  type: ToastMessage["type"],
  title: string,
  message?: string
) {
  const id = Math.random().toString(36).slice(2);
  const newToast: ToastMessage = { id, type, title, message };
  currentToasts = [...currentToasts, newToast];
  toastListeners.forEach((fn) => fn(currentToasts));
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    toastListeners.forEach((fn) => fn(currentToasts));
  }, 4000);
}

export function ToastContainer() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  React.useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  const typeStyles: Record<string, string> = {
    success: "border-l-4 border-l-[var(--success)]",
    error: "border-l-4 border-l-[var(--danger)]",
    warning: "border-l-4 border-l-[var(--warning)]",
    info: "border-l-4 border-l-[var(--info)]",
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg p-4 pointer-events-auto animate-slide-in",
            typeStyles[t.type]
          )}
        >
          <div className="font-medium text-sm text-[var(--text)]">{t.title}</div>
          {t.message && (
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {t.message}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
 * TABS
 * ============================================================ */

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 border-b border-[var(--border)] overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors relative",
            value === tab.id
              ? "text-[var(--primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text)]"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                "ml-2 px-1.5 py-0.5 text-[10px] rounded-full",
                value === tab.id
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "bg-[var(--surface-muted)] text-[var(--text-subtle)]"
              )}
            >
              {tab.count}
            </span>
          )}
          {value === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />
          )}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
 * BREADCRUMB
 * ============================================================ */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="opacity-40">/</span>}
          {item.href ? (
            <a
              href={item.href}
              className="hover:text-[var(--primary)] transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-[var(--text)]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ============================================================
 * PAGE HEADER
 * ============================================================ */

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && <div className="mb-3"><Breadcrumb items={breadcrumbs} /></div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)] tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/* ============================================================
 * DROPDOWN MENU
 * ============================================================ */

interface DropdownItem {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  divider?: boolean;
}

export function Dropdown({
  trigger,
  items,
  align = "right",
}: {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-40 mt-1.5 min-w-[180px] py-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg animate-fade-in",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, i) => {
            if (item.divider) {
              return (
                <div
                  key={i}
                  className="h-px bg-[var(--border)] my-1"
                />
              );
            }
            return (
              <button
                key={i}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
                  item.danger
                    ? "text-[var(--danger)] hover:bg-[var(--danger-bg)]"
                    : "text-[var(--text)] hover:bg-[var(--surface-muted)]"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
