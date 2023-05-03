import { SignJWT, jwtVerify } from 'jose'
const NEXTAUTH_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "");

type User = {
  id: number
}

const verifyToken = async (token: string) => {
  return await jwtVerify(token, NEXTAUTH_SECRET).catch(e => null)
};

const signToken = async (data: User, time = '1h') => {
  return new SignJWT({
    id: data.id
  })
		.setProtectedHeader({ alg: "HS256" })
    .setSubject(data.id.toString())
		.setIssuedAt()
		.setExpirationTime(time)
		.sign(NEXTAUTH_SECRET)
};

export {
  verifyToken,
  signToken
}