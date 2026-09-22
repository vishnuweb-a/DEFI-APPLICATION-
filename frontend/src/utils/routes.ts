/** Keep previously shared dashboard hash links working at the new entry route. */
export function isDashboardRoute(pathname: string, hash: string) {
  return /^\/app\/?$/.test(pathname) || ["#overview", "#wallet", "#send", "#transactions", "#top"].includes(hash);
}
