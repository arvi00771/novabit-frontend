export type TwoFactorSetup = {
  secret?: string;
  uri?: string;
};

type SetupResponse = Record<string, unknown>;

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getSetupResponse(value: unknown): SetupResponse | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as SetupResponse;
}

function secretFromOtpAuthUri(uri?: string): string | undefined {
  if (!uri?.toLowerCase().startsWith('otpauth://')) {
    return undefined;
  }

  try {
    return nonEmptyString(new URL(uri).searchParams.get('secret'));
  } catch {
    return undefined;
  }
}

function createOtpAuthUri(secret: string, email?: string): string {
  const issuer = 'NovaBit';
  const account = email || 'account';
  const label = encodeURIComponent(`${issuer}:${account}`);
  const params = new URLSearchParams({
    secret,
    issuer,
    period: '30',
    digits: '6',
  });

  return `otpauth://totp/${label}?${params.toString()}`;
}

/**
 * Normalizes 2FA setup payloads from current and legacy API deployments.
 * Some API versions call the OTP URI `qr_code_url`; an authenticator needs
 * the underlying otpauth URI, not an image URL.
 */
export function normalizeTwoFactorSetup(payload: unknown, email?: string): TwoFactorSetup | null {
  const response = getSetupResponse(payload);
  if (!response) {
    return null;
  }

  const apiSecret =
    nonEmptyString(response.secret) ??
    nonEmptyString(response.manual_entry_key) ??
    nonEmptyString(response.manualEntryKey);
  const uriCandidate =
    nonEmptyString(response.uri) ??
    nonEmptyString(response.otpauth_uri) ??
    nonEmptyString(response.otpauthUrl) ??
    nonEmptyString(response.otpauth_url) ??
    nonEmptyString(response.qr_code_url) ??
    nonEmptyString(response.qrCodeUrl);
  const uri = uriCandidate?.toLowerCase().startsWith('otpauth://') ? uriCandidate : undefined;
  const secret = apiSecret ?? secretFromOtpAuthUri(uri);

  if (!secret && !uri) {
    return null;
  }

  return {
    secret,
    // A manual secret is sufficient to construct a standards-compliant QR code
    // when an older API does not return the URI field.
    uri: uri ?? (secret ? createOtpAuthUri(secret, email) : undefined),
  };
}
