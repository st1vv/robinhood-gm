import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/libs/wagmi-config";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { CheckInStoreProvider } from "@/store/check-in-store";
import { App } from "@/app/app";
import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/index.css";

const queryClient = new QueryClient();

const rainbowTheme = darkTheme({
  accentColor: "rgb(190, 240, 20)",
  accentColorForeground: "#110e08",
  borderRadius: "medium",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowTheme} modalSize="compact">
          <CheckInStoreProvider>
            <App />
          </CheckInStoreProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
