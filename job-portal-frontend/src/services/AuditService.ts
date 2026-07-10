export interface UnauthorizedAccessEvent {
  attemptedPath: string;
  userRole: string | null;
  allowedRoles: string[];
  userId?: string | null;
  timestamp: string;
}

/**
 * Client-side audit logging for security-relevant UI events.
 * Attempts to POST to the backend audit endpoint when available,
 * and always mirrors the event to the console for local diagnostics.
 */
export async function logUnauthorized(event: {
  attemptedPath: string;
  userRole: string | null;
  allowedRoles: string[];
  userId?: string | null;
}): Promise<void> {
  const payload: UnauthorizedAccessEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // Always record locally so incidents are visible during development.
  console.warn('[AuditService] Unauthorized access attempt', payload);

  try {
    await fetch('/api/audit/unauthorized', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Network failures must not block the redirect to the error page.
  }
}

export const AuditService = {
  logUnauthorized,
};

export default AuditService;
