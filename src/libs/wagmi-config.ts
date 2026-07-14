import { createConfig, http } from "wagmi";
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors";
import { robinhoodTestnet } from "./chain-config";

export const wagmiConfig = createConfig({
  chains: [robinhoodTestnet],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: "GM Robinhood" }),
  ],
  transports: {
    [robinhoodTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
