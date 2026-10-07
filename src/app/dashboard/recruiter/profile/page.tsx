"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { ProfileSettingsForm } from "@/components/forms/ProfileSettingsForm";
import { useGetMyProfile } from "@/hooks/user.hook";
import { Building2 } from "lucide-react";

export default function RecruiterProfilePage() {
  const { data: profileData, isLoading } = useGetMyProfile();
  const user = profileData?.data;

  return (
    <RoleGuard allowedRoles={["RECRUITER"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-cyan-500" />
            <span>Company & Recruiter Profile</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update your organization details and public company website displayed on assessments.
          </p>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground">Loading company profile...</div>
        ) : user ? (
          <ProfileSettingsForm user={user} />
        ) : (
          <div className="py-16 text-center text-muted-foreground">Failed to load recruiter profile.</div>
        )}
      </div>
    </RoleGuard>
  );
}
