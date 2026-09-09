import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--color-surface)] group-[.toaster]:text-[var(--color-text-primary)] group-[.toaster]:border-[var(--color-border)] group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-[var(--color-text-secondary)]",
          actionButton:
            "group-[.toast]:bg-[var(--color-primary)] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[var(--color-surface-2)] group-[.toast]:text-[var(--color-text-primary)]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
