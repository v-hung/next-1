import { SignJWT, jwtVerify } from 'jose'
const AUTH_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "");

type User = {
  id: number
}

const verifyToken = async (token: string) => {
  return await jwtVerify(token, AUTH_SECRET)
};

const signToken = async (data: User, time = '1h') => {
  return new SignJWT({
    id: data.id
  })
		.setProtectedHeader({ alg: "HS256" })
    .setSubject(data.id.toString())
		.setIssuedAt()
		.setExpirationTime(time)
		.sign(AUTH_SECRET)
};

export {
  verifyToken,
  signToken
}