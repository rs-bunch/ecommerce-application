export interface LocationState {
  location: string | null;
}

export interface AuthState {
  id: string | null;
  inProgress?: boolean;
  firstName: string | null;
}

export interface Payload {
  email: string;
  password: string;
}
