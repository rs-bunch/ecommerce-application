export interface LocationState {
  location: string | null;
}

export interface AuthState {
  id: string | null;
  inProgress?: boolean;
  firstName: string | null;
}

export interface AuthPayload {
  email: string;
  password: string;
}
