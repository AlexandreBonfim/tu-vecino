export interface JwtPayload {
  sub: string; // user id
  email: string; // for convenience in logs / downstream guards
}

// Shape injected into request.user by the JWT strategy
export interface RequestUser {
  userId: string;
  email: string;
}
