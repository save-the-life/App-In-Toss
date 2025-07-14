import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollToTop from "./shared/components/ui/scrollTop";
import AppInitializer from "./app/components/AppInitializer";
import { TourProvider } from "@reactour/tour";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useUserStore } from "@/entities/User/model/userModel";
import parse from 'html-react-parser';
import { SoundProvider } from "./shared/provider/SoundProvider";
import Audios from "./shared/assets/audio";
import "./App.css";

// 페이지 컴포넌트들
import SelectCharacterPage from "./pages/SelectCharacter";
import DiceEvent from "@/pages/DiceEvent";
import MissionPage from "@/pages/MissionPage";
import Reward from "@/pages/RewardPage";
import InviteFriends from "@/pages/InviteFriends";
import InviteFriendsList from "./pages/InviteFriendsList";
import SlotMachine from "@/pages/SlotMachine";
import DiceEventLayout from "./app/layout/DiceEventLayout";
import MyAssets from "./pages/MyAssets";
import RewardHistory from "./pages/RewardHistory";
import PreviousRewards from "@/pages/PreviousRewards";
import SettingsPage from "./pages/SettingsPage";
import PolicyDetailPage from "./pages/PolicyDetail";
import FriendRewards from "./pages/FriendRewards";
import SoundSetting from "./pages/SoundSetting";
// import ItemStore from "./pages/ItemStore";

import PreviousRanking from "./pages/PreviousRanking";
import PreviousRaffle from "./pages/PreviousRaffle";
import PreviousAirdrop from "./pages/PreviousAirdrop";
import EditNickname from "./pages/EditNickname";

