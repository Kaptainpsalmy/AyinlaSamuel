/**
 * What Sentry may collect with an error, shared by the browser and server
 * setups (instrumentation*.ts). Sentry v11 collects cookies, headers, request
 * bodies and stack-frame variables by default; on a public site that could
 * include what visitors type into the contact form or the AI chat. Reports keep
 * only what debugging needs: the error, stack trace, page URL and browser.
 */
export const sentryDataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: { request: { allow: ["user-agent", "referer"] }, response: false },
  httpBodies: [],
  stackFrameVariables: false,
  genAI: { inputs: false, outputs: false },
};
