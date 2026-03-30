import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldProps } from "./types";
import { inputClasses, labelClasses, errorClasses, sectionHeadingClasses } from "./FormStyles";

const ArticleshipFields = ({ formData, errors, onChange }: FieldProps) => {
  return (
    <div>
      <div className="form-section-header">
        <div className="form-section-icon"><GraduationCap size={16} /></div>
        <h3 className={sectionHeadingClasses}>Articleship Details</h3>
      </div>
      <div>
        <label className={labelClasses}>Whether transfer case? <span className="text-destructive">*</span></label>
        <div id="is_transfer_case" className="flex gap-1 mt-1.5 max-w-xs">
          {["Yes", "No"].map((v) => (
            <button key={v} type="button" onClick={() => onChange({ target: { name: "is_transfer_case", value: v } } as any)}
              className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200",
                formData.is_transfer_case === v ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card text-foreground hover:border-primary/30"
              )}>{v}</button>
          ))}
        </div>
        {errors.is_transfer_case && <p className={errorClasses}>{errors.is_transfer_case}</p>}
      </div>

      {formData.is_transfer_case === "Yes" && (
        <div className="mt-4 animate-in fade-in-0 duration-200">
          <label htmlFor="transfer_case_details" className={labelClasses}>
            Please specify the firm name and period of articleship training completed <span className="text-destructive">*</span>
          </label>
          <textarea id="transfer_case_details" name="transfer_case_details" rows={3} placeholder="Name of the firm, period of training completed, etc." value={formData.transfer_case_details} onChange={onChange} className={inputClasses(!!errors.transfer_case_details)} />
          {errors.transfer_case_details && <p className={errorClasses}>{errors.transfer_case_details}</p>}
        </div>
      )}
    </div>
  );
};

export default ArticleshipFields;
