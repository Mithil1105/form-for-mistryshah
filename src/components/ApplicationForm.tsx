import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2, CheckCircle, Send } from "lucide-react";
import logo from "@/assets/mistry-shah-logo.png";
import { FormData, FormErrors, initialFormData } from "./form/types";
import { sectionDividerClasses } from "./form/FormStyles";
import FormProgressIndicator from "./FormProgressIndicator";
import CommonFields from "./form/CommonFields";
import ApplicationTypeSelector from "./form/ApplicationTypeSelector";
import JobFields from "./form/JobFields";
import ArticleshipFields from "./form/ArticleshipFields";
import ResumeUpload from "./form/ResumeUpload";

const ApplicationForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  const currentStep = () => {
    if (!formData.application_type) return 1;
    return 2;
  };

  const scrollToField = (field: string) => {
    try {
      const el =
        document.getElementById(field) ||
        document.querySelector<HTMLElement>(`[name="${field}"]`) ||
        document.querySelector<HTMLElement>(`[data-field="${field}"]`);

      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Only focus if it's focusable (inputs, buttons, etc.)
      const focusFn = (el as HTMLElement).focus;
      if (typeof focusFn === "function") {
        (el as HTMLElement).focus();
      }
    } catch {
      // No-op: scrolling is best-effort.
    }
  };

  const validate = (): FormErrors | null => {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.surname.trim()) e.surname = "Surname is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = "Enter a valid email";
    if (!formData.date_of_birth) e.date_of_birth = "Date of birth is required";
    if (!formData.contact_no.trim()) e.contact_no = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contact_no.trim())) e.contact_no = "Enter a valid 10-digit number";
    if (!formData.gender) e.gender = "Gender is required";
    if (!formData.permanent_address.trim()) e.permanent_address = "Permanent address is required";
    if (!formData.current_address.trim()) e.current_address = "Current address is required";
    if (!formData.application_type) e.application_type = "Please select application type";
    if (!resumeFile) e.resume = "Please upload your resume";

    if (formData.application_type === "Job") {
      if (!formData.marital_status) e.marital_status = "Required";
      if (!formData.is_qualified_ca) e.is_qualified_ca = "Required";
      if (formData.is_qualified_ca === "Yes" && !formData.membership_no.trim()) e.membership_no = "Membership No. required";
      if (!formData.school_institute.trim()) e.school_institute = "School details required";
      if (!formData.area_of_interest) e.area_of_interest = "Required";
      if (!formData.current_ctc.trim()) e.current_ctc = "Required";
      if (!formData.expected_ctc.trim()) e.expected_ctc = "Required";
      if (!formData.notice_period.trim()) e.notice_period = "Required";
    }

    if (formData.application_type === "Articleship") {
      if (!formData.is_transfer_case) e.is_transfer_case = "Required";
      if (formData.is_transfer_case === "Yes" && !formData.transfer_case_details.trim())
        e.transfer_case_details = "Please provide transfer details";
    }

    setErrors(e);
    return Object.keys(e).length === 0 ? null : e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, resume: "Only PDF, DOC, or DOCX files accepted" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, resume: "File must be under 5MB" }));
        return;
      }
      setResumeFile(file);
      setErrors((prev) => ({ ...prev, resume: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (validationErrors) {
      const firstKey = Object.keys(validationErrors)[0];
      if (firstKey) scrollToField(firstKey);
      return;
    }
    setIsSubmitting(true);

    try {
      let resumeUrl = "";
      if (resumeFile) {
        const fileName = `${Date.now()}_${resumeFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from("resumes").upload(fileName, resumeFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(uploadData.path);
        resumeUrl = urlData.publicUrl;
      }

      const payload: Record<string, unknown> = {
        application_type: formData.application_type,
        name: formData.name.trim(),
        middle_name: formData.middle_name.trim() || null,
        surname: formData.surname.trim(),
        email: formData.email.trim(),
        date_of_birth: formData.date_of_birth || null,
        contact_no: formData.contact_no.trim(),
        phone: formData.contact_no.trim(),
        gender: formData.gender,
        permanent_address: formData.permanent_address.trim(),
        current_address: formData.current_address.trim(),
        reference: formData.reference.trim() || null,
        resume_url: resumeUrl || null,
        applying_for: formData.application_type,
      };

      if (formData.application_type === "Job") {
        Object.assign(payload, {
          marital_status: formData.marital_status,
          is_qualified_ca: formData.is_qualified_ca === "Yes",
          membership_no: formData.membership_no.trim() || null,
          icai_certified_courses: formData.icai_certified_courses.trim() || null,
          school_institute: formData.school_institute.trim() || null,
          school_year: formData.school_year ? parseInt(formData.school_year) : null,
          school_specialization: formData.school_specialization.trim() || null,
          school_percentage: formData.school_percentage ? parseFloat(formData.school_percentage) : null,
          graduation_institute: formData.graduation_institute.trim() || null,
          graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
          graduation_specialization: formData.graduation_specialization.trim() || null,
          graduation_percentage: formData.graduation_percentage ? parseFloat(formData.graduation_percentage) : null,
          post_graduation_institute: formData.post_graduation_institute.trim() || null,
          post_graduation_year: formData.post_graduation_year ? parseInt(formData.post_graduation_year) : null,
          post_graduation_specialization: formData.post_graduation_specialization.trim() || null,
          post_graduation_percentage: formData.post_graduation_percentage ? parseFloat(formData.post_graduation_percentage) : null,
          other_qualification_institute: formData.other_qualification_institute.trim() || null,
          other_qualification_year: formData.other_qualification_year ? parseInt(formData.other_qualification_year) : null,
          other_qualification_specialization: formData.other_qualification_specialization.trim() || null,
          other_qualification_percentage: formData.other_qualification_percentage ? parseFloat(formData.other_qualification_percentage) : null,
          employer_name: formData.employer_name.trim() || null,
          employment_from: formData.employment_from || null,
          employment_to: formData.employment_to || null,
          last_designation: formData.last_designation.trim() || null,
          area_of_interest: formData.area_of_interest || null,
          domain: formData.area_of_interest || null,
          post_qualification_years: formData.post_qualification_years ? parseInt(formData.post_qualification_years) : null,
          post_qualification_months: formData.post_qualification_months ? parseInt(formData.post_qualification_months) : null,
          current_ctc: formData.current_ctc.trim() || null,
          expected_ctc: formData.expected_ctc.trim() || null,
          notice_period: formData.notice_period.trim() || null,
        });
      }

      if (formData.application_type === "Articleship") {
        Object.assign(payload, {
          is_transfer_case: formData.is_transfer_case === "Yes",
          transfer_case_details: formData.transfer_case_details.trim() || null,
        });
      }

      const { error: insertError } = await supabase.from("applications").insert(payload as any);
      if (insertError) throw insertError;

      try {
        console.log("invoke send-application-email payload", {
          hasResume: typeof resumeUrl === "string" && resumeUrl.length > 0,
          resumeUrl: resumeUrl ? `${resumeUrl.slice(0, 40)}...` : null,
          keys: Object.keys(formData),
          gender: formData.gender,
          date_of_birth: formData.date_of_birth,
          permanent_address: formData.permanent_address,
          current_address: formData.current_address,
          reference: formData.reference,
          application_type: formData.application_type,
        });
        await supabase.functions.invoke("send-application-email", {
          body: {
            ...formData,
            resume_url: resumeUrl || null,
          },
        });
      } catch (err) {
        console.error("Email notification failed:", err);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      toast({ title: "Submission Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="form-section max-w-[540px] w-full text-center py-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="text-primary" size={32} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Application Submitted</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            Thank you for applying at Mistry &amp; Shah LLP. We will review your application and get back to you if your profile matches our requirements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="max-w-[760px] w-full mx-auto">
        {/* Header Card */}
        <div className="form-section mb-6 text-center">
          <img src={logo} alt="Mistry & Shah LLP" className="h-20 object-contain mx-auto mb-3" width={512} height={512} />
          <h1 className="font-heading text-2xl font-bold text-foreground">Mistry &amp; Shah LLP</h1>
          <p className="text-sm text-muted-foreground mt-1">Chartered Accountants</p>
          <div className="h-px w-20 bg-primary/20 mx-auto my-4" />
          <h2 className="font-heading text-lg font-bold text-foreground">Application Form</h2>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-md mx-auto">
            Please complete the form below. Fields shown will depend on whether you are applying for a job or articleship.
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-border">
            <Shield size={11} className="text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
              Confidential • Secure Application
            </span>
          </div>
        </div>

        <FormProgressIndicator step={currentStep()} applicationType={formData.application_type} />

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <CommonFields
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onDateChange={(d) => handleFieldChange("date_of_birth", d)}
          />

          <ApplicationTypeSelector
            value={formData.application_type}
            error={errors.application_type}
            onChange={(v) => handleFieldChange("application_type", v)}
          />

          {formData.application_type && (
            <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
              {formData.application_type === "Job" ? (
                <JobFields formData={formData} errors={errors} onChange={handleChange} onFieldChange={handleFieldChange} />
              ) : (
                <div className="form-section">
                  <ArticleshipFields formData={formData} errors={errors} onChange={handleChange} />
                </div>
              )}
            </div>
          )}

          <ResumeUpload resumeFile={resumeFile} error={errors.resume} onFileChange={handleFileChange} />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all duration-200 hover:opacity-90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={15} />
                Submit Application
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-muted-foreground">
            having any issue contact : hr@mistryandshah.com / 8238326605
          </p>

          <p className="text-[10px] text-center text-muted-foreground">
            By submitting, you agree that all information provided is accurate and complete.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
