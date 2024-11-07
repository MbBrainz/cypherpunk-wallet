"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { decryptKeyfile } from "~~/utils/eth-stealth-addresses/lib";

export default function ImportWalletComponent() {
  const [password, setPassword] = useState("");
  const [keyfileContent, setKeyfileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          setKeyfileContent(event.target.result.toString());
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  const handleImportWallet = async () => {
    setLoading(true);
    // Decrypt keyfile with password
    try {
      const decryptedKeyfile = await decryptKeyfile(keyfileContent, password);
      const keyfile = JSON.parse(decryptedKeyfile);

      // Store encrypted keyfile in local storage
      localStorage.setItem("encryptedKeyfile", keyfileContent);

      // Store keys in memory or state management
      // ... code to store keys ...

      setLoading(false);

      // Redirect to wallet manager page
      router.push("/wallet");
    } catch (error) {
      alert("Failed to decrypt keyfile. Please check your password.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg">Import Wallet</h3>
      <p className="py-4">Please upload your encrypted keyfile and enter your password.</p>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Encrypted Keyfile</span>
        </label>
        <input type="file" className="file-input file-input-bordered" accept=".enc" onChange={handleFileUpload} />
      </div>
      <div className="form-control mt-4">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          className="input input-bordered"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="modal-action">
        <button
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          onClick={handleImportWallet}
          disabled={!password || !keyfileContent || loading}
        >
          Import Wallet
        </button>
      </div>
    </div>
  );
}
