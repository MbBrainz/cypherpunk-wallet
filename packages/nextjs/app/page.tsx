"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { bytesToHex, hexToBytes } from "viem";
import { useAccount } from "wagmi";
import { MinusIcon, PlusIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { Address, AddressInput, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { generateStealthAddress } from "~~/utils/eth-stealth-addresses/lib";
import { isZeroAddress } from "~~/utils/scaffold-eth/common";

interface ERC20Transfer {
  tokenAddress: string;
  amount: string;
}

interface ERC721Transfer {
  tokenAddress: string;
  tokenId: string;
}

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState("");
  const [stealthMetaAddress, setStealthMetaAddress] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [TokenTransfers, setErc20Transfers] = useState<ERC20Transfer[]>([]);
  const [erc721Transfer, setErc721Transfer] = useState<ERC721Transfer | null>(null);

  const { data } = useScaffoldReadContract({
    contractName: "ERC6538Registry",
    functionName: "stealthMetaAddressOf",
    args: [address, BigInt(1)],
  });

  const { writeContractAsync: executeStealthereum } = useScaffoldWriteContract("Stealthereum");

  useEffect(() => {
    if (address && !isZeroAddress(address)) {
      setStealthMetaAddress(data ?? "");
    } else {
      setStealthMetaAddress("");
    }
  }, [address]);

  const handleExecuteStealthTransfer = async () => {
    console.log("execute stealth transfer");
    const stealthMetaAddressBytes = hexToBytes(stealthMetaAddress as `0x${string}`);
    console.log({ stealthMetaAddressBytes });
    const [stealthAddress, ephemeralPubkey, viewTag] = generateStealthAddress(stealthMetaAddressBytes);

    console.log({ stealthAddress, ephemeralPubkey, viewTag });

    await executeStealthereum({
      functionName: "stealthTransfer",
      args: [
        {
          schemeId: BigInt(1),
          tokens: TokenTransfers.map(transfer => transfer.tokenAddress),
          values: TokenTransfers.map(transfer => BigInt(transfer.amount)),
          ephemeralPubkey: bytesToHex(ephemeralPubkey),
          stealthAddress: bytesToHex(stealthAddress),
          viewTag: viewTag,
          extraMetadata: "0x",
        },
      ],
    });
  };

  const addErc20Transfer = () => {
    setErc20Transfers([...TokenTransfers, { tokenAddress: "", amount: "" }]);
  };

  const removeErc20Transfer = (index: number) => {
    setErc20Transfers(TokenTransfers.filter((_, i) => i !== index));
  };

  const updateErc20Transfer = (index: number, field: keyof ERC20Transfer, value: string) => {
    const newTransfers = [...TokenTransfers];
    newTransfers[index] = { ...newTransfers[index], [field]: value };
    setErc20Transfers(newTransfers);
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-2xl rounded-3xl">
              <h2 className="mb-4">Enter Recipient Address</h2>
              <AddressInput placeholder="Recipient address" onChange={setAddress} value={address} />

              {stealthMetaAddress && (
                <div className="mt-4 animate-fade-in flex flex-col items-center">
                  <div className="flex items-center space-x-2 text-primary">
                    <ShieldCheckIcon className="h-6 w-6 animate-pulse" />
                    <span className="font-semibold">Private Send Available</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{stealthMetaAddress}</p>
                </div>
              )}

              {/* ETH Transfer Section */}
              <div className="mt-6 w-full">
                <h3 className="text-lg mb-2">ETH Amount</h3>
                <EtherInput value={ethAmount} onChange={value => setEthAmount(value)} placeholder="Amount to send" />
              </div>

              {/* ERC20 Transfers Section */}
              <div className="mt-6 w-full">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg">ERC20 Tokens</h3>
                  <button className="btn btn-primary btn-sm" onClick={addErc20Transfer}>
                    <PlusIcon className="h-4 w-4" /> Add Token
                  </button>
                </div>

                {TokenTransfers.map((transfer, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <AddressInput
                      placeholder="Token Address"
                      value={transfer.tokenAddress}
                      onChange={value => updateErc20Transfer(index, "tokenAddress", value)}
                    />
                    <EtherInput
                      value={transfer.amount}
                      onChange={value => updateErc20Transfer(index, "amount", value)}
                      placeholder="Amount"
                    />
                    <button className="btn btn-ghost btn-sm" onClick={() => removeErc20Transfer(index)}>
                      <MinusIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* ERC721 Transfer Section */}
              <div className="mt-6 w-full">
                <h3 className="text-lg mb-2">ERC721 Token</h3>
                <div className="flex gap-2">
                  <AddressInput
                    placeholder="NFT Contract Address"
                    value={erc721Transfer?.tokenAddress || ""}
                    onChange={value => setErc721Transfer(prev => ({ ...prev, tokenAddress: value }) as ERC721Transfer)}
                  />
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="Token ID"
                    value={erc721Transfer?.tokenId || ""}
                    onChange={e => setErc721Transfer(prev => ({ ...prev, tokenId: e.target.value }) as ERC721Transfer)}
                  />
                </div>
              </div>

              {/* Send Button */}
              <button
                className="btn btn-primary mt-6"
                disabled={!address || (!ethAmount && TokenTransfers.length === 0 && !erc721Transfer)}
                onClick={handleExecuteStealthTransfer}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
