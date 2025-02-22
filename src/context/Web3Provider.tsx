import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { VotingContract } from "@/types/VotingContract";

interface Web3ContextType {
  address: string | null;
  voted: boolean;
  loading: boolean;
  fetchingVotes: boolean;
  provider: ethers.JsonRpcProvider | null;
  contract: VotingContract | null;
  votes: Record<string, number>;
  voteForLanguage: (lang: string) => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const contractABI = [
  {
    type: "function",
    name: "getLanguageLength",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getVote",
    inputs: [{ name: "language", type: "string", internalType: "string" }],
    outputs: [{ name: "", type: "int256", internalType: "int256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "vote",
    inputs: [{ name: "language", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "VotingSucceed",
    inputs: [
      {
        name: "voter",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "language",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "AlreadyVoted", inputs: [] },
];

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [contract, setContract] = useState<VotingContract | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingVotes, setFetchingVotes] = useState<boolean>(false);

  useEffect(() => {
    const initializeWeb3 = async () => {
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

      if (!rpcUrl || !contractAddress) {
        return;
      }

      const rpcProvider = new ethers.JsonRpcProvider(rpcUrl);
      setProvider(rpcProvider);

      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        rpcProvider
      ) as unknown as VotingContract;
      setContract(contractInstance);

      await fetchVotes(contractInstance);
    };

    initializeWeb3();
  }, []);

  const fetchVotes = async (contractInstance: VotingContract) => {
    if (!contractInstance) return;

    const languages = ["JavaScript", "Rust", "C++", "PHP", "Python"];
    const votesData: Record<string, number> = {};

    try {
      setFetchingVotes(true);
      for (const lang of languages) {
        const voteCount = await contractInstance.getVote(lang);
        votesData[lang] = Number(voteCount);
      }
      setVotes(votesData);
    } finally {
      setFetchingVotes(false);
    }
  };

  const voteForLanguage = async (lang: string) => {
    if (!contract) {
      alert("Contract not initialized");
      return;
    }
    if (!address) {
      alert("Please connect your wallet");
      return;
    }
    if (voted) {
      alert("You have already voted!");
      return;
    }

    try {
      setLoading(true);
      const browserProvider = new ethers.BrowserProvider(
        (window as { ethereum?: ethers.Eip1193Provider }).ethereum!
      );
      const signer = await browserProvider.getSigner();
      const contractWithSigner = contract.connect(signer) as VotingContract;

      const tx = await contractWithSigner.vote(lang);
      await tx.wait();
      alert("Vote successfully casted!");

      await fetchVotes(contract);
      setVoted(true);
    } catch (err) {
      if ((err as { reason?: string }).reason?.includes("AlreadyVoted")) {
        alert("You have already voted!");
        setVoted(true);
      } else if ((err as { code?: string }).code === "ACTION_REJECTED") {
        alert("Transaction rejected by user");
      } else {
        alert("Failed to cast vote or you must have already voted");
      }
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    if (address) {
      const confirmDisconnect = window.confirm(
        "You are already connected. Do you want to disconnect?"
      );
      if (confirmDisconnect) {
        disconnectWallet();
      }
      return;
    }

    if (!(window as { ethereum?: ethers.Eip1193Provider }).ethereum) {
      alert("MetaMask is not installed");
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(
        (window as { ethereum?: ethers.Eip1193Provider }).ethereum!
      );
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
    } catch {
      alert("Unable to connect wallet");
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    alert("Wallet disconnected successfully!");
  };

  return (
    <Web3Context.Provider
      value={{
        address,
        provider,
        voted,
        loading,
        fetchingVotes,
        contract,
        votes,
        connectWallet,
        voteForLanguage,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error("useWeb3 must be used within a Web3Provider");
  return context;
};
