// src/pages/DiceEventPage.tsx
import React, { useEffect, useState, useRef } from "react";
import UserLevel from "@/entities/User/components/UserLevel";
import "@/features/DiceEvent/DiceEvent.css";
import Images from "@/shared/assets/images";
import { MonthlyPrize } from "@/entities/MonthlyPrize";
// import Attendance from "@/widgets/Attendance";
import MyRankingWidget from "@/widgets/MyRanking/MyRankingWidget";
import MissionWidget from "@/widgets/MissionWidget/MissionWidget";
import { useNavigate } from "react-router-dom";
import useDiceGame from "./useDiceGame";
import GameBoard from "./GameBoard";
import { Board } from "@/features/DiceEvent";
import RPSGame from "../RPSGame";
import SpinGame from "../SpinGame";
import { useUserStore } from "@/entities/User/model/userModel";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogTrigger } from "@/shared/components/ui";
import { formatNumber } from "@/shared/utils/formatNumber";
import LevelRewards from "@/widgets/LevelRewards";
import LeaderBoard from "@/widgets/LeaderBoard";
import { HiX } from "react-icons/hi";
import { DialogClose } from "@radix-ui/react-dialog";
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import getRewardPoints from "@/entities/Mission/api/fromRewardPoint";
import updateTimeZone from "@/entities/User/api/updateTimeZone";
import { InlineRanking } from "@/widgets/MyRanking/InlineRanking";
import { ModalRanking } from "@/widgets/MyRanking/ModalRanking";


const levelRewards = [
  // 2~9 레벨 보상 예시
  { level: 2, dice: 10, points: 1000 },
  { level: 3, dice: 15, points: 2000 },
  { level: 4, dice: 20, points: 3000 },
  { level: 5, dice: 30, points: 5000, tickets: 3 },
  { level: 6, dice: 40, points: 7000, tickets: 3 },
  { level: 7, dice: 50, points: 10000, tickets: 3 },
  { level: 8, dice: 60, points: 15000, tickets: 4 },
  { level: 9, dice: 70, points: 20000, tickets: 5 },

  // 10~14 레벨 보상 예시
  { level: 10, dice: 100, points: 30000, tickets: 7 },
  { level: 11, dice: 100, points: 30000, tickets: 7 },
  { level: 12, dice: 100, points: 30000, tickets: 7 },
  { level: 13, dice: 100, points: 30000, tickets: 7 },
  { level: 14, dice: 100, points: 30000, tickets: 7 },

  // 15~19 레벨 보상 예시
  { level: 15, dice: 200, points: 50000, tickets: 15 },
  { level: 16, dice: 200, points: 50000, tickets: 15 },
  { level: 17, dice: 200, points: 50000, tickets: 15 },
  { level: 18, dice: 200, points: 50000, tickets: 15 },
  { level: 19, dice: 200, points: 50000, tickets: 15 },

  // 20 레벨 보상 예시
  { level: 20, dice: 500, points: 100000, tickets: 100 },
];

