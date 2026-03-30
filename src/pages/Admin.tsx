import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Users, Briefcase, GraduationCap, FileText, Search, ExternalLink, Eye, LogOut, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Application = {
  id: string;
  name: string;
  middle_name: string | null;
  surname: string | null;
  email: string;
  phone: string | null;
  contact_no: string | null;
  date_of_birth: string | null;
  gender: string | null;
  permanent_address: string | null;
  current_address: string | null;
  reference: string | null;
  application_type: string | null;
  applying_for: string | null;
  ca_level: string | null;
  attempts: number;
  domain: string | null;
  resume_url: string | null;
  answer: string | null;
  created_at: string;
  marital_status: string | null;
  is_qualified_ca: boolean | null;
  membership_no: string | null;
  icai_certified_courses: string | null;
  school_institute: string | null;
  school_year: number | null;
  school_specialization: string | null;
  school_percentage: number | null;
  graduation_institute: string | null;
  graduation_year: number | null;
  graduation_specialization: string | null;
  graduation_percentage: number | null;
  post_graduation_institute: string | null;
  post_graduation_year: number | null;
  post_graduation_specialization: string | null;
  post_graduation_percentage: number | null;
  other_qualification_institute: string | null;
  other_qualification_year: number | null;
  other_qualification_specialization: string | null;
  other_qualification_percentage: number | null;
  employer_name: string | null;
  employment_from: string | null;
  employment_to: string | null;
  last_designation: string | null;
  area_of_interest: string | null;
  post_qualification_years: number | null;
  post_qualification_months: number | null;
  current_ctc: string | null;
  expected_ctc: string | null;
  notice_period: string | null;
  is_transfer_case: boolean | null;
  transfer_case_details: string | null;
};

const DetailRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground col-span-1">{label}</span>
      <span className="text-sm text-foreground col-span-2">{String(value)}</span>
    </div>
  );
};

