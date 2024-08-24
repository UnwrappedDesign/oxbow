import { createHmac } from "crypto";
import { verifySignature } from "./verifySignature";

describe('verifySignature', () => {
  it('should return true if the signature is valid', () => {
    const payload = 'hello world';
    const secret = 'secret';
    const signature = createHmac('sha256', secret).update(payload).digest('hex');
    expect(verifySignature(signature, payload, secret)).to.be.true;
  });

  it('should return false if the signature is invalid', () => {
    const payload = 'hello world';
    const secret = 'secret';
    const signature = 'invalid';
    expect(verifySignature(signature, payload, secret)).to.be.false;
  });
});