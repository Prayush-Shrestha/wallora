export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateRegister(body: any): string | null {
  if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
    return "Name must be at least 2 characters long.";
  }
  if (!body.email || !isValidEmail(body.email)) {
    return "A valid email address is required.";
  }
  if (!body.password || typeof body.password !== "string" || body.password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  return null;
}

export function validateLogin(body: any): string | null {
  if (!body.email || !isValidEmail(body.email)) {
    return "A valid email address is required.";
  }
  if (!body.password) {
    return "Password is required.";
  }
  return null;
}
