import { HomeCheckIns } from "./check-ins";
import { HomeGlobalStats } from "./global-stats";
import { HomeUserStats } from "./user-stats";

export const Home = () => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
      <HomeGlobalStats totalFree={128} totalPremium={34} />
      <div className="w-full flex flex-col items-center gap-6">
        <HomeCheckIns
          onCheckIn={() => console.log("check in")}
          onPremiumCheckIn={() => console.log("premium check in")}
          isCheckInDisabled={false}
          isPremiumDisabled={false}
          isCheckInLoading={false}
          isPremiumLoading={false}
          checkInLabel="Tap to GM"
          premiumLabel="Premium GM"
        />
        <HomeUserStats freeCount={5} premiumCount={2} />
      </div>
    </div>
  );
};
