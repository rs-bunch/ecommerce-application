export interface LocationState {
  location: string | null;
}

export interface AuthState {
  id: string | null;
  inProgress: boolean;
}

export interface Payload {
  email: string;
  password: string;
}
