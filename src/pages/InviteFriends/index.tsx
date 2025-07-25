import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopTitle } from '@/shared/components/ui';
import './InviteFriends.css';
import Images from '@/shared/assets/images';
import { BiCopy } from 'react-icons/bi';
import LoadingSpinner from '@/shared/components/ui/loadingSpinner';
import getFriends from '@/entities/Mission/api/friends';
import { formatNumber } from '@/shared/utils/formatNumber';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";

interface TruncateMiddleProps {
  text: string;
  maxLength: number;
  className?: string;
}

// 주소 중간 생략
const TruncateMiddle: React.FC<TruncateMiddleProps> = ({
  text,
  maxLength,
  className,
}) => {
  const truncateMiddle = (str: string, maxLen: number): string => {
    if (str.length <= maxLen) return str;

    const charsToShow = maxLen - 3; // 3 characters for "..."
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return (
      str.substr(0, frontChars) + '...' + str.substr(str.length - backChars)
    );
  };

  const truncatedText = truncateMiddle(text, maxLength);

  return <div className={`font-semibold ${className}`}>{truncatedText}</div>;
};

interface Friend {
  userId: string;
}

const InviteFriends: React.FC = () => {
  const navigate = useNavigate();
  const { playSfx } = useSound();
  const [copySuccess, setCopySuccess] = useState<string>(''); // 클립보드 복사 결과 메시지
  const [referralLink, setReferralLink] = useState<string>(''); // 레퍼럴 코드 상태
  const [friends, setFriends] = useState<Friend[]>([]); // 친구 목록 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태

  // 클립보드 복사 함수
  const copyToClipboard = async () => {
    playSfx(Audios.button_click);

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000); // 2초 후에 알림 메시지 제거
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  // 페이지 로드 시 API 호출
  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const data = await getFriends(); // API 호출
        setReferralLink(data.referralCode.referralUrl); // 레퍼럴 코드 설정
        setFriends(data.friends || []); // 친구 목록 설정 (없으면 빈 배열)
        setLoading(false); // 로딩 완료
      } catch (error) {
        // console.error('Error fetching friends data:', error);
        setLoading(false); // 에러 시 로딩 종료
      }
    };

    fetchFriendsData();
  }, []);

  const handleInviteClick = async () => {
    playSfx(Audios.button_click);
    
    try {
      const shareData = {
        title: 'Awesome App Invitation',
        text: 'Join me on this awesome app! Use my referral link:',
        url: referralLink,
      };

      if (navigator.share) {
        // Web Share API 지원 여부 확인
        if (navigator.canShare && navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
            // console.log('Content shared successfully');
          } catch (error) {
            // console.error('Error sharing content:', error);
          }
        } else {
          // console.error('This data type cannot be shared using Web Share API.');
          // 대체 처리: 클립보드에 링크 복사
          await navigator.clipboard.writeText(referralLink);
          // console.log('Referral link copied to clipboard.');
        }
      } else {
        // console.error('Web Share API is not supported in this browser.');
        // 대체 처리: 클립보드에 링크 복사
        await navigator.clipboard.writeText(referralLink);
        // console.log('Referral link copied to clipboard.');
      }
    } catch (error) {
      // console.error('Error sharing message:', error);
    }
  };
  
  // 로딩 상태 처리
  if (loading) {
    return <LoadingSpinner className="h-screen" />;
  }

  return (
    <div className="flex flex-col mx-6 mb-44 text-white items-center min-h-screen">
      <TopTitle title={"친구 초대"} back={true} />
      <p>추천 코드</p>
      <button
        className="flex flex-row gap-2 items-center border border-white rounded-full w-56 md:w-80 h-16 justify-center mt-2 px-4"
        onClick={copyToClipboard}
      >
        <p className="truncate">
          <TruncateMiddle text={referralLink} maxLength={20} />
        </p>
        <BiCopy className="min-w-5 min-h-5" />
      </button>
      {copySuccess && (
        <p className="text-sm text-green-500 mt-2">{copySuccess}</p>
      )}
      <div className="invite-reward-box w-full md:w-[500px] h-[332px] rounded-3xl flex flex-col items-center justify-center mt-9 gap-4">
        <div className="flex flex-row items-center">
          <div className="flex flex-col items-center gap-2 justify-center">
            <img src={Images.Star} alt="star" className="h-11" />
            <p className="font-medium text-sm">{formatNumber(10000)} P</p>
          </div>
        </div>

        {/* <p className="text-xl font-semibold text-center">
          <Trans i18nKey="referral.title" components={{ 1: <br /> }} />
        </p>
        <p className="text-sm font-medium mt-2 text-center">
          <Trans i18nKey="referral.description" components={{ 1: <br /> }} />
        </p> */}

        <button 
          className="h-14 w-[302px] rounded-full bg-[#21212f] my-5"
          onClick={handleInviteClick}>
          친구를 초대하고 보상을 받으세요
        </button>
      </div>

      {friends.length > 0 ? ( // 친구 목록이 존재하는 경우에만 렌더링
        <div className="flex flex-col mt-8 w-full gap-3">
          <div className="flex flex-row justify-between items-center mb-[6px]">
            <p className="text-lg font-medium">초대된 친구</p>
            <div
              className="flex items-center justify-center text-sm font-medium w-[72px] h-8 rounded-full bg-[#21212f]"
              onClick={()=>{
                playSfx(Audios.button_click);
                navigate("/invite-friends-list");
              }}>
              Total : <span className="text-[#FDE047]">{friends.length}</span>
            </div>
          </div>
          {friends.map((friend, index) => (
            <div
              key={index}
              className="bg-[#1F1E27] rounded-3xl border-2 border-[#35383F] flex flex-row items-center justify-start gap-4 h-16 text-base font-medium px-5"
            >
              <p className="text-[#D4D4D4]">{index + 1}</p>
              <p>{friend.userId}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 mt-8">Invite Your Friends!</p> // 친구가 없을 경우
      )}
    </div>
  );
};

export default InviteFriends;
