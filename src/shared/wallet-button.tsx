import { ConnectButton } from "@rainbow-me/rainbowkit";
import { StandartButton } from "@/shared/standard-button";
import WalletIcon from "@/assets/wallet-icon.svg?react";

export const WalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal, openAccountModal, mounted }) => {
        if (!mounted) return null;

        const label = account ? account.displayName : "Connect wallet";
        const onClick = account ? openAccountModal : openConnectModal;
        const variant = account ? "secondary" : "primary";

        return (
          <StandartButton
            variant={variant}
            onClick={onClick}
            className="px-3 sm:px-4 flex gap-2 items-center justify-center w-auto sm:w-[170px]"
          >
            <WalletIcon className={`w-6 h-6`} />
            <span className="hidden sm:inline">{label}</span>
          </StandartButton>
        );
      }}
    </ConnectButton.Custom>
  );
};
