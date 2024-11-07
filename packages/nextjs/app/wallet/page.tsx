"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { decryptKeyfile } from "~~/utils/eth-stealth-addresses/lib";

interface Asset {
  type: "public" | "private";
  token: string;
  balance: string;
  symbol: string;
}

interface StealthTransfer {
  stealthAddress: string;
  ephemeralPubKey: string;
  viewTag: number;
  metadata: string;
}

// Define the type for the announcement event
interface AnnouncementEvent {
  args: {
    stealthAddress: string;
    ephemeralPubKey: string;
    metadata: string;
  }
}

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
  const {
    data: announcements,
    isLoading: isLoadingAnnouncements
  }: {
    data: AnnouncementEvent[];
    isLoading: boolean;
  } = useScaffoldEventHistory<"ERC5564Announcer", "Announcement", false, false, false>({
    contractName: "ERC5564Announcer",
    eventName: "Announcement",
    fromBlock: BigInt(0),
    watch: true,

  });

  // Process announcements when they arrive
  useEffect(() => {
    if (!announcements) return;

    const newTransfers = announcements.map((announcement: AnnouncementEvent) => {
      const { stealthAddress, ephemeralPubKey, metadata } = announcement.args;
      const viewTag = Number(metadata[0]); // Assuming first byte is view tag

      return {
        stealthAddress,
        ephemeralPubKey,
        viewTag,
        metadata
      };
    });

    setStealthTransfers(prev => [...prev, ...newTransfers]);
  }, [announcements]);

  // Scan for stealth transfers when keyfile is decrypted
  useEffect(() => {
    if (!keyfile) return;

    const scanStealthTransfers = async () => {
      // Implement scanning logic using checkStealthAddressFast
      // Use viewing key to scan efficiently with view tags
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
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleDecrypt}
            >
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