const Admin = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selected, setSelected] = useState<Application | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = [
      "Name", "Email", "Phone", "Gender", "DOB", "Type", "Permanent Address", "Current Address",
      "Reference", "Marital Status", "Qualified CA", "Membership No", "ICAI Courses",
      "Area of Interest", "Post Qual Years", "Post Qual Months", "Current CTC", "Expected CTC",
      "Notice Period", "Employer", "Designation", "Transfer Case", "Transfer Details",
      "Resume URL", "Date"
    ];
    const escape = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = filtered.map((a) => [
      [a.name, a.middle_name, a.surname].filter(Boolean).join(" "),
      a.email, a.contact_no || a.phone, a.gender, a.date_of_birth,
      a.application_type || a.applying_for, a.permanent_address, a.current_address,
      a.reference, a.marital_status,
      a.is_qualified_ca == null ? "" : a.is_qualified_ca ? "Yes" : "No",
      a.membership_no, a.icai_certified_courses, a.area_of_interest,
      a.post_qualification_years, a.post_qualification_months,
      a.current_ctc, a.expected_ctc, a.notice_period,
      a.employer_name, a.last_designation,
      a.is_transfer_case == null ? "" : a.is_transfer_case ? "Yes" : "No",
      a.transfer_case_details, a.resume_url, a.created_at
    ].map(escape).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `applications_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setApplications(data as unknown as Application[]);
      setLoading(false);
    };
    fetchApplications();
  }, []);

  const filtered = applications.filter((app) => {
    const fullName = `${app.name} ${app.middle_name || ""} ${app.surname || ""}`.toLowerCase();
    const matchesSearch = !search || fullName.includes(search.toLowerCase()) || app.email.toLowerCase().includes(search.toLowerCase()) || (app.contact_no || app.phone || "").includes(search);
    const type = app.application_type || app.applying_for || "";
    const matchesType = filterType === "all" || type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: applications.length,
    articleship: applications.filter((a) => (a.application_type || a.applying_for) === "Articleship").length,
    job: applications.filter((a) => (a.application_type || a.applying_for) === "Job").length,
  };

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Applications Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Mistry &amp; Shah LLP — Recruitment Overview</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
              <Download size={14} /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
              <LogOut size={14} /> Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              <Users size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-foreground">{stats.total}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Articleship</CardTitle>
              <GraduationCap size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-foreground">{stats.articleship}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Job</CardTitle>
              <Briefcase size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-foreground">{stats.job}</div></CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 text-sm" />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Articleship">Articleship</SelectItem>
                  <SelectItem value="Job">Job</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <FileText size={32} className="mb-2 opacity-40" />
                <p className="text-sm">No applications found</p>
              </div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Resume</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {[app.name, app.middle_name, app.surname].filter(Boolean).join(" ")}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{app.email}</div>
                          <div className="text-xs text-muted-foreground">{app.contact_no || app.phone}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={(app.application_type || app.applying_for) === "Job" ? "default" : "outline"} className="text-xs">
                            {app.application_type || app.applying_for || "—"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{app.gender || "—"}</TableCell>
                        <TableCell>
                          {app.resume_url ? (
                            <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 text-xs">
                              View <ExternalLink size={10} />
                            </a>
                          ) : <span className="text-muted-foreground text-xs">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatDate(app.created_at)}
                        </TableCell>
                        <TableCell>
                          <button onClick={() => setSelected(app)} className="text-primary hover:text-primary/80 p-1">
                            <Eye size={14} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Showing {filtered.length} of {applications.length} applications
        </p>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading">
                  {[selected.name, selected.middle_name, selected.surname].filter(Boolean).join(" ")}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={(selected.application_type || selected.applying_for) === "Job" ? "default" : "outline"} className="text-xs">
                    {selected.application_type || selected.applying_for}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(selected.created_at)}</span>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Personal Details</h4>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <DetailRow label="Email" value={selected.email} />
                    <DetailRow label="Phone" value={selected.contact_no || selected.phone} />
                    <DetailRow label="Gender" value={selected.gender} />
                    <DetailRow label="DOB" value={selected.date_of_birth ? formatDate(selected.date_of_birth) : null} />
                    <DetailRow label="Permanent Address" value={selected.permanent_address} />
                    <DetailRow label="Current Address" value={selected.current_address} />
                    <DetailRow label="Reference" value={selected.reference} />
                  </div>
                </div>

                {(selected.application_type || selected.applying_for) === "Job" && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Professional Details</h4>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <DetailRow label="Marital Status" value={selected.marital_status} />
                        <DetailRow label="Qualified CA" value={selected.is_qualified_ca ? "Yes" : selected.is_qualified_ca === false ? "No" : null} />
                        <DetailRow label="Membership No." value={selected.membership_no} />
                        <DetailRow label="ICAI Courses" value={selected.icai_certified_courses} />
                        <DetailRow label="Area of Interest" value={selected.area_of_interest} />
                        <DetailRow label="Post Qual. Experience" value={selected.post_qualification_years != null ? `${selected.post_qualification_years}y ${selected.post_qualification_months || 0}m` : null} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Education</h4>
                      <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                        {[
                          { t: "School", p: "school" },
                          { t: "Graduation", p: "graduation" },
                          { t: "Post Graduation", p: "post_graduation" },
                          { t: "Other", p: "other_qualification" },
                        ].map(({ t, p }) => {
                          const inst = (selected as any)[`${p}_institute`];
                          if (!inst) return null;
                          return (
                            <div key={p} className="border-b border-border/30 pb-2 last:border-0">
                              <span className="text-xs font-medium text-foreground">{t}</span>
                              <DetailRow label="Institute" value={inst} />
                              <DetailRow label="Year" value={(selected as any)[`${p}_year`]} />
                              <DetailRow label="Specialization" value={(selected as any)[`${p}_specialization`]} />
                              <DetailRow label="Percentage" value={(selected as any)[`${p}_percentage`]} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Employment & CTC</h4>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <DetailRow label="Employer" value={selected.employer_name} />
                        <DetailRow label="From" value={selected.employment_from ? formatDate(selected.employment_from) : null} />
                        <DetailRow label="To" value={selected.employment_to ? formatDate(selected.employment_to) : null} />
                        <DetailRow label="Designation" value={selected.last_designation} />
                        <DetailRow label="Current CTC" value={selected.current_ctc} />
                        <DetailRow label="Expected CTC" value={selected.expected_ctc} />
                        <DetailRow label="Notice Period" value={selected.notice_period} />
                      </div>
                    </div>
                  </>
                )}

                {(selected.application_type || selected.applying_for) === "Articleship" && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Articleship Details</h4>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <DetailRow label="Transfer Case" value={selected.is_transfer_case ? "Yes" : selected.is_transfer_case === false ? "No" : null} />
                      <DetailRow label="Transfer Details" value={selected.transfer_case_details} />
                    </div>
                  </div>
                )}

                {selected.resume_url && (
                  <>
                    {selected.resume_url.toLowerCase().includes(".pdf") ? (
                      <div className="mt-4 border border-border/50 rounded-lg overflow-hidden bg-muted/20">
                        <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                          Resume Preview
                        </div>
                        <iframe
                          src={selected.resume_url}
                          title="Resume Preview"
                          className="w-full h-[420px] bg-background"
                        />
                      </div>
                    ) : (
                      <a
                        href={selected.resume_url}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                      >
                        <ExternalLink size={14} /> Download Resume
                      </a>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
