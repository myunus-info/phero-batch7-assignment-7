"use client";

import { useState } from "react";
import { IUserProfile } from "@/types";
import { useUpdateMyProfile } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { RoleBadge } from "@/components/ui/status-badge";
import { getInitials } from "@/lib/utils";
import { User, Mail, Building, Globe, Briefcase, Sparkles, Plus, X, Save } from "lucide-react";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface ProfileSettingsFormProps {
  user: IUserProfile;
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const updateProfileMutation = useUpdateMyProfile();

  const isCandidate = user.role === "CANDIDATE";
  const isRecruiter = user.role === "RECRUITER";

  // Form State
  const [name, setName] = useState(user.name || "");
  const [avatar, setAvatar] = useState(user.avatar || "");

  // Candidate fields
  const [headline, setHeadline] = useState(user.candidateProfile?.headline || "");
  const [githubUrl, setGithubUrl] = useState(user.candidateProfile?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user.candidateProfile?.linkedinUrl || "");
  const [skills, setSkills] = useState<string[]>(user.candidateProfile?.skills || []);
  const [newSkillInput, setNewSkillInput] = useState("");

  // Recruiter fields
  const [companyName, setCompanyName] = useState(user.recruiterProfile?.companyName || "");
  const [companyWebsite, setCompanyWebsite] = useState(user.recruiterProfile?.companyWebsite || "");

  const handleAddSkill = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfileMutation.mutate({
      name: name.trim(),
      avatar: avatar.trim() || undefined,
      ...(isCandidate && {
        headline: headline.trim(),
        githubUrl: githubUrl.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        skills,
      }),
      ...(isRecruiter && {
        companyName: companyName.trim(),
        companyWebsite: companyWebsite.trim() || undefined,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Account Overview Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl border border-slate-800 bg-slate-900/40 gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt={name}
                className="h-16 w-16 rounded-full object-cover border-2 border-slate-700 bg-slate-800"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-700 text-lg font-bold text-slate-200">
                {getInitials(name || "U")}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">{name || "User"}</h2>
              <RoleBadge role={user.role} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            {isCandidate && headline && <p className="text-xs text-emerald-400 font-medium mt-1">{headline}</p>}
            {isRecruiter && companyName && <p className="text-xs text-cyan-400 font-medium mt-1">{companyName}</p>}
          </div>
        </div>

        {isRecruiter && user.recruiterProfile && (
          <div className="px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
              Available Credits
            </span>
            <span className="text-xl font-black text-cyan-400">{user.recruiterProfile.credits}</span>
          </div>
        )}
      </div>

      {/* Basic Profile Details */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-400" />
            <span>Basic Information</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage your personal profile information.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name" required>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="pl-9"
                required
              />
            </div>
          </FormField>

          <FormField label="Email Address">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input value={user.email} disabled className="pl-9 bg-slate-950/60 text-slate-400 cursor-not-allowed" />
            </div>
          </FormField>
        </div>

        <FormField label="Avatar Image URL" description="Provide a direct link to a public image (PNG/JPG).">
          <Input
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
          />
        </FormField>
      </div>

      {/* Candidate Profile Section */}
      {isCandidate && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-emerald-400" />
              <span>Professional Details</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Highlight your role, social handles, and technical skills.</p>
          </div>

          <FormField
            label="Professional Headline"
            description="e.g. Senior Frontend Engineer | TypeScript, React & Next.js"
          >
            <Input
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              placeholder="Your professional headline or title"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="GitHub Profile">
              <div className="relative">
                <GithubIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="pl-9"
                />
              </div>
            </FormField>

            <FormField label="LinkedIn Profile">
              <div className="relative">
                <LinkedinIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="pl-9"
                />
              </div>
            </FormField>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Technical Skills</span>
            </label>

            <div className="flex gap-2">
              <Input
                value={newSkillInput}
                onChange={e => setNewSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    handleAddSkill(e);
                  }
                }}
                placeholder="Add a skill (e.g. TypeScript, Docker, PostgreSQL) and press Enter"
              />
              <Button type="button" variant="outline" onClick={handleAddSkill} className="gap-1 shrink-0">
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.length === 0 ? (
                <p className="text-xs text-slate-500">No skills added yet.</p>
              ) : (
                skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-emerald-400 hover:text-red-400 transition-colors"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recruiter Profile Section */}
      {isRecruiter && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Building className="h-4 w-4 text-cyan-400" />
              <span>Company Information</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Information displayed to candidates when taking your assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Company Name" required>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="pl-9"
                  required
                />
              </div>
            </FormField>

            <FormField label="Company Website">
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  value={companyWebsite}
                  onChange={e => setCompanyWebsite(e.target.value)}
                  placeholder="https://acme.com"
                  className="pl-9"
                />
              </div>
            </FormField>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button type="submit" variant="emerald" disabled={updateProfileMutation.isPending} className="gap-2 px-6">
          {updateProfileMutation.isPending ? (
            <>
              <Spinner size="sm" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Profile</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default ProfileSettingsForm;
