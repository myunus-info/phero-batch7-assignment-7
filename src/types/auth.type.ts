export type UserRole = "ADMIN" | "RECRUITER" | "CANDIDATE";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  companyName?: string;
  companyWebsite?: string;
  headline?: string;
  skills?: string[];
}

export interface IGoogleLoginPayload {
  idToken?: string;
  token?: string;
  role?: UserRole;
}

export interface ILoginResponse {
  accessToken?: string;
  user: IAuthUser;
}
