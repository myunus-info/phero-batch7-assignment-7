"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks/auth.hook";
import type { UserRole } from "@/types";
import AccessDenied from "./AccessDenied";
import AuthLoading from "./AuthLoading";

export interface IRoleGuardProps {
  children: ReactNode;
  roles?: UserRole[];
  allowedRoles?: UserRole[];
}

export function RoleGuard({ children, roles, allowedRoles }: IRoleGuardProps) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();

  const user = data;
  const effectiveRoles = allowedRoles || roles || [];
  const isAuthorized = !!user && effectiveRoles.includes(user.role);

  useEffect(() => {
    if (isPending) return;
    if (isError || !user) {
      router.replace("/login");
    }
  }, [isPending, isError, user, router]);

  if (isPending) {
    return <AuthLoading label="Authorizing role permissions..." />;
  }

  if (isError || !user) {
    return <AuthLoading label="Redirecting to login..." />;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <AccessDenied
      title="Restricted Portal"
      message={`This view requires one of the following roles: [${effectiveRoles.join(
        ", ",
      )}]. Your current role is ${user.role}.`}
    />
  );
}

export default RoleGuard;
