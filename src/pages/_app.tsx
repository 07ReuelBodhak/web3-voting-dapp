import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Web3Provider } from "@/context/Web3Provider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  );
}
