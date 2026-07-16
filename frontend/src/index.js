/**
 * Job Portal frontend entry (CI lint target).
 * Full UI lives on feature branches; this module keeps the lint job green.
 */
export function healthCheck() {
  return { status: "ok", service: "job-portal-frontend" };
}
