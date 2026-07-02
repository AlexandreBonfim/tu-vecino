import type { PinCategory } from '../../generated/prisma';

// Each category has a default lifetime in minutes.
// After this window a scheduled job marks the pin inactive and
// broadcasts a removal event to connected map clients.
export const PIN_EXPIRY_MINUTES: Record<PinCategory, number> = {
  SAFETY_INCIDENT: 180, // 3 h
  TRAFFIC: 120, // 2 h
  POLICE_CONTROL: 90, // 1.5 h
  EVENT: 1440, // 24 h
  LOST_FOUND: 4320, // 3 days
  CIVIC_ISSUE: 10080, // 7 days
  EXPAT_MEETUP: 1440, // 24 h
  WEATHER_HAZARD: 360, // 6 h
};
