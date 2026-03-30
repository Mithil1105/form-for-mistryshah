import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FieldProps } from "./types";
import { inputClasses, labelClasses, errorClasses, sectionHeadingClasses } from "./FormStyles";

type Props = FieldProps & {
  onDateChange: (date: string) => void;
};

const CommonFields = ({ formData, errors, onChange, onDateChange }: Props) => {
  const [dobOpen, setDobOpen] = useState(false);
  const selectedDate = formData.date_of_birth ? new Date(formData.date_of_birth) : undefined;
  const [sameAsPermanent, setSameAsPermanent] = useState(
    formData.permanent_address.trim() !== "" && formData.permanent_address === formData.current_address
  );

  // When user enables "same as permanent address", keep current_address synced.
  useEffect(() => {
    if (!sameAsPermanent) return;
    if (formData.current_address !== formData.permanent_address) {
      onChange({
        target: { name: "current_address", value: formData.permanent_address },
      } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
    }
  }, [sameAsPermanent, formData.permanent_address, formData.current_address, onChange]);

  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="form-section-icon"><User size={16} /></div>
        <h2 className={sectionHeadingClasses}>Personal Details</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name <span className="text-destructive">*</span>
          </label>
          <input id="name" name="name" type="text" placeholder="First name" value={formData.name} onChange={onChange} className={inputClasses(!!errors.name)} />
          {errors.name && <p className={errorClasses}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="middle_name" className={labelClasses}>Middle Name</label>
          <input id="middle_name" name="middle_name" type="text" placeholder="Middle name" value={formData.middle_name} onChange={onChange} className={inputClasses(false)} />
        </div>
        <div>
          <label htmlFor="surname" className={labelClasses}>
            Surname <span className="text-destructive">*</span>
          </label>
          <input id="surname" name="surname" type="text" placeholder="Surname" value={formData.surname} onChange={onChange} className={inputClasses(!!errors.surname)} />
          {errors.surname && <p className={errorClasses}>{errors.surname}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="email" className={labelClasses}>
            Your Email <span className="text-destructive">*</span>
          </label>
          <input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={onChange} className={inputClasses(!!errors.email)} />
          {errors.email && <p className={errorClasses}>{errors.email}</p>}
        </div>
        <div>
          <label className={labelClasses}>
            Date of Birth <span className="text-destructive">*</span>
          </label>
          <Popover open={dobOpen} onOpenChange={setDobOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-[42px] text-sm hover:border-primary/30",
                  !selectedDate && "text-muted-foreground/60",
                  errors.date_of_birth && "border-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {selectedDate ? format(selectedDate, "dd-MM-yyyy") : "DD-MM-YYYY"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    onDateChange(date.toISOString().split("T")[0]);
                    setDobOpen(false);
                  }
                }}
                disabled={(date) => date > new Date() || date < new Date("1940-01-01")}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                captionLayout="dropdown-buttons"
                fromYear={1940}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
          {errors.date_of_birth && <p className={errorClasses}>{errors.date_of_birth}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="contact_no" className={labelClasses}>
            Contact No. <span className="text-destructive">*</span>
          </label>
          <input id="contact_no" name="contact_no" type="tel" placeholder="10-digit mobile number" value={formData.contact_no} onChange={onChange} maxLength={10} className={inputClasses(!!errors.contact_no)} />
          {errors.contact_no && <p className={errorClasses}>{errors.contact_no}</p>}
        </div>
        <div>
          <label className={labelClasses}>
            Gender <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-1 mt-1.5">
            {["Male", "Female"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() =>
                  onChange({ target: { name: "gender", value: g } } as unknown as React.ChangeEvent<HTMLInputElement>)
                }
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200",
                  formData.gender === g
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/30"
                )}
              >
                {g}
              </button>
            ))}
          </div>
          {errors.gender && <p className={errorClasses}>{errors.gender}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="permanent_address" className={labelClasses}>
            Permanent Address <span className="text-destructive">*</span>
          </label>
          <textarea id="permanent_address" name="permanent_address" rows={2} placeholder="Full permanent address" value={formData.permanent_address} onChange={onChange} className={inputClasses(!!errors.permanent_address)} />
          {errors.permanent_address && <p className={errorClasses}>{errors.permanent_address}</p>}
        </div>
        <div>
          <label htmlFor="current_address" className={labelClasses}>
            Current Address <span className="text-destructive">*</span>
          </label>
          <div className="flex items-center gap-2 mt-1 mb-1">
            <input
              id="same_as_permanent_address"
              name="same_as_permanent_address"
              type="checkbox"
              checked={sameAsPermanent}
              onChange={(e) => {
                const checked = e.target.checked;
                setSameAsPermanent(checked);
                if (checked) {
                  onChange({
                    target: { name: "current_address", value: formData.permanent_address },
                  } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
                }
              }}
              className="h-3.5 w-3.5 rounded border-border accent-primary"
            />
            <label htmlFor="same_as_permanent_address" className="text-xs font-normal text-muted-foreground">
              Same as permanent address
            </label>
          </div>
          <textarea id="current_address" name="current_address" rows={2} placeholder="Full current address" value={formData.current_address} onChange={onChange} className={inputClasses(!!errors.current_address)} />
          {errors.current_address && <p className={errorClasses}>{errors.current_address}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="reference" className={labelClasses}>Reference</label>
        <input id="reference" name="reference" type="text" placeholder="How did you hear about us?" value={formData.reference} onChange={onChange} className={inputClasses(false)} />
      </div>
    </div>
  );
};

export default CommonFields;
