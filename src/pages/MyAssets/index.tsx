import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { BiWallet } from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { HiX } from 'react-icons/hi';
import { BiCopy } from 'react-icons/bi';
import Images from '@/shared/assets/images';
import { useUserStore } from "@/entities/User/model/userModel";
import LoadingSpinner from '@/shared/components/ui/loadingSpinner';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import getRewardsHistory from "@/entities/Asset/api/getRewardsHistory";

interface TruncateMiddleProps {
    text: any;
    maxLength: number;
    className?: string;
}
  
// 주소 중간 생략 컴포넌트
const TruncateMiddle: React.FC<TruncateMiddleProps> = ({ text, maxLength, className }) => {
    const truncateMiddle = (str: string, maxLen: number): string => {
        if (str.length <= maxLen) return str;
        const charsToShow = maxLen - 9;
        const frontChars = Math.ceil(charsToShow / 2);
        const backChars = Math.floor(charsToShow / 2);
        return str.substr(0, frontChars) + '...' + str.substr(str.length - backChars);
    };

    const truncatedText = truncateMiddle(text, maxLength);
    return <div className={`text-sm font-bold ${className}`}>{truncatedText}</div>;
};

interface ClaimData {
    claimId: number;
    walletAddress: string;
    claimType: string;
    claimStatus: string;
    amount: number;
}

