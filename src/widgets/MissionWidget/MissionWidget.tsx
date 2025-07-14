import React from 'react';
import Images from '@/shared/assets/images';
import { useNavigate } from 'react-router-dom';
import { useNavigationStore } from '@/shared/store/navigationStore';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";


const MissionWidget: React.FC = () => {
  const navigate = useNavigate();
  const setSelected = useNavigationStore((state) => state.setSelected);
  const { playSfx } = useSound();
  

  const handleMissionClick = () => {
    playSfx(Audios.button_click);
    setSelected('/mission');
    navigate('/mission');
  };

  return (
    <div
      className="mt-6 flex flex-col items-center justify-center cursor-pointer"
      onClick={handleMissionClick}
    >
      <h1 className="font-jalnan text-white text-3xl">미션</h1>
      <div className="flex flex-row items-center justify-between md:justify-around bg-box mt-4 w-[332px] md:w-[595.95px] h-36 md:h-44 text-white px-8">
        <div className="space-y-3">
          <h2 className="font-semibold text-xl">주사위 더 얻기</h2>
          <p className="text-sm">
            추가로 주사위를 굴릴 기회를 얻어
            <br />
            당첨 확률을 높이세요!
          </p>
        </div>
        <img
          src={Images.MissionDice}
          className="w-28 h-28 object-cover"
          alt="mission-dice"
        />
      </div>
    </div>
  );
};

export default MissionWidget;
