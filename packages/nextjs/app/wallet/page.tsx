"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Log } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { checkStealthAddressFast, decryptKeyfile } from "~~/utils/eth-stealth-addresses/lib";

interface Asset {
  type: "public" | "private";
  token: string;
  balance: string;
  symbol: string;
}

interface StealthTransfer {
  stealthAddress: string | undefined;
  ephemeralPubKey: string | undefined;
  viewTag: number;
  metadata: string | undefined;
}

// Define the type for the announcement event
type AnnouncementEvent = {
  log: Log<bigint, number, false>;
  args: {
    schemeId: bigint;
    stealthAddress: `0x${string}`;
    ephemeralPubKey: `0x${string}`;
    metadata: `0x${string}` | undefined;
  };
  blockData: unknown;
  receiptData: unknown;
  transactionData: unknown;
};

export default function WalletPage() {
  const router = useRouter();
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [password, setPassword] = useState("");
  const [keyfile, setKeyfile] = useState<{
    spending_key: string;
    viewing_key: string;
  } | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stealthTransfers, setStealthTransfers] = useState<StealthTransfer[]>([]);
  const [validStealthTransfers, setValidStealthTransfers] = useState<StealthTransfer[]>([]);

  // Check if wallet exists
  useEffect(() => {
    const encryptedKeyfile = localStorage.getItem("encryptedKeyfile");
    if (!encryptedKeyfile) {
      router.push("/onboarding");
    }
  }, [router]);

  // Handle decryption
  const handleDecrypt = async () => {
    try {
      const encryptedKeyfile = localStorage.getItem("encryptedKeyfile");
      if (!encryptedKeyfile) return;

      const decrypted = await decryptKeyfile(encryptedKeyfile, password);
      setKeyfile(JSON.parse(decrypted));
      setIsDecrypted(true);
    } catch (error) {
      console.error("Failed to decrypt keyfile:", error);
    }
  };

  // Subscribe to Announcement events
  const { data: announcements, isLoading: isLoadingAnnouncements } = useScaffoldEventHistory<
    "ERC5564Announcer",
    "Announcement",
    false,
    false,
    false
  >({
    contractName: "ERC5564Announcer",
    eventName: "Announcement",
    fromBlock: BigInt(0),
    watch: true,
  });

  // Process announcements when they arrive
  useEffect(() => {
    if (!announcements) return;

    const newTransfers: StealthTransfer[] = announcements.map(announcement => {
      const { stealthAddress, ephemeralPubKey, metadata } = announcement.args;
      return {
        stealthAddress,
        ephemeralPubKey,
        viewTag: metadata ? parseInt(metadata.slice(2, 4), 16) : 0,
        metadata,
      };
    });

    setStealthTransfers(prev => [...prev, ...newTransfers]);
  }, [announcements]);

  // Scan for stealth transfers when keyfile is decrypted
  useEffect(() => {
    const scanStealthTransfers = async () => {
      if (!keyfile) return;

      // Convert viewing key and spending public key to Uint8Array for wasm
      const viewingKey = new Uint8Array(Buffer.from(keyfile.viewing_key.slice(2), "hex"));
      const spendingPubKey = new Uint8Array(Buffer.from(keyfile.spending_key.slice(2), "hex"));

      // Process each transfer
      const matchedTransfers = await Promise.all(
        stealthTransfers.map(async transfer => {
          if (!transfer.stealthAddress || !transfer.ephemeralPubKey) return null;

          // Convert stealth address and ephemeral public key to Uint8Array
          const stealthAddr = new Uint8Array(Buffer.from(transfer.stealthAddress.slice(2), "hex"));
          const ephemeralPubKey = new Uint8Array(Buffer.from(transfer.ephemeralPubKey.slice(2), "hex"));

          // Check if this transfer belongs to us using the fast check with view tags
          const isOurs = await checkStealthAddressFast(
            stealthAddr,
            ephemeralPubKey,
            viewingKey,
            spendingPubKey,
            transfer.viewTag,
          );

          return isOurs ? transfer : null;
        }),
      );

      // Filter out null values and update state with matched transfers
      const validTransfers = matchedTransfers.filter((t): t is StealthTransfer => t !== null);
      console.log("Found stealth transfers:", validTransfers);

      // Here you would typically update some state to show the matched transfers
      // and possibly compute their balances
      setValidStealthTransfers(validStealthTransfers);
    };

    scanStealthTransfers();
  }, [keyfile, stealthTransfers]);

  if (!isDecrypted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Unlock Your Wallet</h2>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleDecrypt}>
              Unlock
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Public Assets</h2>
            {/* List public assets */}
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Private Assets</h2>
            {/* List private assets */}
          </div>
        </div>
      </div>

      {/* Transfer Interface */}
      <div className="mt-8 card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Transfer</h2>
          {/* Transfer interface components */}
        </div>
      </div>
    </div>
  );
}
