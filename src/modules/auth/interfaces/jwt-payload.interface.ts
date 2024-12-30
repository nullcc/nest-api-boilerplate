/**
 * See https://en.wikipedia.org/wiki/JSON_Web_Token
 */
export interface JwtPayload {
  // standard fields
  iss?: string; // issuer
  exp?: number; // expiration time
  sub?: string; // subject
  aud?: string; // audience
  nbf?: number; // not before
  iat?: number; // issued at
  jti?: string; // JWT ID

  // custom fields
  email: string;
  name: string;
}
