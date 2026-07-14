// import {
//   useAccount,
//   useReadContracts,
//   useWriteContract,
//   useWaitForTransactionReceipt,
// } from "wagmi";
// import { formatEther } from "viem";
// import { useEffect, useState } from "react";
// import {
//   CHECKIN_ADDRESS,
//   PREMIUM_CHECKIN_ADDRESS,
// } from "../../constants/constants";
// import { checkInAbi } from "../../abi/check-in";
// import { premiumCheckInAbi } from "../../abi/premium-check-in";

// type PendingTx = { hash: `0x${string}`; kind: "free" | "premium" } | null;

// export const HomeCheckInPanel = () => {
//   const { address, isConnected } = useAccount();
//   const { writeContractAsync, isPending: isWriting } = useWriteContract();
//   const [pendingTx, setPendingTx] = useState<PendingTx>(null);
//   const [error, setError] = useState<string | null>(null);

//   const { data, refetch } = useReadContracts({
//     contracts: [
//       {
//         address: CHECKIN_ADDRESS,
//         abi: checkInAbi,
//         functionName: "getLastCheckin",
//         args: [address ?? "0x0"],
//       },
//       {
//         address: CHECKIN_ADDRESS,
//         abi: checkInAbi,
//         functionName: "MIN_INTERVAL",
//       },
//       {
//         address: CHECKIN_ADDRESS,
//         abi: checkInAbi,
//         functionName: "totalCheckins",
//       },
//       {
//         address: CHECKIN_ADDRESS,
//         abi: checkInAbi,
//         functionName: "getCheckinCount",
//         args: [address ?? "0x0"],
//       },
//       {
//         address: PREMIUM_CHECKIN_ADDRESS,
//         abi: premiumCheckInAbi,
//         functionName: "getLastPremiumCheckin",
//         args: [address ?? "0x0"],
//       },
//       {
//         address: PREMIUM_CHECKIN_ADDRESS,
//         abi: premiumCheckInAbi,
//         functionName: "premiumPrice",
//       },
//       {
//         address: PREMIUM_CHECKIN_ADDRESS,
//         abi: premiumCheckInAbi,
//         functionName: "totalPremiumCheckins",
//       },
//       {
//         address: PREMIUM_CHECKIN_ADDRESS,
//         abi: premiumCheckInAbi,
//         functionName: "getPremiumCheckinCount",
//         args: [address ?? "0x0"],
//       },
//     ],
//     query: { enabled: isConnected },
//   });

//   const [
//     lastFree,
//     minInterval,
//     globalFreeTotal,
//     userFreeCount,
//     lastPremium,
//     premiumPrice,
//     globalPremiumTotal,
//     userPremiumCount,
//   ] = data?.map((r) => r.result) ?? [];

//   const { isLoading: isConfirming } = useWaitForTransactionReceipt({
//     hash: pendingTx?.hash,
//   });

//   useEffect(() => {
//     if (pendingTx && !isConfirming) {
//       refetch();
//       setPendingTx(null);
//     }
//   }, [isConfirming, pendingTx, refetch]);

//   const now = Math.floor(Date.now() / 1000);
//   const interval = Number(minInterval ?? 0);
//   const secondsUntilFree = lastFree ? Number(lastFree) + interval - now : 0;
//   const secondsUntilPremium = lastPremium
//     ? Number(lastPremium) + interval - now
//     : 0;
//   const canCheckIn = isConnected && secondsUntilFree <= 0;
//   const canPremiumCheckIn = isConnected && secondsUntilPremium <= 0;
//   const busy = isWriting || isConfirming;

//   const handleError = (err: unknown, fallback: string) => {
//     const msg =
//       (err as { shortMessage?: string; message?: string })?.shortMessage ??
//       (err as Error)?.message ??
//       fallback;
//     if (/TooSoon/.test(msg))
//       setError("Already checked in today for this type. Try again later.");
//     else if (/InsufficientPayment/.test(msg))
//       setError("Not enough ETH to cover the premium price.");
//     else setError(msg);
//   };

