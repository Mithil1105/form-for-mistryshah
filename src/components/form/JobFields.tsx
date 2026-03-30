import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Briefcase, GraduationCap, Building2, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FieldProps } from "./types";
import { inputClasses, labelClasses, errorClasses, sectionHeadingClasses } from "./FormStyles";
import EducationBlock from "./EducationBlock";

type Props = FieldProps & {
  onFieldChange: (name: string, value: string) => void;
};

const JobFields = ({ formData, errors, onChange, onFieldChange }: Props) => {
  const [empFromOpen, setEmpFromOpen] = useState(false);
  const [empToOpen, setEmpToOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Professional Details */}
      <div className="form-section">
        <div className="form-section-header">
          <div className="form-section-icon"><Briefcase size={16} /></div>
          <h3 className={sectionHeadingClasses}>Professional Details</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div id="marital_status">
            <label className={labelClasses}>Marital Status <span className="text-destructive">*</span></label>
            <div className="flex gap-1 mt-1.5">
              {["Married", "Unmarried"].map((s) => (
                <button key={s} type="button" onClick={() => onChange({ target: { name: "marital_status", value: s } } as any)}
                  className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200",
                    formData.marital_status === s ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card text-foreground hover:border-primary/30"
                  )}>{s}</button>
              ))}
            </div>
            {errors.marital_status && <p className={errorClasses}>{errors.marital_status}</p>}
          </div>
          <div id="is_qualified_ca">
            <label className={labelClasses}>Qualified Chartered Accountant? <span className="text-destructive">*</span></label>
            <div className="flex gap-1 mt-1.5">
              {["Yes", "No"].map((v) => (
                <button key={v} type="button" onClick={() => onChange({ target: { name: "is_qualified_ca", value: v } } as any)}
                  className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200",
                    formData.is_qualified_ca === v ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card text-foreground hover:border-primary/30"
                  )}>{v}</button>
              ))}
            </div>
            {errors.is_qualified_ca && <p className={errorClasses}>{errors.is_qualified_ca}</p>}
          </div>
        </div>

        {formData.is_qualified_ca === "Yes" && (
          <div className="mt-4 max-w-xs animate-in fade-in-0 duration-200">
            <label htmlFor="membership_no" className={labelClasses}>Membership No. <span className="text-destructive">*</span></label>
            <input id="membership_no" name="membership_no" type="text" placeholder="ICAI Membership No." value={formData.membership_no} onChange={onChange} className={inputClasses(!!errors.membership_no)} />
            {errors.membership_no && <p className={errorClasses}>{errors.membership_no}</p>}
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="icai_certified_courses" className={labelClasses}>Any other certified courses from ICAI?</label>
          <textarea id="icai_certified_courses" name="icai_certified_courses" rows={2} placeholder="If yes, please provide details" value={formData.icai_certified_courses} onChange={onChange} className={inputClasses(false)} />
        </div>
      </div>

      {/* Education */}
      <div className="form-section">
        <div className="form-section-header">
          <div className="form-section-icon"><GraduationCap size={16} /></div>
          <h3 className={sectionHeadingClasses}>Education Qualification</h3>
        </div>
        <div className="space-y-4">
          <EducationBlock title="School Finals" prefix="school" formData={formData as unknown as Record<string, string>} errors={errors as Record<string, string | undefined>} onChange={onChange as unknown as (e: React.ChangeEvent<HTMLInputElement>) => void} required />
          <EducationBlock title="Graduation" prefix="graduation" formData={formData as unknown as Record<string, string>} errors={errors as Record<string, string | undefined>} onChange={onChange as unknown as (e: React.ChangeEvent<HTMLInputElement>) => void} />
          <EducationBlock title="Post Graduation" prefix="post_graduation" formData={formData as unknown as Record<string, string>} errors={errors as Record<string, string | undefined>} onChange={onChange as unknown as (e: React.ChangeEvent<HTMLInputElement>) => void} />
          <EducationBlock title="Other (Specify)" prefix="other_qualification" formData={formData as unknown as Record<string, string>} errors={errors as Record<string, string | undefined>} onChange={onChange as unknown as (e: React.ChangeEvent<HTMLInputElement>) => void} />
        </div>
      </div>

      {/* Employment */}
      <div className="form-section">
        <div className="form-section-header">
          <div className="form-section-icon"><Building2 size={16} /></div>
          <h3 className={sectionHeadingClasses}>Employment History</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employer_name" className={labelClasses}>Name of Employer</label>
            <input id="employer_name" name="employer_name" type="text" placeholder="Employer name" value={formData.employer_name} onChange={onChange} className={inputClasses(false)} />
          </div>
          <div>
            <label htmlFor="last_designation" className={labelClasses}>Last Designation Held</label>
            <input id="last_designation" name="last_designation" type="text" placeholder="Designation" value={formData.last_designation} onChange={onChange} className={inputClasses(false)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClasses}>Employment From</label>
            <Popover open={empFromOpen} onOpenChange={setEmpFromOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-[42px] text-sm hover:border-primary/30", !formData.employment_from && "text-muted-foreground/60")}>
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {formData.employment_from ? format(new Date(formData.employment_from), "dd-MM-yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={formData.employment_from ? new Date(formData.employment_from) : undefined} onSelect={(d) => { if (d) { onFieldChange("employment_from", d.toISOString().split("T")[0]); setEmpFromOpen(false); } }} className={cn("p-3 pointer-events-auto")} captionLayout="dropdown-buttons" fromYear={1980} toYear={new Date().getFullYear()} />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className={labelClasses}>Employment To</label>
            <Popover open={empToOpen} onOpenChange={setEmpToOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-[42px] text-sm hover:border-primary/30", !formData.employment_to && "text-muted-foreground/60")}>
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {formData.employment_to ? format(new Date(formData.employment_to), "dd-MM-yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={formData.employment_to ? new Date(formData.employment_to) : undefined} onSelect={(d) => { if (d) { onFieldChange("employment_to", d.toISOString().split("T")[0]); setEmpToOpen(false); } }} className={cn("p-3 pointer-events-auto")} captionLayout="dropdown-buttons" fromYear={1980} toYear={new Date().getFullYear() + 1} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Job Details + CTC */}
      <div className="form-section">
        <div className="form-section-header">
          <div className="form-section-icon"><IndianRupee size={16} /></div>
          <h3 className={sectionHeadingClasses}>Job Details &amp; Compensation</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="area_of_interest" className={labelClasses}>Area of Interest <span className="text-destructive">*</span></label>
            <select id="area_of_interest" name="area_of_interest" value={formData.area_of_interest} onChange={onChange} className={inputClasses(!!errors.area_of_interest)}>
              <option value="">Select area</option>
              <option value="Audit & Assurance">Audit &amp; Assurance</option>
              <option value="Taxation">Taxation</option>
              <option value="GST">GST</option>
              <option value="Compliance">Compliance</option>
              <option value="Advisory">Advisory</option>
              <option value="Other">Other</option>
            </select>
            {errors.area_of_interest && <p className={errorClasses}>{errors.area_of_interest}</p>}
          </div>
          <div>
            <label className={labelClasses}>Post Qualification Experience</label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input name="post_qualification_years" type="number" min={0} max={50} placeholder="Years" value={formData.post_qualification_years} onChange={onChange} className={inputClasses(false)} />
              </div>
              <div className="flex-1">
                <input name="post_qualification_months" type="number" min={0} max={11} placeholder="Months" value={formData.post_qualification_months} onChange={onChange} className={inputClasses(false)} />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label htmlFor="current_ctc" className={labelClasses}>Current CTC (Per annum) <span className="text-destructive">*</span></label>
            <input id="current_ctc" name="current_ctc" type="text" placeholder="e.g. 8,00,000" value={formData.current_ctc} onChange={onChange} className={inputClasses(!!errors.current_ctc)} />
            {errors.current_ctc && <p className={errorClasses}>{errors.current_ctc}</p>}
          </div>
          <div>
            <label htmlFor="expected_ctc" className={labelClasses}>Expected CTC (Per annum) <span className="text-destructive">*</span></label>
            <input id="expected_ctc" name="expected_ctc" type="text" placeholder="e.g. 10,00,000" value={formData.expected_ctc} onChange={onChange} className={inputClasses(!!errors.expected_ctc)} />
            {errors.expected_ctc && <p className={errorClasses}>{errors.expected_ctc}</p>}
          </div>
          <div>
            <label htmlFor="notice_period" className={labelClasses}>Notice Period <span className="text-destructive">*</span></label>
            <input id="notice_period" name="notice_period" type="text" placeholder="e.g. 30 days" value={formData.notice_period} onChange={onChange} className={inputClasses(!!errors.notice_period)} />
            {errors.notice_period && <p className={errorClasses}>{errors.notice_period}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFields;
