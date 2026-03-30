export const inputClasses = (hasError: boolean) =>
  `w-full px-3.5 py-2.5 rounded-lg border text-sm font-body text-foreground bg-card placeholder:text-muted-foreground/60 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 focus:shadow-sm ${
    hasError ? "border-destructive ring-1 ring-destructive/20" : "border-border hover:border-primary/30"
  }`;

export const labelClasses = "block text-sm font-medium text-foreground mb-1.5";
export const errorClasses = "text-xs text-destructive mt-1 flex items-center gap-1";
export const sectionHeadingClasses = "text-base font-heading font-bold text-foreground";
export const sectionDividerClasses = "mt-6";
