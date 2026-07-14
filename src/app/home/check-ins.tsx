import { StandartButton } from "../../shared/standard-button";

interface HomeCheckInsProps {
  onCheckIn: () => void;
  onPremiumCheckIn: () => void;
  isCheckInDisabled: boolean;
  isPremiumDisabled: boolean;
  isCheckInLoading: boolean;
  isPremiumLoading: boolean;
  checkInLabel: string;
  premiumLabel: string;
}

export const HomeCheckIns = ({
  onCheckIn,
  onPremiumCheckIn,
  isCheckInDisabled,
  isPremiumDisabled,
  isCheckInLoading,
  isPremiumLoading,
  checkInLabel,
  premiumLabel,
}: HomeCheckInsProps) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <StandartButton
        variant="primary"
        className="w-full"
        onClick={onCheckIn}
        disabled={isCheckInDisabled}
        isLoading={isCheckInLoading}
      >
        {checkInLabel}
      </StandartButton>

      <StandartButton
        variant="special"
        className="w-full"
        onClick={onPremiumCheckIn}
        disabled={isPremiumDisabled}
        isLoading={isPremiumLoading}
      >
        {premiumLabel}
      </StandartButton>
    </div>
  );
};
