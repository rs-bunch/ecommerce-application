export interface StateI {
  location: string | null;
  auth: {
    active: boolean;
    token: string | null;
  };
}

export interface StateLocation {
  location: StateI;
}
