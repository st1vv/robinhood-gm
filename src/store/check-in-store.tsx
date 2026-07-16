import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useConfig,
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { checkInAbi } from "@/abi/check-in";
import { premiumCheckInAbi } from "@/abi/premium-check-in";
import {
  CHECKIN_ADDRESS,
  PREMIUM_CHECKIN_ADDRESS,
} from "@/constants/constants";

type BusyKind = "free" | "premium" | null;

type FinalState = {
  totalFree: number;
  totalPremium: number;
  userFreeCount: number;
  userPremiumCount: number;
  onCheckIn: () => void;
  onPremiumCheckIn: () => void;
  isCheckInDisabled: boolean;
  isPremiumDisabled: boolean;
  isCheckInLoading: boolean;
  isPremiumLoading: boolean;
  checkInLabel: string;
  premiumLabel: string;
  error: string | null;
};

const Context = createContext<FinalState | null>(null);

export const useCheckInStore = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useCheckInStore must be used within a CheckInStoreProvider",
    );
  }
  return context;
};

export function CheckInStoreProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();

  const [busyKind, setBusyKind] = useState<BusyKind>(null);
  const [error, setError] = useState<string | null>(null);

  // Тікаючий годинник раз на хвилину — досить для відображення годин.
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 60_000);
    return () => clearInterval(id);
  }, []);

  const { data, refetch } = useReadContracts({
    contracts: [
      {
        address: CHECKIN_ADDRESS,
        abi: checkInAbi,
        functionName: "getLastCheckin",
        args: [address ?? "0x0"],
      },
      {
        address: CHECKIN_ADDRESS,
        abi: checkInAbi,
        functionName: "MIN_INTERVAL",
      },
      {
        address: CHECKIN_ADDRESS,
        abi: checkInAbi,
        functionName: "totalCheckins",
      },
      {
        address: CHECKIN_ADDRESS,
        abi: checkInAbi,
        functionName: "getCheckinCount",
        args: [address ?? "0x0"],
      },
      {
        address: PREMIUM_CHECKIN_ADDRESS,
        abi: premiumCheckInAbi,
        functionName: "getLastPremiumCheckin",
        args: [address ?? "0x0"],
      },
      {
        address: PREMIUM_CHECKIN_ADDRESS,
        abi: premiumCheckInAbi,
        functionName: "premiumPrice",
      },
      {
        address: PREMIUM_CHECKIN_ADDRESS,
        abi: premiumCheckInAbi,
        functionName: "totalPremiumCheckins",
      },
      {
        address: PREMIUM_CHECKIN_ADDRESS,
        abi: premiumCheckInAbi,
        functionName: "getPremiumCheckinCount",
        args: [address ?? "0x0"],
      },
    ],
    query: { enabled: isConnected },
  });

  const [
    lastFree,
    minInterval,
    globalFreeTotal,
    userFreeCount,
    lastPremium,
    premiumPrice,
    globalPremiumTotal,
    userPremiumCount,
  ] = data?.map((r) => r.result) ?? [];

  const interval = Number(minInterval ?? 0);
  const secondsUntilFree = lastFree ? Number(lastFree) + interval - now : 0;
  const secondsUntilPremium = lastPremium
    ? Number(lastPremium) + interval - now
    : 0;
  const canCheckIn = isConnected && secondsUntilFree <= 0;
  const canPremiumCheckIn = isConnected && secondsUntilPremium <= 0;

  const handleError = (err: unknown, fallback: string) => {
    const msg =
      (err as { shortMessage?: string; message?: string })?.shortMessage ??
      (err as Error)?.message ??
      fallback;
    if (/TooSoon/.test(msg))
      setError("Already checked in today for this type. Try again later.");
    else if (/InsufficientPayment/.test(msg))
      setError("Not enough ETH to cover the premium price.");
    else setError(msg);
  };

  const onCheckIn = async () => {
    setError(null);
    setBusyKind("free");
    try {
      const hash = await writeContractAsync({
        address: CHECKIN_ADDRESS,
        abi: checkInAbi,
        functionName: "checkIn",
      });
      await waitForTransactionReceipt(config, { hash });
      await refetch();
    } catch (err) {
      handleError(err, "Transaction failed");
    } finally {
      setBusyKind(null);
    }
  };

  const onPremiumCheckIn = async () => {
    setError(null);
    setBusyKind("premium");
    try {
      const hash = await writeContractAsync({
        address: PREMIUM_CHECKIN_ADDRESS,
        abi: premiumCheckInAbi,
        functionName: "premiumCheckIn",
        value: premiumPrice ?? 0n,
      });
      await waitForTransactionReceipt(config, { hash });
      await refetch();
    } catch (err) {
      handleError(err, "Premium transaction failed");
    } finally {
      setBusyKind(null);
    }
  };

  function formatCountdown(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }

  const finalState: FinalState = {
    totalFree: globalFreeTotal !== undefined ? Number(globalFreeTotal) : 0,
    totalPremium:
      globalPremiumTotal !== undefined ? Number(globalPremiumTotal) : 0,
    userFreeCount:
      isConnected && userFreeCount !== undefined ? Number(userFreeCount) : 0,
    userPremiumCount:
      isConnected && userPremiumCount !== undefined
        ? Number(userPremiumCount)
        : 0,
    onCheckIn,
    onPremiumCheckIn,
    isCheckInDisabled: !canCheckIn || busyKind !== null,
    isPremiumDisabled: !canPremiumCheckIn || busyKind !== null,
    isCheckInLoading: busyKind === "free",
    isPremiumLoading: busyKind === "premium",
    checkInLabel: canCheckIn
      ? "Tap to GM"
      : isConnected
        ? `Next GM in ${formatCountdown(secondsUntilFree)}`
        : "Connect wallet for GM",
    premiumLabel: canPremiumCheckIn
      ? `Premium GM `
      : isConnected
        ? `Next Premium GM in ${formatCountdown(secondsUntilPremium)}`
        : "Connect wallet for Premium GM",
    error,
  };

  return <Context.Provider value={finalState}>{children}</Context.Provider>;
}
