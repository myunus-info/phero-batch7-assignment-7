"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useGoogleOAuth } from "@/hooks";
import { useTheme } from "@/providers/themeProvider";
import type { UserRole } from "@/types";

interface GoogleLoginComponentProps {
  role?: UserRole;
  text?: "signin_with" | "signup_with" | "continue_with";
  theme?: "outline" | "filled_blue" | "filled_black";
  shape?: "rectangular" | "pill" | "circle" | "square";
}

export default function GoogleLoginComponent({
  role,
  text,
  theme,
  shape = "rectangular",
}: GoogleLoginComponentProps) {
  const googleOAuthMutation = useGoogleOAuth();
  const { resolvedTheme } = useTheme();

  const buttonText = text || (role ? "signup_with" : "continue_with");
  const effectiveTheme =
    theme || (resolvedTheme === "dark" ? "filled_black" : "outline");

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (credentialResponse.credential) {
          googleOAuthMutation.mutate({
            idToken: credentialResponse.credential,
            ...(role ? { role } : {}),
          });
        }
      }}
      onError={() => {
        console.error("Google Authentication Failed");
      }}
      theme={effectiveTheme}
      shape={shape}
      text={buttonText}
    />
  );
}

export { GoogleLoginComponent };
