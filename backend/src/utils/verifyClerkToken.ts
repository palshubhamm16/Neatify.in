import { jwtVerify, createRemoteJWKSet, JWTPayload } from 'jose';

export interface UserFromToken {
  email: string;
  name?: string;
  sub: string;
}

interface ClerkJWTPayload extends JWTPayload {
  public_metadata?: {
    email?: string;
    name?: string;
  };
}

const CLERK_JWKS_URL = 'https://wise-seasnail-82.clerk.accounts.dev/.well-known/jwks.json';
const jwks = createRemoteJWKSet(new URL(CLERK_JWKS_URL));

export const verifyClerkToken = async (token: string): Promise<UserFromToken> => {
  try {
    const { payload } = await jwtVerify(token, jwks) as { payload: ClerkJWTPayload };
    console.log("🔍 JWT Payload:", payload);

    const email = payload?.public_metadata?.email;
    const name = payload?.public_metadata?.name;
    const sub = payload?.sub;

    if (!email || !sub) {
      throw new Error('Missing required fields in token.');
    }

    return {
      email,
      name,
      sub,
    };
  } catch (err) {
    console.error('JWT verification failed:', err);
    throw new Error('Invalid token');
  }
};