const MyAssets: React.FC = () => {
    const navigate = useNavigate();
    const { playSfx } = useSound();
    const { nickName, userLv, characterType, uid } = useUserStore();
    const [loading, setLoading] = useState(true);
    const [nft, setNFT] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [claimModalOpen, setClaimModalOpen] = useState(false);
    const [walletConnectionSLT, setWalletConnectionSLT] = useState(false);
    const [walletConnectionUSDT, setWalletConnectionUSDT] = useState(false);
    const [SLClaim, setSLClaim] = useState(false);
    const [USDTClaim, setUsdtCaim] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [rewardHistoryData, setRewardHistoryData] = useState<any[]>([]);
    const [balance, setBalance] = useState("0.00");

    const [nonNftItems, setNonNftItems] = useState<any[]>([]);
    const [nftCollection, setNftCollection] = useState<any[]>([]);
    const [claimBalance, setClaimBalance] = useState<{ slPoints: number; usdtPoints: number }>({ slPoints: 0, usdtPoints: 0 });
    const [claimSuccess, setClaimSuccess] = useState(false);
    const [claimFailed, setClaimFailed] = useState(false);
    const [failMessage, setFailMessage] = useState("");
    const [claimData, setClaimData] = useState<ClaimData | null>(null);
    const [userClaimAmount, setUserClaimAmount] = useState("");  
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    

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
        return characterType === "cat"
          ? catImages[index] || catImages[catImages.length - 1]
          : dogImages[index] || dogImages[dogImages.length - 1];
    };
    
    const charactorImageSrc = getCharacterImageSrc();

    let levelClassName = '';
    let mainColor = '';
  
    if (userLv >= 1 && userLv <= 4) {
      levelClassName = 'lv1to4-box';
      mainColor = '#dd2726';
    } else if (userLv >= 5 && userLv <= 8) {
      levelClassName = 'lv5to8-box';
      mainColor = '#f59e0b';
    } else if (userLv >= 9 && userLv <= 12) {
      levelClassName = 'lv9to12-box';
      mainColor = '#facc15';
    } else if (userLv >= 13 && userLv <= 16) {
      levelClassName = 'lv13to16-box';
      mainColor = '#22c55e';
    } else if (userLv >= 17 && userLv <= 20) {
      levelClassName = 'lv17to20-box';
      mainColor = '#0147e5';
    }

    // 초기 로딩 처리 (200ms 후 loading false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    // 월 이름 변환 헬퍼 함수
    const getMonthName = (monthNumber: number): string => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[monthNumber - 1] || "Unknown";
    };

    // 보상 내역 API 호출
    useEffect(() => {
        const fetchRewardsHistory = async () => {
            try {
                const data = await getRewardsHistory("STAR", "REWARD", null, null, 0);
                const rewards = data.content || [];
                setRewardHistoryData(rewards);
            } catch (error) {
                // console.error("보상 내역을 불러오는데 실패했습니다: ", error);
            }
        };
        fetchRewardsHistory();
    }, []);

    const displayHistory = rewardHistoryData.map((reward) => {
        const displayAsset = reward.currencyType === "STAR" ? "P" : reward.currencyType;
        const displayChangeType = reward.changeType === "REWARD" ? "INCREASE" : "DECREASE";
        let contentKey = "";
        switch (reward.content) {
            case "Dice Game Reward":
                contentKey = "dice_game_reward";
                break;
            case "Level Up":
                contentKey = "level_up";
                break;
            case "Monthly Ranking Compensation":
                contentKey = "monthly_ranking_compensation";
                break;
            case "Spin Game Reward":
                contentKey = "spin_game_reward";
                break;
            case "Daily Attendance Reward":
                contentKey = "daily_attendance_reward";
                break;
            case "RPS Game Win":
                contentKey = "rps_game_win";
                break;
            case "RPS Game Betting":
                contentKey = "rps_game_betting";
                break;
            case "Follow on X":
                contentKey = "follow_on_x";
                break;
            case "Join Telegram":
                contentKey = "join_telegram";
                break;
            case "Subscribe to Email":
                contentKey = "subscribe_to_email";
                break;
            case "Follow on Medium":
                contentKey = "follow_on_Medium";
                break;
            case "Leave a Supportive Comment on SL X":
                contentKey = "leave_supportive_comment";
                break;
            case "Join LuckyDice Star Reward":
                contentKey = "join_lucky_dice";
                break;
            case "Monthly Raffle Compensationd":
                contentKey = "monthly_raffle_compensation";
                break;
            case "Get Point Reward":
                contentKey = "get_point_reward";
                break;
            case "Join LuckyDice SL Reward":
                contentKey = "join_lucky_sl";
                break;
            case "Get Promotion Reward":
                contentKey = "promotion_reward";
                break;
            case "Invite a Friend Reward":
                contentKey = "invite_friend_reward";
                break;
            case "Mystery Gift":
                contentKey = "mystery_gift";
                break;
            case "1st Ranking Awards":
                contentKey = "1st_awards";
                break;
            case "AI Examination":
                contentKey = "ai_exam";
                break;
            case "1st Raffle Awards":
                contentKey = "1st_raffle";
                break;
            case "Request Claim":
                contentKey = "request_claim";
                break;
            case "Shop Purchase":
                contentKey = "shop_purchase";
                break;
            case "2nd Ranking Awards":
                contentKey = "2nd_awards";
                break;
            default:
            contentKey = reward.content;
        }
        return { ...reward, contentKey, displayAsset, displayChangeType };
      });
      

    const formatDate = (date: string): string => {
        const [day, month, year] = date.split("-").map(Number);
        const monthName = getMonthName(month);
        return `${day} ${monthName} ${year}`;
    };

    const formatDuration = (dateStr: string): string => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    
    const formatDateRange = (gainedAt: string, expirationTime: string): string => {
        return `${formatDuration(gainedAt)} ~ ${formatDuration(expirationTime)}`;
    };

    const getBackgroundGradient = (itemName: string) => {
        const name = itemName.toUpperCase();
        if (name === "AUTO") {
            return "linear-gradient(180deg, #0147E5 0%, #FFFFFF 100%)";
        } else if (name === "REWARD") {
            return "linear-gradient(180deg, #FF4F4F 0%, #FFFFFF 100%)";
        } else if(name === "GOLD"){
            return "linear-gradient(180deg, #FDE047 0%, #FFFFFF 100%)";
        } else if(name === "SILVER"){
            return "linear-gradient(180deg, #22C55E 0%, #FFFFFF 100%)";
        } else {
            return "linear-gradient(180deg, #F59E0B 0%, #FFFFFF 100%)";
        }
    };

    
  // 클립보드 복사 함수
  const copyToClipboard = async () => {
    playSfx(Audios.button_click);

    try {
        await navigator.clipboard.writeText(String(uid));
        setCopySuccess(true);
    } catch (err) {
        setCopySuccess(false);
    }
  };

    return (  
        loading 
          ? <LoadingSpinner className="h-screen" /> 
          : (
            <div className="flex flex-col items-center text-white mx-6 relative min-h-screen pb-32">
                {/* 상단 사용자 정보 */}
                <div className="flex items-center justify-between w-full mt-6">
                    <div className="flex items-center">
                        <div className={`flex flex-col items-center justify-center rounded-full w-9 h-9 md:w-10 md:h-10 ${levelClassName}`}>
                            <img
                                src={charactorImageSrc}
                                alt="User Profile"
                                className="w-8 h-8 rounded-full"
                            />
                        </div>
                        <div className="ml-2">
                            <button
                                className="flex items-center text-white text-xs"
                                onClick={()=>{navigate("/edit-nickname")}}
                                aria-label="View All Items">
                                {nickName} <FaChevronRight className="ml-1 w-3 h-3" />
                            </button>
                            <button
                                className="flex items-center text-xs font-semibold text-[#737373]"
                                onClick={copyToClipboard}
                                >
                                UID: {uid} <BiCopy className="ml-1 w-3 h-3" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            onClick={()=>{
                                playSfx(Audios.button_click);
                                navigate('/settings');
                            }}>
                            <IoSettingsOutline className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* ITEM 상점 이동 영역 */}
                <div 
                    className="rounded-2xl p-5 mt-6 w-full flex items-center justify-between"
                    onClick={()=>{
                        playSfx(Audios.button_click);
                        navigate("/item-store");
                    }}
                    style={{ background: "linear-gradient(to bottom, #19203CB2 0%, #304689 100%)" }}>
                    <div className="pl-3">
                        <h3 className="text-base font-semibold mb-[6px] whitespace-nowrap">지금 바로 아이템을 쇼핑하세요!</h3>
                        <p className="text-sm font-medium text-gray-200">
                            강력한 아이템으로 빠르게 랭크를 올리세요!
                        </p>
                    </div>
                    <img
                        src={Images.Rocket}
                        alt="Shop NFTs"
                        className="w-[90px] h-[90px]"
                    />
                </div>

                {/* Non-NFT Items 영역 */}
                <div className="mt-10 mb-5 w-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">내 아이템</h2>
                    </div>
                    <div className="mt-10 w-full">
                        {nonNftItems.length === 0 ? (
                            <div className="mx-0 w-full h-[150px] flex flex-col items-center justify-center">
                                <p className="text-center text-[#737373] text-sm font-medium">
                                    <span className="whitespace-nowrap">아직 보유 중인 item이 없습니다.</span>
                                    <br />
                                    <span className="whitespace-nowrap">ITEM을 소유하고 랭크를 올려보세요!</span>
                                </p>

                                <button
                                    className="w-48 py-4 rounded-full text-base font-medium mt-12"
                                    style={{ backgroundColor: '#0147E5' }}
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        navigate("/item-store");
                                    }}>
                                    ITEM 쇼핑하기
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <div className="grid grid-cols-2 gap-4 mt-2 w-full">
                                    {nonNftItems.map((item, index) => (
                                    <div
                                        key={`${item.itemType}-${index}`}
                                        className="bg-[#1F1E27] border-2 border-[#737373] p-[10px] rounded-xl flex flex-col items-center"
                                        onClick={() => {
                                            playSfx(Audios.button_click);
                                        }}>
                                        <div
                                        className="relative w-full aspect-[145/102] rounded-md mt-1 mx-1 overflow-hidden flex items-center justify-center"
                                        style={{ background: getBackgroundGradient(item.itemType) }}>
                                        <img
                                            src={item.imgUrl}
                                            alt={item.name}
                                            className="w-[80px] h-[80px] object-cover"
                                        />
                                        </div>
                                        <p className="mt-2 text-sm font-semibold">{item.name}</p>
                                        <p className="mt-2 text-xs font-normal text-[#A3A3A3] whitespace-nowrap">
                                            {formatDateRange(item.gainedAt, item.expirationTime)}
                                        </p>
                                    </div>
                                    ))}
                                </div>
                                <button
                                    className="w-48 h-14 py-4 rounded-full text-base font-medium mt-12"
                                    style={{ backgroundColor: '#0147E5' }}
                                    onClick={() => {
                                        playSfx(Audios.button_click);
                                        navigate("/item-store");
                                    }}>
                                    ITEM 쇼핑하기
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                

                {/* 보상 내역 */}
                <div className="mt-8 w-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">보상 내역</h2>
                        <button
                            className="flex items-center text-white text-xs"
                            onClick={() => {
                                playSfx(Audios.button_click);
                                navigate("/reward-history");
                            }}>
                            모두 보기 <FaChevronRight className="ml-1 w-2 h-2" />
                        </button>
                    </div>
                    <div className="mt-4 bg-[#1F1E27] rounded-3xl border-[2px] border-[#35383F] py-3 px-4">
                        {displayHistory.length > 0 ? (
                            displayHistory.map((reward, index) => (
                                <div
                                    key={`${reward.loggedAt}-${index}`}
                                    className={`flex justify-between items-center py-4 ${
                                        index !== displayHistory.length - 1 ? "border-b border-[#35383F]" : ""
                                }`}>
                                <div>
                                        <p className="text-sm font-normal">{ reward.contentKey }</p>
                                    <p className="text-xs font-normal text-[#A3A3A3]">
                                    {formatDate(reward.loggedAt)}
                                    </p>
                                </div>
                                <p
                                    className={`text-base font-semibold ${
                                    reward.displayChangeType === "INCREASE" ? "text-[#3B82F6]" : "text-[#DD2726]"
                                    }`}>
                                    {reward.displayChangeType === "INCREASE" ? "+" : "-"}
                                    {reward.amount} {reward.displayAsset}
                                </p>
                                </div>
                            ))
                            ) : (
                            <p className="text-center text-sm text-gray-400">
                                No records found
                            </p>
                        )}
                    </div>
                </div>


                {/* 서비스 준비중 알림 모달창 */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
                        <div className="bg-white text-black p-6 rounded-lg text-center w-[70%] max-w-[550px]">
                            <p>서비스를 준비 중입니다</p>
                            <button
                                className="mt-4 px-4 py-2 bg-[#0147E5] text-white rounded-lg"
                                onClick={() => {
                                    playSfx(Audios.button_click);
                                    setShowModal(false);
                                }}>
                                확인
                            </button>
                        </div>
                    </div>
                )}

                {/* UID 클립 복사 알림 모달창 */}
                {copySuccess && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
                        <div className="bg-white text-black p-6 rounded-lg text-center w-[70%] max-w-[550px]">
                            <p>UID가 클립보드에 복사되었습니다.</p>
                            <button
                                className="mt-4 px-4 py-2 bg-[#0147E5] text-white rounded-lg"
                                onClick={() => {
                                    playSfx(Audios.button_click);
                                    setCopySuccess(false);
                                }}>
                                확인
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    );
};

export default MyAssets;
