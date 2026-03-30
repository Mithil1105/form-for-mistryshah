import { Upload, CheckCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { labelClasses, errorClasses, sectionHeadingClasses } from "./FormStyles";

type Props = {
  resumeFile: File | null;
  error?: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ResumeUpload = ({ resumeFile, error, onFileChange }: Props) => {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="form-section-icon"><FileText size={16} /></div>
        <h2 className={sectionHeadingClasses}>Resume Upload</h2>
      </div>
      <label className={labelClasses}>
        Upload Resume <span className="text-destructive">*</span>
      </label>
      <label
        htmlFor="resume"
        className={cn(
          "flex flex-col items-center justify-center gap-2 w-full px-4 py-8 rounded-lg border-2 border-dashed cursor-pointer text-sm transition-all duration-200 hover:border-primary hover:bg-primary/5",
          error
            ? "border-destructive text-destructive bg-destructive/5"
            : resumeFile
            ? "border-primary/50 text-primary bg-primary/5"
            : "border-border text-muted-foreground"
        )}
      >
        {resumeFile ? (
          <>
            <CheckCircle size={24} className="text-primary" />
            <span className="text-foreground font-medium">{resumeFile.name}</span>
            <span className="text-xs text-muted-foreground">Click to change file</span>
          </>
        ) : (
          <>
            <Upload size={24} className="text-muted-foreground" />
            <span className="font-medium text-foreground">Click to upload your resume</span>
            <span className="text-xs text-muted-foreground">PDF, DOC, or DOCX — Max 5MB</span>
          </>
        )}
      </label>
      <input
        id="resume"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={onFileChange}
        className="hidden"
      />
      {error && <p className={cn(errorClasses, "mt-2")}>{error}</p>}
    </div>
  );
};

export default ResumeUpload;
