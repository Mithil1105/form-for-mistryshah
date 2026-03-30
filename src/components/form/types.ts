export type FormData = {
  // Common
  name: string;
  middle_name: string;
  surname: string;
  email: string;
  date_of_birth: string;
  contact_no: string;
  gender: string;
  permanent_address: string;
  current_address: string;
  reference: string;
  application_type: string;

  // Job-specific
  marital_status: string;
  is_qualified_ca: string;
  membership_no: string;
  icai_certified_courses: string;
  school_institute: string;
  school_year: string;
  school_specialization: string;
  school_percentage: string;
  graduation_institute: string;
  graduation_year: string;
  graduation_specialization: string;
  graduation_percentage: string;
  post_graduation_institute: string;
  post_graduation_year: string;
  post_graduation_specialization: string;
  post_graduation_percentage: string;
  other_qualification_institute: string;
  other_qualification_year: string;
  other_qualification_specialization: string;
  other_qualification_percentage: string;
  employer_name: string;
  employment_from: string;
  employment_to: string;
  last_designation: string;
  area_of_interest: string;
  post_qualification_years: string;
  post_qualification_months: string;
  current_ctc: string;
  expected_ctc: string;
  notice_period: string;

  // Articleship-specific
  is_transfer_case: string;
  transfer_case_details: string;
};

export const initialFormData: FormData = {
  name: "",
  middle_name: "",
  surname: "",
  email: "",
  date_of_birth: "",
  contact_no: "",
  gender: "",
  permanent_address: "",
  current_address: "",
  reference: "",
  application_type: "",
  marital_status: "",
  is_qualified_ca: "",
  membership_no: "",
  icai_certified_courses: "",
  school_institute: "",
  school_year: "",
  school_specialization: "",
  school_percentage: "",
  graduation_institute: "",
  graduation_year: "",
  graduation_specialization: "",
  graduation_percentage: "",
  post_graduation_institute: "",
  post_graduation_year: "",
  post_graduation_specialization: "",
  post_graduation_percentage: "",
  other_qualification_institute: "",
  other_qualification_year: "",
  other_qualification_specialization: "",
  other_qualification_percentage: "",
  employer_name: "",
  employment_from: "",
  employment_to: "",
  last_designation: "",
  area_of_interest: "",
  post_qualification_years: "",
  post_qualification_months: "",
  current_ctc: "",
  expected_ctc: "",
  notice_period: "",
  is_transfer_case: "",
  transfer_case_details: "",
};

export type FormErrors = Partial<Record<keyof FormData | "resume", string>>;

export type FieldProps = {
  formData: FormData;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
};
