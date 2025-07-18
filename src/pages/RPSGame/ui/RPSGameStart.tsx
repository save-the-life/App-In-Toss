// src/pages/RPSGame/ui/RPSGameStart.tsx

import React, { useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui";
import Images from "@/shared/assets/images";
import { formatNumber } from "@/shared/utils/formatNumber";
import { useRPSGameStore } from "../store";

interface RPSGameStartProps {
  onStart: () => void;
  allowedBetting: number;
  onCancel: () => void;
}

const RPSGameStart: React.FC<RPSGameStartProps> = ({
  onStart,
  allowedBetting,
  onCancel,
}) => {
  const [betAmount, setBetAmount] = useState<string>("");
  const setBetAmountStore = useRPSGameStore((state) => state.setBetAmount);
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = parseInt(value);
    if (
      value === "" ||
      (/^\d+$/.test(value) && numericValue <= allowedBetting+1)
    ) {
      setBetAmount(value);
      // console.log(`betAmount set to: ${value}`);
    }
  };

  const handleStartClick = (
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault(); // 기본 폼 제출을 막습니다.
    const amount = parseInt(betAmount);
    // console.log(`handleStartClick called with amount: ${amount}`);
    if (amount > 0 && amount <= allowedBetting+1) {
      // console.log("Starting game with betAmount:", amount);
      setBetAmountStore(amount); // betAmount를 설정
      onStart(); // 게임 시작
    } else {
      alert(`The betting amount must be at least 1 star and up to a maximum of ${allowedBetting + 1} stars.`);
    }
  };

  const handleCancelClick = () => {
    onCancel(); // 취소 시 호출하여 주사위 게임으로 돌아감
    // console.log("Game canceled by user");
  };

  return (
    <div className="h-screen md:min-w-[600px] flex flex-col items-center justify-center px-12">
      <h1 className="text-[#E20100] font-jalnan text-center text-[26px] mt-4 whitespace-nowrap">
        3배 혹은 꽝!
        <br />
        당신의 운을 시험해 보세요!
      </h1>

      <div className="flex flex-col items-center justify-center mt-4">
        <img
          src={Images.RPSGameExample}
          alt="RPSGameExample"
          className="w-[240px]"
        />

        <div className="flex flex-row gap-3 mt-4">
          <Popover>
            <PopoverTrigger className="flex flex-row gap-1 border-2 border-[#21212f] rounded-3xl text-center bg-white text-[#171717] font-medium w-[165px] h-[72px] items-center justify-center">
              <AiFillQuestionCircle className="w-6 h-6" />
              <p>게임 방법</p>
            </PopoverTrigger>
            <PopoverContent
              className="rounded-3xl border-2 border-[#21212f] bg-white"
              style={{
                maxHeight: "65vh",
                overflowY: "auto",
              }}
            >
              <div className="text-black p-4 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold text-center mb-4">
                  ✼ 게임 설명 ✼
                </h2>
                <ol className="text-sm leading-loose space-y-4">
                  <li>
                    <strong>베팅 금액 입력</strong>
                    <ul className="list-disc pl-5">
                      <li>최대 베팅 가능액은 총 별(Stars)의 절반입니다.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>가위바위보 게임 시작</strong>
                    <ul className="list-disc pl-5">
                      <li>각 라운드에서 가위, 바위, 보 중 하나를 선택하세요.</li>
                      <li>최대 3라운드를 진행합니다.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>보상 획득</strong>
                    <ul className="list-disc pl-5">
                      <li>한 라운드를 이기면 베팅 금액이 3배가 됩니다.</li>
                      <li>연속으로 승리 시 보상이 배로 누적됩니다.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>계속하거나 멈추기</strong>
                    <ul className="list-disc pl-5">
                      <li>라운드에 승리 후, 계속 도전하거나 종료하여 수익을 확정할 수 있습니다.</li>
                      <li>한 번이라도 패배하면 베팅 금액을 잃습니다.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex flex-col gap-1 border-2 border-[#21212f] rounded-3xl text-center bg-white text-[#171717] font-medium w-[165px] h-[72px] items-center justify-center">
            <p className="text-xs text-[#737373]">허용 베팅 금액</p>
            <div className="flex flex-row items-center justify-center gap-3">
              <img src={Images.Star} alt="Star" className="w-6 h-6" />
              <p>{formatNumber(allowedBetting)}</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleStartClick}>
          <input
            placeholder="How many stars would you like to bet?"
            type="number"
            value={betAmount}
            onChange={handleInputChange}
            max={formatNumber(allowedBetting)} // 입력값 제한
            className="border-2 border-[#21212f] rounded-2xl h-12 text-sm font-medium px-4 mt-4 w-[342px]"
          />

          <div className="flex flex-row mt-4 gap-3">
            <button
              className="flex items-center justify-center bg-gray-200 text-[#171717] rounded-full font-medium h-14 w-[165px]"
              type="button"
              onClick={handleCancelClick}
            >
              취소
            </button>
            <button
              type="submit"
              className={`${
                betAmount && parseInt(betAmount) > 0
                  ? "bg-[#21212F] text-white"
                  : "bg-[#21212F] opacity-70 text-white cursor-not-allowed"
              } rounded-full font-medium h-14 w-[165px]`}
              disabled={
                !betAmount ||
                parseInt(betAmount) <= 0 ||
                parseInt(betAmount) > allowedBetting+1
              }
              // onClick={handleStartClick} // 이미 onSubmit에서 처리하므로 제거
            >
              배팅
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RPSGameStart;
