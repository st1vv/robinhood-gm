import { createConfig, http } from "wagmi";
import { robinhoodTestnet } from "@/libs/chain-config";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rabbyWallet,
  injectedWallet,
  okxWallet,
  binanceWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { REOWN_PROJECT_ID } from "@/constants/constants";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet,
        rabbyWallet,
        okxWallet,
        binanceWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName: "RobinhoodGM",
    projectId: REOWN_PROJECT_ID,
  },
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [robinhoodTestnet],
  transports: {
    [robinhoodTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
