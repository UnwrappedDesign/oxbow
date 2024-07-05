import { createHmac } from "crypto";

export const verifySignature = (signature: string, payload: string, secret: string) => {
  return createHmac('sha256', secret).update(payload).digest('hex') === signature;
}