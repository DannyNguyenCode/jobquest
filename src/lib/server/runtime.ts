/**
 * Server-only module. Do not import from Client Components or shared client code.
 */
export function assertServerOnly(moduleName: string): void {
  if (typeof window !== "undefined") {
    throw new Error(
      `${moduleName} is a server-only module and cannot run in the browser.`,
    );
  }
}
