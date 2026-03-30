import { Briefcase, GraduationCap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { errorClasses, sectionHeadingClasses, sectionDividerClasses } from "./FormStyles";

type Props = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

const ApplicationTypeSelector = ({ value, error, onChange }: Props) => {
  const options = [
    { id: "Job", label: "Job Application", desc: "Apply for full-time employment", icon: Briefcase },
    { id: "Articleship", label: "Articleship", desc: "Apply for articleship training", icon: GraduationCap },
  ];

  return (
    <div className={sectionDividerClasses} id="application_type">
      <div className="form-section">
        <div className="form-section-header">
          <div className="form-section-icon"><ChevronRight size={16} /></div>
          <div>
            <h2 className={sectionHeadingClasses}>
              Applying For <span className="text-destructive">*</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Select the type of position you're applying for</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((opt) => {
            const isSelected = value === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange(opt.id)}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-lg border-2 transition-all duration-200 cursor-pointer text-left group",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30 hover:shadow-sm bg-card"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  <opt.icon size={22} />
                </div>
                <div>
                  <span className={cn("text-sm font-semibold block", isSelected ? "text-primary" : "text-foreground")}>
                    {opt.label}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5 block">{opt.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
        {error && <p className={cn(errorClasses, "mt-2")}>{error}</p>}
      </div>
    </div>
  );
};

export default ApplicationTypeSelector;