//   const doCheckIn = async () => {
//     setError(null);
//     try {
//       const hash = await writeContractAsync({
//         address: CHECKIN_ADDRESS,
//         abi: checkInAbi,
//         functionName: "checkIn",
//       });
//       setPendingTx({ hash, kind: "free" });
//     } catch (err) {
//       handleError(err, "Transaction failed");
//     }
//   };

//   const doPremiumCheckIn = async () => {
//     setError(null);
//     try {
//       const hash = await writeContractAsync({
//         address: PREMIUM_CHECKIN_ADDRESS,
//         abi: premiumCheckInAbi,
//         functionName: "premiumCheckIn",
//         value: premiumPrice ?? 0n,
//       });
//       setPendingTx({ hash, kind: "premium" });
//     } catch (err) {
//       handleError(err, "Premium transaction failed");
//     }
//   };

//   return (
//     <div className="w-full max-w-md flex flex-col gap-6">
//       {/* Action buttons */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <button
//           onClick={doCheckIn}
//           disabled={!canCheckIn || busy}
//           className="flex-1 rounded-lg bg-ink text-lime font-semibold py-3 px-4 text-sm
//                      disabled:opacity-40 disabled:cursor-not-allowed
//                      hover:opacity-90 transition-opacity"
//         >
//           {busy && pendingTx?.kind === "free"
//             ? "Confirming…"
//             : canCheckIn
//               ? "Check in"
//               : isConnected
//                 ? `Next free check-in in ${Math.ceil(secondsUntilFree / 3600)}h`
//                 : "Connect wallet to check in"}
//         </button>

//         <button
//           onClick={doPremiumCheckIn}
//           disabled={!canPremiumCheckIn || busy}
//           className="flex-1 rounded-lg border-2 border-ink text-ink font-semibold py-3 px-4 text-sm
//                      disabled:opacity-40 disabled:cursor-not-allowed
//                      hover:bg-ink hover:text-lime transition-colors"
//         >
//           {busy && pendingTx?.kind === "premium"
//             ? "Confirming…"
//             : canPremiumCheckIn
//               ? `Premium check-in · ${premiumPrice ? formatEther(premiumPrice) : "…"} ETH`
//               : isConnected
//                 ? `Next premium check-in in ${Math.ceil(secondsUntilPremium / 3600)}h`
//                 : "Connect wallet for premium"}
//         </button>
//       </div>

//       {error && (
//         <p className="text-xs font-mono text-ink/70 bg-ink/5 border border-ink/20 rounded-md px-3 py-2">
//           {error}
//         </p>
//       )}

//       {/* Global stats */}
//       <section className="flex flex-col gap-2">
//         <h2 className="text-xs font-mono uppercase tracking-wider text-ink/50">
//           Global stats
//         </h2>
//         <div className="flex gap-3">
//           <StatCard label="Total free check-ins" value={globalFreeTotal} />
//           <StatCard
//             label="Total premium check-ins"
//             value={globalPremiumTotal}
//           />
//         </div>
//       </section>

//       {/* User stats */}
//       <section className="flex flex-col gap-2">
//         <h2 className="text-xs font-mono uppercase tracking-wider text-ink/50">
//           Your stats
//         </h2>
//         <div className="flex gap-3">
//           <StatCard
//             label="Your free check-ins"
//             value={isConnected ? userFreeCount : undefined}
//           />
//           <StatCard
//             label="Your premium check-ins"
//             value={isConnected ? userPremiumCount : undefined}
//           />
//         </div>
//       </section>
//     </div>
//   );
// };

// function StatCard({
//   label,
//   value,
// }: {
//   label: string;
//   value: bigint | number | undefined;
// }) {
//   return (
//     <div className="flex-1 rounded-lg border border-ink/15 bg-ink/5 px-4 py-3 flex flex-col gap-1">
//       <span className="font-mono text-xl font-semibold text-ink">
//         {value !== undefined ? Number(value) : "—"}
//       </span>
//       <span className="text-[11px] uppercase tracking-wide text-ink/50">
//         {label}
//       </span>
//     </div>
//   );
// }
