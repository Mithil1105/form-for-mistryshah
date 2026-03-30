import { inputClasses, labelClasses, errorClasses } from "./FormStyles";

type Props = {
  title: string;
  prefix: string;
  formData: Record<string, string>;
  errors: Record<string, string | undefined>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const EducationBlock = ({ title, prefix, formData, errors, onChange, required }: Props) => {
  const field = (key: string) => `${prefix}_${key}`;

  return (
    <div className="border border-border rounded-lg p-4 bg-muted/20">
      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        {title} {required && <span className="text-destructive text-xs">*</span>}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Institute Name & Location</label>
          <input name={field("institute")} type="text" placeholder="Institute & Location" value={formData[field("institute")] || ""} onChange={onChange} className={inputClasses(!!errors[field("institute")])} />
          {errors[field("institute")] && <p className={errorClasses}>{errors[field("institute")]}</p>}
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Year of Passing</label>
          <input name={field("year")} type="number" placeholder="e.g. 2022" value={formData[field("year")] || ""} onChange={onChange} min={1960} max={2030} className={inputClasses(!!errors[field("year")])} />
          {errors[field("year")] && <p className={errorClasses}>{errors[field("year")]}</p>}
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Area of Specialization</label>
          <input name={field("specialization")} type="text" placeholder="Specialization" value={formData[field("specialization")] || ""} onChange={onChange} className={inputClasses(false)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Percentage</label>
          <input name={field("percentage")} type="number" step="0.01" placeholder="e.g. 85.5" value={formData[field("percentage")] || ""} onChange={onChange} min={0} max={100} className={inputClasses(false)} />
        </div>
      </div>
    </div>
  );
};

export default EducationBlock;
