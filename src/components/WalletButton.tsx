import { useWeb3 } from "@/context/Web3Provider";

const WalletButton = () => {
  const { address, connectWallet } = useWeb3();
  return (
    <button
      onClick={connectWallet}
      className="bg-blue-500 hover:bg-blue-400 transition-all duration-100 ease-in h-10 px-2 font-semibold"
    >
      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect"}
    </button>
  );
};

export default WalletButton;
