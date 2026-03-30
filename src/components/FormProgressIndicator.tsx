import { cn } from "@/lib/utils";

const FormProgressIndicator = ({
  step,
  applicationType,
}: {
  step: number;
  applicationType: string;
}) => {
  const sections = [
    { id: 1, label: "Personal Details" },
    { id: 2, label: applicationType === "Job" ? "Job Details" : applicationType === "Articleship" ? "Articleship Details" : "Application Type" },
    { id: 3, label: "Resume & Submit" },
  ];

  const activeSection = !applicationType ? 1 : step >= 2 ? 3 : step + 1;

  return (
    <div className="flex items-center justify-between max-w-md mx-auto py-2">
      {sections.map((section, index) => (
        <div key={section.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300",
                activeSection >= section.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {section.id}
            </div>
            <span
              className={cn(
                "text-[10px] mt-1.5 hidden sm:block transition-colors duration-300 text-center max-w-[80px]",
                activeSection >= section.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              {section.label}
            </span>
          </div>
          {index < sections.length - 1 && (
            <div className="flex-1 mx-3">
              <div className="h-0.5 w-full bg-muted rounded-full relative overflow-hidden">
                <div
                  className="h-0.5 bg-primary rounded-full transition-all duration-500"
                  style={{ width: activeSection > section.id ? "100%" : "0%" }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormProgressIndicator;
