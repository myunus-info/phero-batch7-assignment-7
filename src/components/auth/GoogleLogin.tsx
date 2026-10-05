import { useGoogleOAuth } from "@/hooks";
import { GoogleLogin } from "@react-oauth/google";

export default function GoogleLoginComponent() {
  const googleOAuthMutation = useGoogleOAuth();

  return (
    <GoogleLogin
      onSuccess={credentialResponse => {
        if (credentialResponse.credential) {
          googleOAuthMutation.mutate({ idToken: credentialResponse.credential });
        }
      }}
      onError={() => {
        console.error("Google Login Failed");
      }}
      theme="filled_black"
      shape="rectangular"
      text="continue_with"
    />
  );
}