const App:React.FC = () =>{
  const [isInitialized, setIsInitialized] = useState(false);
  const {completeTutorialFunc} = useUserStore();
  const disableBody = (target:any) => disableBodyScroll(target);
  const enableBody = (target:any) => enableBodyScroll(target);

  // 튜토리얼
  const steps = [
    {
      selector: "#first-step",
      content: (
        <div className="text-sm">
          <strong>Roll Dice Button:</strong> 
          Rolling the dice moves your cuddly companion around the Monopoly board. 
          The tile it lands on determines your rewards or triggers special in-game events.
        </div>
      ),
      stepInteraction: false,
    },
    {
      selector: "#second-step",
      content: (
        <div className="text-sm">
          <strong>Dice Gauge:</strong> Press and hold the button to move the gauge, which has six sections (1–6). Release the button when the gauge reaches your desired number.<div style={{ marginBottom: "1rem" }}></div>
          If the gauge lands on the number you want, you have a <strong>50% chance</strong> to trigger the <strong>Lucky Dice effect</strong>, causing your pet to move to that number on the board
        </div>
      ),
      stepInteraction: false,
    },
    {
      selector: "#third-step",
      content: (
        <div className="text-sm">
          <strong>Dice Refill:</strong> Once all dice are used, the text changes to <em>'Refill Dice.'</em> Click it to refill your dice.<div style={{ marginBottom: "1rem" }}></div>
          After refilling, you can receive additional dice again after <strong>an hour</strong>.<div style={{ marginBottom: "1rem" }}></div>
          When the refill time is over, the text changes to <em>'Waiting.'</em> If you have no dice left, it reverts to <em>'Refill Dice.'</em>
        </div>
      ),
      stepInteraction: false,
    },
    {
      selector: "#fourth-step",
      content: (
        <div className="text-sm">
          <strong>NFT Dashboard:</strong> Shows the <strong>number of NFTs</strong> you own.<div style={{ marginBottom: "1rem" }}></div>
          Click to explore the <strong>effects</strong> of your NFTs.
        </div>
      ),
      stepInteraction: false,
    },
    {
      selector: "#fifth-step",
      content: (
        <div className="text-sm">
          <strong>Auto Function:</strong> If you own an <strong>Auto Item</strong>, the dice will roll automatically.<div style={{ marginBottom: "1rem" }}></div>
          When the refill time arrives, the dice will also be refilled and rolled automatically.<div style={{ marginBottom: "1rem" }}></div>
          This function only works while you are on the <strong>Game section</strong> and does not apply to actions on <em>Rock-Paper-Scissors</em>, <em>Spin</em>, or <em>Anywhere tiles</em>.
        </div>
      ),
      stepInteraction: false,
    },
  ];


  useEffect(() => {
    const preventContextMenu = (e: { preventDefault: () => void }) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <TourProvider
          steps={steps}
          afterOpen={disableBody} 
          beforeClose={enableBody}
          onClickMask={async ({ setCurrentStep, currentStep, steps, setIsOpen }) => {
              if (steps) {
                  if (currentStep === steps.length - 1) {
                      await completeTutorialFunc();
                      setIsOpen(false);

                  }
                  setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1));
              }
          } }

          onClickClose={async ({ setIsOpen }) => {
              await completeTutorialFunc();
              setIsOpen(false);
          } }

          styles={{
              popover: (base) => ({
                  ...base,
                  "--reactour-accent": "#0147E5",
                  borderRadius: 10,
              }),
              maskArea: (base) => ({ ...base, rx: 10, margin: 30 }),
              // maskWrapper: (base) => ({ ...base, color: "#0147E5" }),
              badge: (base) => ({ ...base, left: "auto", right: "-0.8125em" }),
              // controls: (base) => ({ ...base, marginTop: 100 }),
              close: (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
          }} >
          {!isInitialized && (
              // 앱 초기화 진행 컴포넌트 사용
              <AppInitializer onInitialized={() => setIsInitialized(true)} />
          )}
          {isInitialized && (
            <SoundProvider bgmSrc={Audios.bgm}>
              <Routes>
                  {/* DiceEventLayout Pages */}
                  <Route path="/" element={<Navigate to="/" />} />
                  <Route path="/dice-event" element={<DiceEventLayout><DiceEvent /></DiceEventLayout>} />
                  <Route path="/mission" element={<DiceEventLayout><MissionPage /></DiceEventLayout>} />
                  <Route path="/reward" element={<DiceEventLayout><Reward /></DiceEventLayout>} />
                  <Route path="/invite-friends" element={<DiceEventLayout><InviteFriends /></DiceEventLayout>} />
                  <Route path="/my-assets" element={<DiceEventLayout><MyAssets /></DiceEventLayout>} />
                  <Route path="/test" element={<DiceEventLayout><SlotMachine /></DiceEventLayout>} />
                  <Route path="/previous-rewards" element={<DiceEventLayout><PreviousRewards /></DiceEventLayout>} />


                  {/* Hidden Pages */}
                  <Route path="/choose-character" element={<DiceEventLayout hidden={true}><SelectCharacterPage /></DiceEventLayout>} />
                  <Route path="/reward-history" element={<DiceEventLayout hidden={true}><RewardHistory /></DiceEventLayout>} />
                  <Route path="/settings" element={<DiceEventLayout hidden={true}><SettingsPage /></DiceEventLayout>} />
                  <Route path="/policy-detail" element={<DiceEventLayout hidden={true}><PolicyDetailPage /></DiceEventLayout>} />
                  <Route path="/referral-rewards" element={<DiceEventLayout hidden={true}><FriendRewards /></DiceEventLayout>} />
                  <Route path="/invite-friends-list" element={<DiceEventLayout hidden={true}><InviteFriendsList /></DiceEventLayout>} />
                  <Route path="/sound-setting" element={<DiceEventLayout hidden={true}><SoundSetting /></DiceEventLayout>} />
                  {/* <Route path="/item-store" element={<DiceEventLayout hidden={true}><ItemStore /></DiceEventLayout>} /> */}
                  <Route path="/previous-ranking" element={<DiceEventLayout hidden={true}><PreviousRanking /></DiceEventLayout>} />
                  <Route path="/previous-raffle" element={<DiceEventLayout hidden={true}><PreviousRaffle /></DiceEventLayout>} />
                  <Route path="/previous-airdrop" element={<DiceEventLayout hidden={true}><PreviousAirdrop /></DiceEventLayout>} />
                  <Route path="/edit-nickname" element={<DiceEventLayout hidden={true}><EditNickname /></DiceEventLayout>} />
              </Routes>
            </SoundProvider>
          )}
      </TourProvider>
    </>
  );
}

export default App;
