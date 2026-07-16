import { HomeCheckIns } from "@/app/home//check-ins";
import { HomeGlobalStats } from "@/app/home/global-stats";
import { HomeUserStats } from "@/app/home//user-stats";
import { useCheckInStore } from "@/store/check-in-store";

export const Home = () => {
  const {
    totalFree,
    totalPremium,
    userFreeCount,
    userPremiumCount,
    onCheckIn,
    onPremiumCheckIn,
    isCheckInDisabled,
    isPremiumDisabled,
    isCheckInLoading,
    isPremiumLoading,
    checkInLabel,
    premiumLabel,
  } = useCheckInStore();
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <HomeGlobalStats
        totalFree={totalFree || 0}
        totalPremium={totalPremium || 0}
      />
      <div className="w-full flex flex-col items-center gap-6">
        <HomeCheckIns
          onCheckIn={onCheckIn}
          onPremiumCheckIn={onPremiumCheckIn}
          isCheckInDisabled={isCheckInDisabled}
          isPremiumDisabled={isPremiumDisabled}
          isCheckInLoading={isCheckInLoading}
          isPremiumLoading={isPremiumLoading}
          checkInLabel={checkInLabel}
          premiumLabel={premiumLabel}
        />
        <HomeUserStats
          freeCount={userFreeCount || 0}
          premiumCount={userPremiumCount || 0}
        />
      </div>
    </div>
  );
};
