export type UserRecord = {
  id: string;
  email: string | null;
  passwordHash?: string | null;
  onboardingCompleted?: boolean;
};

export type PinRecord = {
  id: string;
  disputeCount?: number;
  confirmCount?: number;
  isActive?: boolean;
};
