import { WalletButton } from "../../shared/wallet-button";

export const Header = () => {
  return (
    <header className="border-b border-ink/10 px-6 py-4 flex items-center justify-between">
      <span className="font-semibold tracking-tight">GM Robinhood</span>
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono uppercase tracking-wider text-ink/60">
          Robinhood Chain · Testnet
        </span>
        <WalletButton />
      </div>
    </header>
  );
};
