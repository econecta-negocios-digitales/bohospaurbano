export const BOHO_MEASUREMENT_CONSENT_KEY = "boho_measurement_consent_v1";

export const measurementConsentStatuses = ["pending", "accepted", "rejected"] as const;
export type MeasurementConsentStatus = (typeof measurementConsentStatuses)[number];

export function isMeasurementConsentStatus(value: string | null): value is MeasurementConsentStatus {
  return value !== null && measurementConsentStatuses.includes(value as MeasurementConsentStatus);
}