const DiceEventPage: React.FC = () => {
  const {
    fetchUserData,
    isLoading,
    error,
    userLv,
    characterType,
    position,
    monthlyPrize,
    isAuto,
    pet,
    suspend,
    setSuspend,
    redirect,
    items,
  } = useUserStore();

  const game = useDiceGame();
  const { playSfx } = useSound();
  const [initialX, setInitialX] = useState<number>(140);
  const [initialY, setInitialY] = useState<number>(474);
  const [delta, setDelta] = useState<number>(56);
  const navigate = useNavigate();


  // AirDrop 팝업 표시를 위한 상태
  const [showAirDrop, setShowAirDrop] = useState<boolean>(false);

  // URL 보상 팝업 표시를 위한 상태
  const [showUrlReward, setShowUrlReward] = useState<boolean>(false);
  
  // 레벨 업 시 팝업 표시를 위한 상태
  const [showLevelUpDialog, setShowLevelUpDialog] = useState<boolean>(false);
  const [prevLevel, setPrevLevel] = useState<number>(userLv);

  // 레벨 업 감지: userLv가 이전 레벨보다 커질 때만 팝업 표시
  useEffect(() => {
    if (userLv > prevLevel) {
      playSfx(Audios.level_up);
      setShowLevelUpDialog(true);
    }
    setPrevLevel(userLv);
  }, [userLv, prevLevel]);


  // 보상 링크를 통한 접근 여부 확인 및 보상 API 호출
  useEffect(() => {
    const referralCode = localStorage.getItem("referralCode");
    if (referralCode === "from-dapp-portal") {
      // console.log("[DiceEventPage] Dapp Portal referral detected. Calling reward API...");
      getRewardPoints()
        .then((message) => {
          // console.log("[DiceEventPage] Reward API response:", message);
          // 응답 메시지가 "Success"인 경우에만 다이얼로그 표시
          if (message === "Success") {
            setShowUrlReward(true);
          } else if (message === "Already Rewarded") {
            // console.log("[DiceEventPage] Reward already claimed.");
          }
          // 중복 호출 방지를 위해 referralCode 삭제
          localStorage.removeItem("referralCode");
        })
        .catch((error) => {
          // console.error("[DiceEventPage] Reward API error:", error);
        });
    }
  }, []);

  // 소유한 아이템 갯수에 따른 목록 표시 함수
  const getItemLabel = (label: string, count: number) => {
    if (count === 0) {
      return <span className="text-[#737373]">{label}</span>;
    } else if (count === 1) {
      return <span className="text-white">{label}</span>;
    } else {
      return <span className="text-white">{label} x{count}</span>;
    }
  };

  // 아이템 목록에 적용
  const itemList = [
    {
      label: "GOLD PASS",
      icon: Images.GoldIcon,
      count: items.goldCount,
      gradient: "linear-gradient(180deg, #FDE047 0%, #FFFFFF 100%)",
    },
    {
      label: "SILVER PASS",
      icon: Images.SilverIcon,
      count: items.silverCount,
      gradient: "linear-gradient(180deg, #22C55E 0%, #FFFFFF 100%)",
    },
    {
      label: "BRONZE PASS",
      icon: Images.BronzeIcon,
      count: items.bronzeCount,
      gradient: "linear-gradient(180deg, #F59E0B 0%, #FFFFFF 100%)",
    },
    {
      label: "AUTO ITEM",
      icon: Images.AutoIcon,
      count: items.autoNftCount,
      gradient: "linear-gradient(180deg, #0147E5 0%, #FFFFFF 100%)",
    },
    {
      label: "REWARD BOOSTER",
      icon: Images.RewardIcon,
      count: items.rewardNftCount,
      gradient: "linear-gradient(180deg, #FF4F4F 0%, #FFFFFF 100%)",
    },
  ];


  // 현재 레벨 보상 찾기
  const currentReward = levelRewards.find((r) => r.level === userLv);

  const getCharacterImageSrc = () => {
    const index = Math.floor((userLv - 1) / 2);

    const catImages = [
      Images.CatLv1to2,
      Images.CatLv3to4,
      Images.CatLv5to6,
      Images.CatLv7to8,
      Images.CatLv9to10,
      Images.CatLv11to12,
      Images.CatLv13to14,
      Images.CatLv15to16,
      Images.CatLv17to18,
      Images.CatLv19to20,
    ];

    const dogImages = [
      Images.DogLv1to2,
      Images.DogLv3to4,
      Images.DogLv5to6,
      Images.DogLv7to8,
      Images.DogLv9to10,
      Images.DogLv11to12,
      Images.DogLv13to14,
      Images.DogLv15to16,
      Images.DogLv17to18,
      Images.DogLv19to20,
    ];

    if (characterType === "cat") {
      return catImages[index] || catImages[catImages.length - 1];
    } else {
      return dogImages[index] || dogImages[dogImages.length - 1];
    }
  };

  const getLevelEffectImageSrc = () => {
    const level = Math.min(userLv, 20);
    const effectImageKey = `LevelEffect${level}` as keyof typeof Images;
    return Images[effectImageKey] || Images.LevelEffect1;
  };

  const charactorImageSrc = getCharacterImageSrc();

  useEffect(() => {
    return () => {
      game.setIsAuto(false);
    };
  }, []);

  // SDK 초기화와 사용자 데이터 불러오기 및 타임존 업데이트를 하나의 useEffect로 통합
  useEffect(() => {
    async function initializeSdkAndUserData() {
     
      // 사용자 데이터를 불러오고 타임존 업데이트 진행
      await fetchUserData();
      const userTimeZone = useUserStore.getState().timeZone;
      console.log("서버로부터 받은 타임존: ", userTimeZone);
      const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log("사용자의 타임존: ", currentTimeZone);
      if (userTimeZone === null || userTimeZone !== currentTimeZone) {
        try {
          await updateTimeZone(currentTimeZone);
        } catch (error: any) {
          console.log("timezone error", error);
        }
      }
    }
    initializeSdkAndUserData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setInitialX(250);
        setInitialY(730);
        setDelta(100);
      } else {
        setInitialX(140);
        setInitialY(474);
        setDelta(56);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  

  // ===============================
  //  모달 스케줄링 로직
  // ===============================
  const scheduledSlots = [20];
  const itemGuideSlots = [0, 9, 18]; 

  const [abuseModal , setabuseModal ] = useState<boolean>(false);
  // 랭킹 보상 팝업 표시를 위한 상태
  const [showRankingModal, setShowRankingModal] = useState<boolean>(false);
  const [showItemGuideModal, setShowItemGuideModal] = useState(false);

  useEffect(() => {
    const checkAndShowModals = () => {
      const now = new Date();
      const hour = now.getHours();
      const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

      // ——————————————
      // 1) abuseModal + 래플권 모달
      // ——————————————
      let currentAbuseSlot: number | null = null;
      for (let slot of scheduledSlots) {
        if (hour >= slot) currentAbuseSlot = slot;
      }
      if (currentAbuseSlot !== null) {
        const slotId = `${dateKey}-${currentAbuseSlot}`;
        const lastShown = localStorage.getItem("abuseModalLastShown");
        const dismissed = localStorage.getItem("abuseModalDismissed");
        if (lastShown !== slotId && dismissed !== slotId) {
          setabuseModal(true);
          setShowRankingModal(true);
        }
      }

      // ——————————————
      // 2) 아이템 가이드 모달
      // ——————————————
      const currentItemSlot = itemGuideSlots.filter(slot => hour >= slot).pop();
      if (currentItemSlot != null) {
        const key = `${dateKey}-${currentItemSlot}-itemGuide`;
        if (!localStorage.getItem(key)) {
          setShowItemGuideModal(true);
        }
      }
    };


    // 최초 5초간 2초마다
    const fastInterval = window.setInterval(checkAndShowModals, 2000);

    // 5초 후 1시간 간격으로 전환
    let slowInterval: number;
    const switchTimeout = window.setTimeout(() => {
      clearInterval(fastInterval);
      slowInterval = window.setInterval(checkAndShowModals, 3600_000);
    }, 5000);

    return () => {
      clearInterval(fastInterval);
      clearTimeout(switchTimeout);
      if (slowInterval) clearInterval(slowInterval);
    };
  }, []);

  // 모달 닫을 때 현재 슬롯 정보를 기록하는 함수
  const handleCloseItemGuideModal = () => {
    const now = new Date();
    const hour = now.getHours();
    const dateKey = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
    const slot = itemGuideSlots.filter(s => hour >= s).pop();
    if (slot != null) {
      localStorage.setItem(`${dateKey}-${slot}-itemGuide`, "shown");
    }
    setShowItemGuideModal(false);
  };
  
  const handleCloseRankingModal = () => {
    const now = new Date();
    let currentSlot: number | null = null;
    for (let slot of scheduledSlots) {
      if (now.getHours() >= slot) {
        currentSlot = slot;
      }
    }
    if (currentSlot !== null) {
      const slotId = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${currentSlot}`;
      localStorage.setItem("abuseModalLastShown", slotId);
      localStorage.setItem("abuseModalDismissed", slotId);
    }
    setShowRankingModal(false);
  };
  // ===============================

  if (isLoading) {
    return <LoadingSpinner className="h-screen"/>;
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  const handleRPSGameEnd = (result: "win" | "lose", winnings: number) => {
    // console.log(`RPS Game Ended: ${result}, Winnings: ${winnings}`);
    fetchUserData();
    game.handleRPSGameEnd(result, winnings);
  };

  return (
    <div className="flex flex-col items-center relative w-full h-full overflow-x-hidden min-h-screen">
      {game.isRPSGameActive ? (
        <RPSGame
          onGameEnd={handleRPSGameEnd}
          onCancel={() => handleRPSGameEnd("lose", 0)}
        />
      ) : game.isSpinGameActive ? (
        <SpinGame onSpinEnd={game.handleSpinGameEnd} />
      ) : (
        <>
          <div className="w-full flex justify-center mb-4 mt-8 gap-4">
            {/* 이번 달 보상 내용 */}
            <MonthlyPrize
              month={monthlyPrize.month}
              prizeType={monthlyPrize.prizeType}
              amount={monthlyPrize.amount}
              eventFinishTime={monthlyPrize.eventFinishTime}
            />
                
            {/* 아이템 구매 페이지 이동 */}
            <div
              className="relative flex flex-col items-center justify-center rounded-3xl w-32 h-36 md:w-[240px] md:h-44"
              style={{
                background: "linear-gradient(180deg, #19203C 70%, #304689 100%)"
              }}
              onClick={() => navigate("/item-store")}
            >
              <img
                src={Images.Rocket}
                className="w-20 h-20 md:w-32 md:h-32 z-20"
                alt="itme store"
                />
                <div className="flex flex-row items-center justify-center w-full px-4 gap-2 mt-2">
                  <p className="font-semibold text-center text-sm md:text-sm text-white">
                    랭킹 부스터 상점
                  </p>
                </div>
            </div>
          </div>
              
          <GameBoard
            position={position}
            selectingTile={game.selectingTile}
            handleTileClick={game.handleTileClick}
            gaugeValue={game.gaugeValue}
            diceCount={game.diceCount}
            showDiceValue={game.showDiceValue}
            rolledValue={game.rolledValue}
            buttonDisabled={game.buttonDisabled}
            diceRef={game.diceRef}
            handleRollComplete={game.handleRollComplete}
            reward={game.reward}
            isHolding={game.isHolding}
            handleMouseDown={game.handleMouseDown}
            handleMouseUp={game.handleMouseUp}
            isLuckyVisible={game.isLuckyVisible}
            rollDice={game.rollDice}
              />
          {/* anywhere 시 표시되는 비행기 */}
          {game.selectingTile && !isAuto && (
            <div className="absolute md:top-0 top-0 left-0 w-full h-full flex justify-center items-center z-20">
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-75"></div>
              <div className="text-white text-lg z-30 flex flex-col items-center justify-center mb-[200px] md:mb-[220px] font-semibold md:text-xl">
                <img
                  src={Images.Airplane}
                  alt="airplane"
                  className="h-20 md:h-28"
                />
                이동할 칸을 선택하세요
              </div>
            </div>
          )}
          <Board
            position={position}
            charactorImageSrc={charactorImageSrc}
            initialX={initialX}
            initialY={initialY}
            delta={delta}
          />
          <br />
              
          {/* my-rank 위젯 표시 */}
          <Dialog>
            <DialogTrigger className="w-full flex justify-center" onClick={() => playSfx(Audios.button_click)}>
              <InlineRanking />
            </DialogTrigger>
            <DialogContent className=" flex flex-col bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold  overflow-y-auto  max-h-[80%]">
              <DialogHeader className="flex w-full items-end">
                <DialogClose>
                <HiX className="w-5 h-5" />
                </DialogClose>
              </DialogHeader>
              <ModalRanking />
              <LeaderBoard />
            </DialogContent>
          </Dialog>
              

          <div className="w-full flex justify-center mb-4 mt-5 gap-4">
            {/* 현재 캐릭터 레벨 및 클릭 시 레벨 별 보상 다이얼로그 표시 */}
            <Dialog>
              <DialogTrigger onClick={() => playSfx(Audios.button_click)}>
                <UserLevel
                  userLv={userLv}
                  charactorImageSrc={charactorImageSrc}
                  exp={pet.exp}
                />
              </DialogTrigger>
              <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold  overflow-y-auto max-w-[90%] md:max-w-lg max-h-[80%]">
                <LevelRewards />
              </DialogContent>
            </Dialog>

            {/* 현재 보유한 아이템 목록 표시 */}
            <div
                className="flex flex-col gap-1 w-48 h-36 md:w-[340px] md:h-44"
                onClick={()=>navigate("/item-store")}>
              {itemList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center rounded-xl"
                >
                  <div
                    className="w-6 md:w-8 h-6 md:h-8 rounded-lg flex items-center justify-center"
                    style={{ background: item.gradient }}
                  >
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-[18px] h-auto object-contain" 
                    />
                  </div>
                  <span className="ml-1 font-medium text-xs md:text-sm">
                    {getItemLabel(item.label, item.count)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* <Attendance customWidth="w-[332px] md:w-[595.95px]"  />
          <MissionWidget /> */}

          {/* 레벨업 시 다이얼로그: 이전보다 레벨이 올라갔을 때만 표시 */}
          <Dialog open={showLevelUpDialog}>
            <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold overflow-y-auto max-w-[90%] md:max-w-lg max-h-[80%]">
              <div className="flex flex-col items-center justify-around">
                <div className=" flex flex-col items-center gap-2">
                  <h1 className=" font-jalnan text-5xl text-[#FDE047]">
                    레벨 업
                  </h1>
                  <img
                    src={getLevelEffectImageSrc()}
                    alt="levelupEffect"
                    className=" w-36 h-36"
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <p className="font-jalnan text-center">보상을 받아가세요!</p>
                  {currentReward && (
                    <div className="flex flex-row items-center gap-2">
                      <div className="box-bg rounded-xl w-16 h-16 border-2 border-[#2660f4] flex flex-col items-center gap-2 justify-center ">
                        <img src={Images.Dice} alt="dice" className="w-6 h-6" />
                        <p className=" font-semibold text-xs">
                          +{currentReward.dice}
                        </p>
                      </div>
                      <div className="box-bg rounded-xl w-16 h-16 border-2 border-[#2660f4] flex flex-col items-center gap-2 justify-center ">
                        <img src={Images.Star} alt="star" className="w-6 h-6" />
                        <p className=" font-semibold text-xs">
                          +{formatNumber(currentReward.points)}
                        </p>
                      </div>
                      {currentReward.tickets && (
                        <div className="box-bg rounded-xl w-16 h-16 border-2 border-[#2660f4] flex flex-col items-center gap-2 justify-center ">
                          <img
                            src={Images.LotteryTicket}
                            alt="rapple"
                            className="w-6 h-6"
                          />
                          <p className=" font-semibold text-xs">
                            +{currentReward.tickets}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowLevelUpDialog(false)}
                  className="bg-[#0147E5] font-medium rounded-full w-40 h-14"
                >
                  계속하기
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* AirDrop 다이얼로그 */}
          {/* <Dialog open={showAirDrop}>
            <DialogTitle></DialogTitle>
            <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold overflow-y-auto max-w-[90%] md:max-w-lg max-h-[80%]">
              <div className="relative">
                <DialogClose className="absolute top-0 right-0 p-2">
                  <HiX 
                    className="w-5 h-5"
                    onClick={() => {
                      playSfx(Audios.button_click);
                      setShowRankingModal(false);
                    }} 
                  />
                </DialogClose>
              </div>
              <div className="flex flex-col items-center justify-around">
                <div className=" flex flex-col items-center gap-2">
                  <h1 className=" font-jalnan text-4xl text-[#DD2726] text-center">
                    {t("dice_event.lucyk_airdrop")}
                  </h1>
                  <img
                    src={Images.airDropBoxes}
                    alt="airdrop boxes"
                    className="mt-2 w-60 h-60"
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <p className="font-Pretendard text-center text-base font-semibold">{t("dice_event.lucky_winner")}</p>
                </div>
                <button
                  onClick={() => setShowRankingModal(false)}
                  className="bg-[#0147E5] text-base font-medium rounded-full w-40 h-14 mt-8 mb-7"
                >
                  {t("dice_event.check")}
                </button>
              </div>
            </DialogContent>
          </Dialog> */}

          {/* 사용 중지 다이얼로그 */}
          <Dialog open={suspend}>
            <DialogTitle></DialogTitle>
            <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold overflow-y-auto max-w-[90%] md:max-w-lg max-h-[80%]">
              <div className="relative">
                <DialogClose className="absolute top-0 right-0 p-2">
                  <HiX 
                    className="w-5 h-5"
                    onClick={() => {
                      playSfx(Audios.button_click);
                      setSuspend(false);
                    }} 
                  />
                </DialogClose>
              </div>
              <div className="flex flex-col items-center justify-around">
                <div className=" flex flex-col items-center gap-2">
                  <h1 className=" font-bold text-xl  text-center">
                    계정 정지됨
                  </h1>
                </div>
                <div className="flex flex-col mt-5">
                  <p className="font-Pretendard text-center text-base font-semibold">
                    귀하의 계정은 공정한 게임 이용 정책 위반으로 현재 정지 상태입니다.<br/>
                    이 조치가 실수라고 생각되시면, 지원팀에 문의해 주세요.
                  </p>
                </div>
                
                <div className="flex flex-col mt-2">
                  <p className="font-Pretendard text-center text-sm font-semibold text-[#DD2726]">
                    사유: 게임의 부적절한 사용 또는 불공정한 플레이가 감지되었습니다.
                  </p>
                </div>

                
                <div className="flex flex-col mt-2">
                  <p className="font-Pretendard text-center text-sm font-normal text-[#A3A3A3]">
                    만약 이 조치가 오류라고 생각된다면,<br/>
                    지원팀에 문의해 주세요.
                  </p>
                </div>
                <button
                  onClick={() => setSuspend(false)}
                  className="bg-[#0147E5] text-base font-medium rounded-full w-40 h-14 mt-8 mb-7"
                >
                  닫기
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* dapp-portal URL 보상 다이얼로그 */}
          <Dialog open={showUrlReward}>
            <DialogTitle></DialogTitle>
            <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold overflow-y-auto max-w-[90%] md:max-w-lg max-h-[40%]">
              <div className="relative">
                <DialogClose className="absolute top-0 right-0 p-2">
                  <HiX 
                    className="w-5 h-5"
                    onClick={() => {
                      playSfx(Audios.button_click);
                      setShowUrlReward(false);
                    }} 
                  />
                </DialogClose>
              </div>
              <div className="flex flex-col items-center justify-around">
                <div className=" flex flex-col items-center gap-2">
                  <h1 className=" font-Pretendard text-base font-semibold text-white text-center">
                    포인트 보상을 받으세요.
                  </h1>
                  <img
                    src={Images.urlReward}
                    alt="airdrop boxes"
                    className="mt-2 w-16 h-16"
                  />
                </div>
                <button
                  onClick={() => {
                    playSfx(Audios.button_click);
                    setShowUrlReward(false);
                  }}
                  className="bg-[#0147E5] text-base font-medium rounded-full w-40 h-14 mt-8 mb-7"
                >
                  지금 받기
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 어뷰징 관련 안내 다이얼로그 */}
          {/* <Dialog open={abuseModal}>
            <DialogTitle></DialogTitle>
            <DialogContent className="bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold overflow-y-auto max-w-[90%] md:max-w-lg max-h-[80%]">
              <div className="relative">
                <DialogClose className="absolute top-0 right-0 p-2">
                  <HiX
                    className="w-5 h-5"
                    onClick={() => {
                      playSfx(Audios.button_click);
                      handleCloseAbuseModal();
                    }}
                  />
                </DialogClose>
              </div>
              <div className="flex flex-col items-center justify-around">
                <p className="text-xl font-bold text-white text-center">{t("dice_event.dear_user")},</p>
                <img
                  src={Images.NoticeCaution}
                  className="w-[90px] h-[90px] mt-4 object-cover"
                />
                <p className="text-base font-extrabold text-white text-center">【{t("dice_event.abuse_notice")}】</p>
                <p className="text-base font-medium text-white text-center">
                  {t("dice_event.identify_user")} ⚠
                </p>
                <a
                  href="https://shorturl.at/qk59Z" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline text-[#3B82F6] mt-1 text-base font-semibold"
                >
                  https://shorturl.at/qk59Z
                </a>

                <img
                  src={Images.NoticeBox}
                  className="w-[100px] h-[100px] mt-5 object-cover"
                />
                <p className="text-base font-extrabold text-white text-center">【{t("dice_event.bonanza")}】</p>
                <p className="text-base font-medium text-white text-center">
                  {t("dice_event.event_end")}<br/>
                  {t("dice_event.tune")} 🎁 
                </p>
                <a
                  href="https://shorturl.at/B5kDX" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline text-[#3B82F6] mt-1 text-base font-semibold"
                >
                  https://shorturl.at/B5kDX
                </a>
                <button onClick={handleCloseAbuseModal} className="bg-[#0147E5] text-base font-medium rounded-full w-40 h-14 mt-5 mb-7">
                  {t("agree_page.close")}
                </button>
              </div>
            </DialogContent>
          </Dialog> */}

          {/* 출석 체크 알림 다이얼로그 */}
          {/* <Dialog open={redirect}>
            <DialogTitle></DialogTitle>
            <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white h-svh overflow-x-hidden font-semibold overflow-y-auto max-w-[90%] md:max-w-lg max-h-[30%]">
              <div className="relative">
                <DialogClose className="absolute top-0 right-0 p-2">
                  <HiX 
                    className="w-5 h-5"
                    onClick={() => {
                      playSfx(Audios.button_click);
                      navigate("/mission")
                    }} 
                  />
                </DialogClose>
              </div>
              <div className="flex flex-col items-center justify-around">
                <div className="flex flex-col mt-5">
                  <p className="font-Pretendard text-center text-base font-semibold">
                    {t("dice_event.check_daily")}<br/>
                    {t("dice_event.tap")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    playSfx(Audios.button_click);
                    navigate("/mission")
                  }}
                  className="bg-[#0147E5] text-base font-medium rounded-full w-40 h-14 mt-8 mb-7"
                >
                  {t("agree_page.close")}
                </button>
              </div>
            </DialogContent>
          </Dialog> */}

          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="hidden md:block md:mb-40"> &nbsp;</div>
        </>
      )}
    </div>
  );
};

export default DiceEventPage;
