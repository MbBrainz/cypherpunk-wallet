import { gcm } from "@noble/ciphers/aes";
import { secp256k1 } from "@noble/curves/secp256k1";
import { scrypt } from "@noble/hashes/scrypt";
import { keccak_256 } from "@noble/hashes/sha3";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { randomBytes } from "@noble/hashes/utils";

type Address = Uint8Array; // 20 bytes
type StealthMetaAddress = Uint8Array; // 66 bytes
type PublicKeyCompressed = Uint8Array; // 33 bytes
type PrivateKey = Uint8Array; // 32 bytes
type Point = ReturnType<typeof secp256k1.ProjectivePoint.fromHex>;
type Scalar = bigint;

export function generateStealthAddress(stealthMetaAddress: StealthMetaAddress): [Address, PublicKeyCompressed, number] {
  const r = secp256k1.utils.randomPrivateKey();
  const [spendPkPoint, viewPkPoint] = decodeStealthMetaAddress(stealthMetaAddress);
  const [stealthPkPoint, viewTag] = getStealthPubkey(spendPkPoint, viewPkPoint, r);
  const stealthAddress = getAddressFromPubkey(stealthPkPoint);
  const ephemeralPubkey = encodePubkey(getPubkeyFromPriv(r));

  return [stealthAddress, ephemeralPubkey, viewTag];
}

export function checkStealthAddress(
  stealthAddress: Address,
  ephemeralPubkey: PublicKeyCompressed,
  viewingKey: PrivateKey,
  spendingPubkey: PublicKeyCompressed,
): boolean {
  const [sharedSecret] = getSharedSecret(decodePubkey(ephemeralPubkey), decodePriv(viewingKey));
  const check = getAddressFromPubkey(decodePubkey(spendingPubkey).add(getPubkeyFromPriv(sharedSecret)));

  return compareBytes(check, stealthAddress);
}

export function checkStealthAddressFast(
  stealthAddress: Address,
  ephemeralPubkey: PublicKeyCompressed,
  viewingKey: PrivateKey,
  spendingPubkey: PublicKeyCompressed,
  viewTag: number,
): boolean {
  const [sharedSecret, viewTagCheck] = getSharedSecret(decodePubkey(ephemeralPubkey), decodePriv(viewingKey));

  if (viewTagCheck === viewTag) {
    const check = getAddressFromPubkey(decodePubkey(spendingPubkey).add(getPubkeyFromPriv(sharedSecret)));
    return compareBytes(check, stealthAddress);
  }
  return false;
}

export function computeStealthKey(
  stealthAddress: Address,
  ephemeralPubkey: PublicKeyCompressed,
  viewingKey: PrivateKey,
  spendingKey: PrivateKey,
): PrivateKey {
  const [sharedSecret] = getSharedSecret(decodePubkey(ephemeralPubkey), decodePriv(viewingKey));
  const stealthKeyScalar =
    (BigInt("0x" + bytesToHex(sharedSecret)) + BigInt("0x" + bytesToHex(spendingKey))) % secp256k1.CURVE.n;

  const stealthAddressCheck = getAddressFromPubkey(getPubkeyFromPriv(stealthKeyScalar));

  if (!compareBytes(stealthAddressCheck, stealthAddress)) {
    throw new Error("keys do not generate stealth address");
  }

  return encodePriv(stealthKeyScalar);
}

export function generateStealthMetaAddress(): [StealthMetaAddress, PrivateKey, PrivateKey] {
  const s = secp256k1.utils.randomPrivateKey();
  const v = secp256k1.utils.randomPrivateKey();
  const pks = getPubkeyFromPriv(s);
  const pkv = getPubkeyFromPriv(v);

  return [encodeStealthMetaAddress(pks, pkv), s, v];
}

export function splitStealthMetaAddress(encoded: StealthMetaAddress): [PublicKeyCompressed, PublicKeyCompressed] {
  return [encoded.slice(0, 33), encoded.slice(33, 66)];
}

export function encodeStealthMetaAddress(pks: Point, pkv: Point): StealthMetaAddress {
  const combined = new Uint8Array(66);
  combined.set(encodePubkey(pks));
  combined.set(encodePubkey(pkv), 33);
  return combined;
}

export function decodeStealthMetaAddress(encoded: StealthMetaAddress): [Point, Point] {
  const [front, back] = splitStealthMetaAddress(encoded);
  return [decodePubkey(front), decodePubkey(back)];
}

export function encodePubkey(point: Point): PublicKeyCompressed {
  return point.toRawBytes(true);
}

export function decodePubkey(encoded: PublicKeyCompressed): Point {
  return secp256k1.ProjectivePoint.fromHex(bytesToHex(encoded));
}

export function encodePriv(x: Scalar): PrivateKey {
  return hexToBytes(x.toString(16).padStart(64, "0"));
}

export function decodePriv(encoded: PrivateKey): Scalar {
  return BigInt("0x" + bytesToHex(encoded));
}

export function getPubkeyFromPriv(x: Scalar | Uint8Array): Point {
  const scalar = typeof x === "bigint" ? x : BigInt("0x" + bytesToHex(x));
  return secp256k1.ProjectivePoint.fromPrivateKey(scalar);
}

export function getAddressFromPubkey(pubkey: Point): Address {
  const uncompressed = pubkey.toRawBytes(false);
  const hashable = uncompressed.slice(1);
  const hash = keccak_256(hashable);
  return new Uint8Array(hash.slice(12));
}

function getStealthPubkey(pks: Point, pkv: Point, r: Uint8Array): [Point, number] {
  const [sharedSecret, viewTag] = getSharedSecret(pkv, r);
  const stealthPub = pks.add(getPubkeyFromPriv(sharedSecret));
  return [stealthPub, viewTag];
}

function getSharedSecret(pubkey: Point, k: Scalar | Uint8Array): [Uint8Array, number] {
  const scalar = typeof k === "bigint" ? k : BigInt("0x" + bytesToHex(k));
  const sharedSecretRaw = pubkey.multiply(scalar);
  const hash = keccak_256(sharedSecretRaw.toRawBytes(true));
  return [hash, hash[0]];
}

function compareBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export async function encryptKeyfile(keyfileJson: string, password: string): Promise<string> {
  const key = await deriveKeyFromPassword(password);
  const iv = randomBytes(16);

  const aes = gcm(key, iv);
  const plaintext = new TextEncoder().encode(keyfileJson);
  const ciphertext = aes.encrypt(plaintext);

  // Concatenate IV and ciphertext
  const result = new Uint8Array(iv.length + ciphertext.length);
  result.set(iv, 0);
  result.set(ciphertext, iv.length);

  // Return as base64 string
  return btoa(String.fromCharCode(...result));
}

export async function decryptKeyfile(encryptedKeyfileBase64: string, password: string): Promise<string> {
  const key = await deriveKeyFromPassword(password);
  const encryptedData = Uint8Array.from(atob(encryptedKeyfileBase64), c => c.charCodeAt(0));

  const iv = encryptedData.slice(0, 16);
  const ciphertext = encryptedData.slice(16);

  const aes = gcm(key, iv);
  const plaintext = aes.decrypt(ciphertext);
  return new TextDecoder().decode(plaintext);
}

async function deriveKeyFromPassword(password: string): Promise<Uint8Array> {
  const passwordBytes = new TextEncoder().encode(password);
  // Use scrypt for key derivation
  const salt = new Uint8Array(16); // Use a fixed salt or store it securely
  const key = await scrypt(passwordBytes, salt, { N: 2 ** 14, r: 8, p: 1, dkLen: 32 });
  return key;
}
