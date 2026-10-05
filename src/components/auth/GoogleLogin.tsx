"use client";

import { useGoogleOAuth } from "@/hooks";
import { UserRole } from "@/types";
import { GoogleLogin } from "@react-oauth/google";

interface GoogleLoginComponentProps {
  role?: UserRole;
  text?: "signin_with" | "signup_with" | "continue_with";
  theme?: "outline" | "filled_blue" | "filled_black";
  shape?: "rectangular" | "pill" | "circle" | "square";
}

export default function GoogleLoginComponent({
  role,
  text,
  theme = "filled_black",
  shape = "rectangular",
}: GoogleLoginComponentProps) {
  const googleOAuthMutation = useGoogleOAuth();

  const buttonText = text || (role ? "signup_with" : "continue_with");

  return (
    <GoogleLogin
      onSuccess={credentialResponse => {
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
      theme={theme}
      shape={shape}
      text={buttonText}
    />
  );
}
