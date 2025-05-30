import { SignJWT, jwtVerify, JWTPayload } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signToken(payload: JWTPayload): Promise<string> {
  // console.log("type of SECRET_KEY", typeof SECRET_KEY);
  // console.log("SECRET_KEY", SECRET_KEY);
  // console.log("Payload", payload);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("3h")
    .sign(SECRET_KEY);

  return token;
}

export async function verifyToken(token: string): Promise<any> {
  try {
    // console.log("Verification:");
    // console.log("type of SECRET_KEY", typeof SECRET_KEY);
    // console.log("SECRET_KEY", SECRET_KEY);
    // console.log("Verify token", token);

    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
