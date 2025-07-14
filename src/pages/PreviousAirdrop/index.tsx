/** src/pages/AirdropRewards/index.tsx */
import React, { useEffect } from "react";
import { TopTitle } from "@/shared/components/ui";
import "./PreviousRewards.css";
import { useAirdropEntityStore } from "@/entities/PreviousRewards/model/airdropEntityModel";
import AirdropSection from "@/widgets/PreviousRewards/ui/AirdropSection";

const PreviousAirdrop: React.FC = () => {
  const {
    winners,
    myReward,
    isLoadingAirdrop,
    errorAirdrop,
    hasLoadedAirdrop,
    loadAirdrop,
  } = useAirdropEntityStore();

  // 컴포넌트 마운트 시 에어드랍 데이터 로딩
  useEffect(() => {
    if (!hasLoadedAirdrop) {
      loadAirdrop();
    }
  }, [hasLoadedAirdrop, loadAirdrop]);

  return (
    <div className="flex flex-col mb-44 text-white items-center w-full min-h-screen">
      <TopTitle title={"지난 달 보상"} className="px-6" back={true} />
      <AirdropSection
        winners={winners}
        myReward={myReward}
        isLoadingAirdrop={isLoadingAirdrop}
        errorAirdrop={errorAirdrop}
        onLoadAirdrop={loadAirdrop}
        hasLoadedAirdrop={hasLoadedAirdrop}
      />
    </div>
  );
};

export default PreviousAirdrop;
