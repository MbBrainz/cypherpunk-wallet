'use client';
import { useState } from 'react';
import { generateStealthMetaAddress, encryptKeyfile } from '~~/utils/eth-stealth-addresses/lib';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/navigation';

export default function CreateWalletComponent() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateWallet = async () => {
    setLoading(true);
    // Generate stealth meta address and keys
    const [stealthMetaAddress, spendingKey, viewingKey] = generateStealthMetaAddress();

    // Create keyfile object
    const keyfile = {
      spending_key: Buffer.from(spendingKey).toString('hex'),
      viewing_key: Buffer.from(viewingKey).toString('hex'),
    };

    // Encrypt keyfile with password
    const encryptedKeyfile = await encryptKeyfile(JSON.stringify(keyfile), password);

    // Prompt user to download encrypted keyfile
    const blob = new Blob([encryptedKeyfile], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'cypherpunk-wallet-keyfile.enc');

    // Store encrypted keyfile in local storage
    localStorage.setItem('encryptedKeyfile', encryptedKeyfile);

    setLoading(false);

    // Redirect to wallet manager page
    router.push('/wallet');
  };

  return (
    <div>
      <h3 className="font-bold text-lg">Create New Wallet</h3>
      <p className="py-4">
        Please create a password to secure your wallet keyfile.
      </p>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          className="input input-bordered"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="modal-action">
        <button
          className={`btn btn-primary ${loading ? 'loading' : ''}`}
          onClick={handleCreateWallet}
          disabled={!password || loading}
        >
          Create Wallet
        </button>
      </div>
    </div>
  );
}