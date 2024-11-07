/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    ERC5564Announcer: {
      address: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "schemeId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "stealthAddress",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "caller",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bytes",
              name: "ephemeralPubKey",
              type: "bytes",
            },
            {
              indexed: false,
              internalType: "bytes",
              name: "metadata",
              type: "bytes",
            },
          ],
          name: "Announcement",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "schemeId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "stealthAddress",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "ephemeralPubKey",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "metadata",
              type: "bytes",
            },
          ],
          name: "announce",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
    ERC6538Registry: {
      address: "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "ERC6538Registry__InvalidSignature",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "registrant",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "newNonce",
              type: "uint256",
            },
          ],
          name: "NonceIncremented",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "registrant",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "schemeId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "bytes",
              name: "stealthMetaAddress",
              type: "bytes",
            },
          ],
          name: "StealthMetaAddressSet",
          type: "event",
        },
        {
          inputs: [],
          name: "DOMAIN_SEPARATOR",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "ERC6538REGISTRY_ENTRY_TYPE_HASH",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "incrementNonce",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "registrant",
              type: "address",
            },
          ],
          name: "nonceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "schemeId",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "stealthMetaAddress",
              type: "bytes",
            },
          ],
          name: "registerKeys",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "registrant",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "schemeId",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "signature",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "stealthMetaAddress",
              type: "bytes",
            },
          ],
          name: "registerKeysOnBehalf",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "registrant",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "schemeId",
              type: "uint256",
            },
          ],
          name: "stealthMetaAddressOf",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
    StealthSwapHelper: {
      address: "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_stealthereum",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "ArrayLengthMismatch",
          type: "error",
        },
        {
          inputs: [],
          name: "NoSwapOutput",
          type: "error",
        },
        {
          inputs: [],
          name: "SwapCallFailed",
          type: "error",
        },
        {
          inputs: [],
          name: "WrongMsgValue",
          type: "error",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "schemeId",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "stealthAddress",
                  type: "address",
                },
                {
                  internalType: "bytes",
                  name: "ephemeralPubkey",
                  type: "bytes",
                },
                {
                  internalType: "uint8",
                  name: "viewTag",
                  type: "uint8",
                },
                {
                  internalType: "bytes",
                  name: "extraMetadata",
                  type: "bytes",
                },
                {
                  internalType: "address",
                  name: "inputToken",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "inputAmount",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "outputToken",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "swapRouter",
                  type: "address",
                },
                {
                  internalType: "bytes",
                  name: "swapPayload",
                  type: "bytes",
                },
                {
                  internalType: "uint256",
                  name: "nativeTransfer",
                  type: "uint256",
                },
              ],
              internalType: "struct IStealthSwapHelper.StealthSwap",
              name: "swap",
              type: "tuple",
            },
          ],
          name: "stealthSwap",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "schemeId",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "stealthAddress",
                  type: "address",
                },
                {
                  internalType: "bytes",
                  name: "ephemeralPubkey",
                  type: "bytes",
                },
                {
                  internalType: "uint8",
                  name: "viewTag",
                  type: "uint8",
                },
                {
                  internalType: "bytes",
                  name: "extraMetadata",
                  type: "bytes",
                },
                {
                  internalType: "address",
                  name: "inputToken",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "inputAmount",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "outputToken",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "swapRouter",
                  type: "address",
                },
                {
                  internalType: "bytes",
                  name: "swapPayload",
                  type: "bytes",
                },
                {
                  internalType: "uint256",
                  name: "nativeTransfer",
                  type: "uint256",
                },
              ],
              internalType: "struct IStealthSwapHelper.StealthSwap",
              name: "swap",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256",
                  name: "schemeId",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "stealthAddress",
                  type: "address",
                },
                {
                  internalType: "bytes",
                  name: "ephemeralPubkey",
                  type: "bytes",
                },
                {
                  internalType: "uint8",
                  name: "viewTag",
                  type: "uint8",
                },
                {
                  internalType: "address[]",
                  name: "tokens",
                  type: "address[]",
                },
                {
                  internalType: "uint256[]",
                  name: "values",
                  type: "uint256[]",
                },
                {
                  internalType: "bytes",
                  name: "extraMetadata",
                  type: "bytes",
                },
              ],
              internalType: "struct IStealthereum.StealthTransfer",
              name: "transferData",
              type: "tuple",
            },
            {
              internalType: "uint256",
              name: "transferValueETH",
              type: "uint256",
            },
          ],
          name: "stealthSwapAndBatch",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "stealthereum",
          outputs: [
            {
              internalType: "contract IStealthereum",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
      inheritedFunctions: {
        stealthSwap: "contracts/interfaces/IStealthSwapHelper.sol",
        stealthSwapAndBatch: "contracts/interfaces/IStealthSwapHelper.sol",
      },
    },
    Stealthereum: {
      address: "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_announcer",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "ArrayLengthMismatch",
          type: "error",
        },
        {
          inputs: [],
          name: "MalformattedMetadata",
          type: "error",
        },
        {
          inputs: [],
          name: "NativeTransferFailed",
          type: "error",
        },
        {
          inputs: [],
          name: "WrongMsgValue",
          type: "error",
        },
        {
          inputs: [],
          name: "announcer",
          outputs: [
            {
              internalType: "contract IERC5564Announcer",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "schemeId",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "stealthAddress",
                  type: "address",
                },
                {
                  internalType: "bytes",
                  name: "ephemeralPubkey",
                  type: "bytes",
                },
                {
                  internalType: "uint8",
                  name: "viewTag",
                  type: "uint8",
                },
                {
                  internalType: "address[]",
                  name: "tokens",
                  type: "address[]",
                },
                {
                  internalType: "uint256[]",
                  name: "values",
                  type: "uint256[]",
                },
                {
                  internalType: "bytes",
                  name: "extraMetadata",
                  type: "bytes",
                },
              ],
              internalType: "struct IStealthereum.StealthTransfer[]",
              name: "transfersData",
              type: "tuple[]",
            },
            {
              internalType: "uint256[]",
              name: "msgvalues",
              type: "uint256[]",
            },
          ],
          name: "batchStealthTransfers",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "msgvalue",
              type: "uint256",
            },
            {
              internalType: "uint8",
              name: "viewTag",
              type: "uint8",
            },
            {
              internalType: "address[]",
              name: "tokens",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "values",
              type: "uint256[]",
            },
            {
              internalType: "bytes",
              name: "extraMetadata",
              type: "bytes",
            },
          ],
          name: "getMetadata",
          outputs: [
            {
              internalType: "bytes",
              name: "metadata",
              type: "bytes",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "metadata",
              type: "bytes",
            },
          ],
          name: "parseMetadata",
          outputs: [
            {
              internalType: "uint256",
              name: "valueETH",
              type: "uint256",
            },
            {
              internalType: "address[]",
              name: "tokens",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "values",
              type: "uint256[]",
            },
            {
              internalType: "uint256",
              name: "extraDataLen",
              type: "uint256",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "schemeId",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "stealthAddress",
                  type: "address",
                },
                {
                  internalType: "bytes",
                  name: "ephemeralPubkey",
                  type: "bytes",
                },
                {
                  internalType: "uint8",
                  name: "viewTag",
                  type: "uint8",
                },
                {
                  internalType: "address[]",
                  name: "tokens",
                  type: "address[]",
                },
                {
                  internalType: "uint256[]",
                  name: "values",
                  type: "uint256[]",
                },
                {
                  internalType: "bytes",
                  name: "extraMetadata",
                  type: "bytes",
                },
              ],
              internalType: "struct IStealthereum.StealthTransfer",
              name: "transferData",
              type: "tuple",
            },
          ],
          name: "stealthTransfer",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
      inheritedFunctions: {
        batchStealthTransfers: "contracts/interfaces/IStealthereum.sol",
        getMetadata: "contracts/interfaces/IStealthereum.sol",
        parseMetadata: "contracts/interfaces/IStealthereum.sol",
        stealthTransfer: "contracts/interfaces/IStealthereum.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;