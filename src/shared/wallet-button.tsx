import { useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { robinhoodTestnet } from "../libs/chain-config";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export const WalletButton = () => {
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [pickerOpen, setPickerOpen] = useState(false);

  const wrongNetwork = isConnected && chainId !== robinhoodTestnet.id;

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setPickerOpen((v) => !v)}
          className="rounded-md bg-ink text-lime font-semibold text-xs px-4 py-2 hover:opacity-90 transition-opacity"
        >
          Connect wallet
        </button>
        {pickerOpen && (
          <WalletPickerDropdown onClose={() => setPickerOpen(false)} />
        )}
      </div>
    );
  }

  if (wrongNetwork) {
    return (
      <button
        onClick={() => switchChain({ chainId: robinhoodTestnet.id })}
        disabled={isSwitching}
        className="rounded-md bg-ink/10 border border-ink text-ink font-mono text-xs px-4 py-2 hover:bg-ink/20 transition-colors"
      >
        {isSwitching ? "Switching…" : "Wrong network — switch"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-ink/70">
        {truncateAddress(address!)}
      </span>
      <button
        onClick={() => disconnect()}
        className="text-xs font-mono text-ink/50 underline hover:text-ink transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
};

function WalletPickerDropdown({ onClose }: { onClose: () => void }) {
  const { connectors, connect, isPending, error } = useConnect();

  const uniqueConnectors = useMemo(() => {
    const seen = new Set<string>();
    return connectors.filter((c) => {
      if (seen.has(c.name)) return false;
      seen.add(c.name);
      return true;
    });
  }, [connectors]);

  return (
    <div className="absolute right-0 mt-2 w-56 rounded-lg border border-ink/15 bg-lime shadow-lg z-10 p-2 flex flex-col gap-1">
      {uniqueConnectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => {
            connect({ connector });
            onClose();
          }}
          disabled={isPending}
          className="flex items-center gap-2 text-left text-sm font-medium text-ink px-3 py-2 rounded-md
                     hover:bg-ink/10 transition-colors disabled:opacity-40"
        >
          {connector.icon && (
            <img src={connector.icon} alt="" className="w-5 h-5 rounded" />
          )}
          {connector.name}
        </button>
      ))}
      {uniqueConnectors.length === 0 && (
        <p className="text-xs text-ink/50 px-3 py-2">
          No wallet extensions found.
        </p>
      )}
      {error && (
        <p className="text-xs text-ink/70 px-3 py-1">{error.message}</p>
      )}
    </div>
  );
}
