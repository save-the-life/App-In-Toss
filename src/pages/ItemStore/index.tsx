// import React, { useState, useEffect, useMemo } from "react";
// import { IoChevronBackOutline, IoChevronDownOutline, IoChevronUpOutline  } from "react-icons/io5";
// import { AnimatePresence, motion } from "framer-motion";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useSound } from "@/shared/provider/SoundProvider";
// import Audios from "@/shared/assets/audio";
// import Images from "@/shared/assets/images";
// import getItemInfo from "@/entities/Asset/api/getItemInfo";
// import { HiX } from "react-icons/hi";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/shared/components/ui";
// import LoadingSpinner from "@/shared/components/ui/loadingSpinner";
// import { v4 as uuidv4 } from "uuid";


// // Consumable item names
// const consumableNames = ["DICE", "POINTS", "RAFFLE TICKET"];

// const ItemStore: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { playSfx } = useSound();

//   const [showModal, setShowModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [finish, setFinish] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [needWallet, setNeedWallet] = useState(false);
//   const [paymentMessage, setPaymentMessage] = useState("");
//   // selectedItem를 아이템의 itemId (number)로 관리합니다.
//   const [selectedItem, setSelectedItem] = useState<number | null>(null);
//   const [agreeRefund, setAgreeRefund] = useState(false);
//   const [agreeEncrypted, setAgreeEncrypted] = useState(false);
//   const [balance, setBalance] = useState<string>("");
//   // location.state로 전달된 값이 있다면 초기값으로 설정
//   const balanceFromState = location.state?.balance || null;
//   const [itemData, setItemData] = useState<any[]>([]);
//   const [paymentId, setPaymentId] = useState<string | null>(null);
  
//   const [isDropdownOpen, setIsDropdownOpen] = useState(true);
//   const [isConsumableOpen, setIsConsumableOpen] = useState(true);


//   // USD(STRIPE) 결제 진행 시 시작 시간을 기록합니다.
//   const [paymentStartTime, setPaymentStartTime] = useState<number | null>(null);

//   // 결제 버튼은 아이템 선택, 체크박스 동의, 결제 진행 중이 아닐 때 활성화됩니다.
//   const isEnabled =
//     selectedItem !== null && agreeRefund && agreeEncrypted && !isLoading;

//   // API를 통해 아이템 데이터 조회
//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const items = await getItemInfo();
//         if (items) {
//           // console.log("아이템 정보 확인", items);
//           setItemData(items || []);
//         } else {
//           // console.log("아이템 정보 실패", items);
//         }
//       } catch (err) {
//         // console.error("Failed to fetch items:", err);
//       }
//     };
//     fetchItems();
//   }, []);

//   // Sort premium items
//   const sortedItemData = useMemo(() => {
//     const order = ["GOLD PASS", "SILVER PASS", "BRONZE PASS", "AUTO ITEM", "REWARD BOOSTER"];
//     return [...itemData].sort(
//       (a, b) => order.indexOf(a.itemName.toUpperCase()) - order.indexOf(b.itemName.toUpperCase())
//     );
//   }, [itemData]);

//   // Separate premium and consumable items
//   const premiumItems = useMemo(
//     () => sortedItemData.filter(item => !consumableNames.includes(item.itemName.toUpperCase())),
//     [sortedItemData]
//   );
//   const consumableItemsFromApi = useMemo(
//     () => itemData.filter(item => consumableNames.includes(item.itemName.toUpperCase())),
//     [itemData]
//   );
  


//   // 뒤로가기 버튼
//   const handleBackClick = () => {
//     playSfx(Audios.button_click);
//     navigate(-1);
//   };

//   // 아이템 선택 (itemId를 selectedItem에 저장)
//   const handleSelectItem = (itemId: number) => {
//     playSfx(Audios.button_click);
//     setSelectedItem(itemId);
//     setShowModal(true);
//   };

//   const getCustomDescription = (itemName: string): React.ReactNode => {
//     switch (itemName.toUpperCase()) {
//       case "AUTO ITEM":
//         return <div className="mt-1 text-center">
//                 <div className="my-2 text-base font-normal text-[#A3A3A3] text-center">
//                   <p>1개월 동안 유효</p>
//                   <p>구매 즉시 적용됩니다.</p>
//                 </div>
//                 <p className="text-lg font-semibold">{t("dice_event.auto_roller")}</p>
//                 <p className="text-base font-normal">{t("dice_event.automatically")}</p>
//               </div>;
//       case "REWARD BOOSTER":
//         return <div className="mt-1 text-center">
//                 <div className="my-2 text-base font-normal text-[#A3A3A3] text-center">
//                   <p>1개월 동안 유효</p>
//                   <p>구매 즉시 적용됩니다.</p>
//                 </div>
//                 <p className="text-lg font-semibold">{t("dice_event.reward_booster")}</p>
//                 <p className="text-base font-normal">{t("dice_event.board_spin_reward")} : x2</p>
//               </div>;
//       case "GOLD PASS":
//         return <div className="mt-1 text-center">
//                 <div className="my-2 text-base font-normal text-[#A3A3A3] text-center">
//                   <p>1개월 동안 유효</p>
//                   <p>구매 즉시 적용됩니다.</p>
//                 </div>
//                 <p className="text-lg font-semibold">{t("dice_event.reward_multiplier")}</p>
//                 <p className="text-base font-normal">{t("dice_event.game_board_points")} : x3</p><br />
//                 <p className="text-lg font-semibold mt-4">{t("dice_event.turbo")}</p>
//                 <p className="text-base font-normal">{t("dice_event.raffle_tickets")} : x2</p>
//               </div>;
//       case "SILVER PASS":
//         return <div className="mt-1 text-center">
//                 <div className="my-2 text-base font-normal text-[#A3A3A3] text-center">
//                   <p>1개월 동안 유효</p>
//                   <p>구매 즉시 적용됩니다.</p>
//                 </div>
//                 <p className="text-lg font-semibold">{t("dice_event.reward_multiplier")}</p>
//                 <p className="text-base font-normal">{t("dice_event.game_board_points")} : x2</p><br />
//                 <p className="text-lg font-semibold mt-4">{t("dice_event.turbo")}</p>
//                 <p className="text-base font-normal">{t("dice_event.raffle_tickets")} : x2</p>
//               </div>;
//       case "BRONZE PASS":
//         return <div className="mt-1 text-center">
//                 <div className="my-2 text-base font-normal text-[#A3A3A3] text-center">
//                   <p>1개월 동안 유효</p>
//                   <p>구매 즉시 적용됩니다.</p>
//                 </div>
//                 <p className="text-lg font-semibold">{t("dice_event.reward_multiplier")}</p>
//                 <p className="text-base font-normal">{t("dice_event.game_board_points")} : x1</p><br />
//                 <p className="text-lg font-semibold mt-4">{t("dice_event.turbo")}</p>
//                 <p className="text-base font-normal">{t("dice_event.raffle_tickets")} : x2</p>
//               </div>;
//       case "DICE":
//         return <div className="mt-1 text-center">
//                 <p className="text-lg font-semibold">+100 {t("dice_event.dice_pack")}</p>
//               </div>;
//       case "POINTS":
//         return <div className="mt-1 text-center">
//                 <p className="text-lg font-semibold">+100,000 {t("dice_event.point_pack")}</p>
//               </div>;
//       case "RAFFLE TICKET":
//         return <div className="mt-1 text-center">
//                 <p className="text-lg font-semibold">+100 {t("dice_event.raffle_pack")}</p>
//               </div>;
//       default:
//         return <div></div>;
//     }
//   };

//   const customText = (itemName: string): React.ReactNode => {
//     switch (itemName.toUpperCase()) {
//       case "AUTO ITEM":
//         return <div className="mt-1 text-center">
//                 <p className="text-xs font-medium">{t("dice_event.auto")}</p>
//               </div>;
//       case "REWARD BOOSTER":
//         return <div className="mt-1 text-center">
//                 <p className="text-xs font-medium">{t("dice_event.board_spin_reward")} : x2</p>
//               </div>;
//       case "GOLD PASS":
//         return <div className="mt-1 text-center">
//                 <p className="text-xs font-medium">{t("dice_event.game_board_points")} : x3</p>
//                 <p className="text-xs font-medium">{t("dice_event.raffle_tickets")} : x2</p>
//               </div>;
//       case "SILVER PASS":
//         return <div className="mt-1 text-center">
//                 <p className="text-xs font-medium">{t("dice_event.game_board_points")} : x2</p>
//                 <p className="text-xs font-medium">{t("dice_event.raffle_tickets")} : x2</p>
//               </div>;
//       case "BRONZE PASS":
//         return <div className="mt-1 text-center">
//                 <p className="text-xs font-medium">{t("dice_event.game_board_points")} : x1</p>
//                 <p className="text-xs font-medium">{t("dice_event.raffle_tickets")} : x2</p>
//               </div>;
//       case "DICE":
//         return <div className="mt-1 text-center">
//                 <p className="text-xs font-medium">+100 {t("dice_event.dice_pack")}</p>
//               </div>;
//       case "POINTS":
//         return <div className="mt-1 text-center">
//                 <p className="text-xs font-medium">+100,000 {t("dice_event.point_pack")}</p>
//               </div>;
//       case "RAFFLE TICKET":
//         return <div className="mt-1 text-center">
//                 <p className="text-xs font-medium">+100 {t("dice_event.raffle_pack")}</p>
//               </div>;
//       default:
//         return <div></div>;
//     }
//   }

  
  

//   // 선택된 아이템 정보 조회 (selectedItem의 itemId와 매칭)
//   const selectedItemInfo = useMemo(() => {
//     if (selectedItem === null || itemData.length === 0) return null;
//     return itemData.find((item) => item.itemId === selectedItem);
//   }, [selectedItem, itemData]);


//   // 아이템별 배경색 결정 함수
//   const getBackgroundGradient = (itemName: string) => {
//     const name = itemName.toUpperCase();
//     if (name === "DICE") {
//       return "linear-gradient(180deg, #DD2726 0%, #FFFFFF 100%)";
//     } else if (name === "POINTS") {
//       return "linear-gradient(180deg, #FDE047 0%, #FFFFFF 100%)";
//     } else if (name === "RAFFLE TICKET") {
//       return "linear-gradient(180deg, #0147E5 0%, #FFFFFF 100%)";
//     } else if (name === "AUTO ITEM") {
//       return "linear-gradient(180deg, #0147E5 0%, #FFFFFF 100%)";
//     } else if (name === "REWARD BOOSTER") {
//       return "linear-gradient(180deg, #FF4F4F 0%, #FFFFFF 100%)";
//     } else if (name === "GOLD PASS") {
//       return "linear-gradient(180deg, #FDE047 0%, #FFFFFF 100%)";
//     } else if (name === "SILVER PASS") {
//       return "linear-gradient(180deg, #22C55E 0%, #FFFFFF 100%)";
//     }
//     return "linear-gradient(180deg, #F59E0B 0%, #FFFFFF 100%)";
//   };

//   return (
//     isLoading ? (
//       <LoadingSpinner className="h-screen" />
//     ) : (
//       <div className="flex flex-col items-center text-white px-6 min-h-screen">

//         {/* 아이템 목록 (2열 그리드) */}
//         {/* <div className="grid grid-cols-2 gap-4 mt-4 w-full mb-10">
//           {sortedItemData.map((item) => (
//             <div
//               key={item.itemId}
//               className={`bg-[#1F1E27] border-2 p-[10px] rounded-xl flex flex-col items-center ${
//                 selectedItem === item.itemId ? "border-blue-400" : "border-[#737373]"
//               }`}
//               onClick={() => handleSelectItem(item.itemId)}
//             >
//               <div
//                 className="relative w-full aspect-[145/102] rounded-md mt-1 mx-1 overflow-hidden flex items-center justify-center"
//                 style={{ background: getBackgroundGradient(item.itemName) }}
//               >                              
//                 <img
//                   src={Images.Discount}
//                   alt="Discount"
//                   className="absolute top-1 left-1 w-[45px] md:w-[90px] h-[20px] md:h-[40px] object-cover"
//                 />

//                 <img
//                   src={item.itemUrl}
//                   alt={item.itemName}
//                   className="w-[80px] h-[80px] object-cover"
//                 />
//               </div>
//               <p className="mt-2 text-sm font-semibold">{item.itemName}</p>
//               <div className="mt-1">{sortedItemData? customText(item.itemName):"" }</div>
//             </div>
//           ))}
//         </div> */}

//         {/* 드롭다운: Premium Boosts */}
//         <div className="w-full mb-4">
//         <button className="flex items-start justify-between w-full" onClick={() => { playSfx(Audios.button_click); setIsDropdownOpen(!isDropdownOpen); }}>
//           <span className="text-base font-semibold">Premium Boosts</span>
//           {isDropdownOpen ? <IoChevronUpOutline className="w-5 h-5" /> : <IoChevronDownOutline className="w-5 h-5" />}
//         </button>
//         <AnimatePresence>
//           {isDropdownOpen && (
//             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
//               <div className="grid grid-cols-2 gap-4 mt-4 mb-6">
//                 {premiumItems.map(item => (
//                   <div key={item.itemId} className={`bg-[#1F1E27] border-2 p-[10px] rounded-xl flex flex-col items-center ${selectedItem===item.itemId ? "border-blue-400" : "border-[#737373]"}`} onClick={() => handleSelectItem(item.itemId)}>
//                     <div className="relative w-full aspect-[145/102] rounded-md mt-1 mx-1 overflow-hidden flex items-center justify-center" style={{ background: getBackgroundGradient(item.itemName) }}>
//                       <img src={Images.Discount} alt="Discount" className="absolute top-1 left-1 w-[45px] md:w-[90px] h-[20px] md:h-[40px] object-cover" />
//                       <img src={item.itemUrl} alt={item.itemName} className="w-[80px] h-[80px] object-cover" />
//                     </div>
//                     <p className="mt-2 text-sm font-semibold">{item.itemName}</p>
//                     <div className="mt-1">{customText(item.itemName)}</div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Consumable Items */}
//       <div className="w-full mb-4">
//         <button className="flex items-start justify-between w-full" onClick={() => { playSfx(Audios.button_click); setIsConsumableOpen(!isConsumableOpen); }}>
//           <span className="text-base font-semibold">Consumable Items</span>
//           {isConsumableOpen ? <IoChevronUpOutline className="w-5 h-5" /> : <IoChevronDownOutline className="w-5 h-5" />}
//         </button>
//         <AnimatePresence>
//           {isConsumableOpen && (
//             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
//               <div className="grid grid-cols-2 gap-4 mt-4 mb-6">
//                 {consumableItemsFromApi.map(item => (
//                   <div key={item.itemId} className={`bg-[#1F1E27] border-2 p-[10px] rounded-xl flex flex-col items-center ${selectedItem===item.itemId ? "border-blue-400" : "border-[#737373]"}`} onClick={() => handleSelectItem(item.itemId)}>
//                     <div className="relative w-full aspect-[145/102] rounded-md mt-1 mx-1 overflow-hidden flex items-center justify-center" style={{ background: getBackgroundGradient(item.itemName) }}>
//                       <img src={Images.Discount} alt="Discount" className="absolute top-1 left-1 w-[45px] md:w-[90px] h-[20px] md:h-[40px] object-cover" />
//                       <img src={item.itemUrl} alt={item.itemName} className="w-[80px] h-[80px] object-cover" />
//                     </div>
//                     <p className="mt-2 text-sm font-semibold">{item.itemName}</p>
//                     <div className="mt-1">{customText(item.itemName)}</div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//         {/* 체크박스 및 결제 버튼 영역 */}
//         <div className="mt-5 px-6">
//           <div className="flex flex-col gap-3 mb-5">
//             {/* 환불 정책 동의 사항 */}
//             <label className="flex items-start gap-2">
//               <input
//                 type="checkbox"
//                 checked={agreeRefund}
//                 onChange={() => {
//                   playSfx(Audios.button_click);
//                   setAgreeRefund(!agreeRefund);
//                 }}
//               />
//               <span className="text-xs font-medium">
//                 {t("asset_page.agree_non_refundable")}
//                 <a
//                   href="https://docs.dappportal.io/mini-dapp/mini-dapp-sdk/payment-provider/policy/refund"
//                   className="text-xs font-semibold text-[#3B82F6] ml-1"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   {t("asset_page.learn_more")}
//                 </a>
//               </span>
//             </label>
//             {/* 개인정보 제공 동의 사항 */}
//             <label className="flex items-start gap-2">
//               <input
//                 type="checkbox"
//                 checked={agreeEncrypted}
//                 onChange={() => {
//                   playSfx(Audios.button_click);
//                   setAgreeEncrypted(!agreeEncrypted);
//                 }}
//               />
//               <span className="text-xs font-medium">
//                 {t("asset_page.provide_encrypted_id")}
//                 <a
//                   href="https://www.lycorp.co.jp/en/company/privacypolicy/"
//                   className="text-xs font-semibold text-[#3B82F6] ml-1"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   {t("asset_page.learn_more")}
//                 </a>
//               </span>
//             </label>
            
//             {/* 아이템 효과 중첩 안내 */}
//             <div className="flex justify-center items-center gap-2">
//               <img
//                   src={Images.Note}
//                   alt="gift-icon"
//                   className="w-7 h-7"
//               />
//               <p className="text-center text-lg font-normal text-[#FDE047]">
//                   {t("asset_page.note")}
//               </p>
//             </div>
//           </div>

//           <div className="mb-3 flex justify-center items-center">
//             <span className="text-sm text-[#A3A3A3]">{t("asset_page.Balance")} :</span>
//             <span className="text-sm text-white ml-1">
//               {balance || balanceFromState} KAIA
//             </span>
//           </div>
//         </div>

//         {/* 아이템 설명 모달창 */}
//         <AlertDialog open={showModal}>
//           <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
//             <AlertDialogHeader>
//               <AlertDialogDescription className="sr-only">
//                 Item details
//               </AlertDialogDescription>
//               <AlertDialogTitle className="text-center font-bold text-xl">
//                 <div className="flex flex-row items-center justify-between">
//                   <div>&nbsp;</div>
//                   <p className="text-xl font-bold text-center">{selectedItemInfo?.itemName}</p>
//                   <HiX
//                     className="w-6 h-6 cursor-pointer"
//                     onClick={() => {
//                       playSfx(Audios.button_click);
//                       setShowModal(false);
//                     }}
//                   />
//                 </div>
//               </AlertDialogTitle>
//             </AlertDialogHeader>
//             <div className="flex flex-col items-center justify-center">
//               <div
//                 className="relative w-[145px] aspect-[145/154] rounded-md mt-1 mx-1 overflow-hidden flex items-center justify-center"
//                 style={{
//                   background: selectedItemInfo
//                     ? getBackgroundGradient(selectedItemInfo.itemName)
//                     : "linear-gradient(180deg, #AAAAAA 0%, #FFFFFF 100%)",
//                 }}
//               >
//                 <img
//                   src={selectedItemInfo?.itemUrl}
//                   alt={selectedItemInfo?.itemName}
//                   className="w-[120px] h-[120px] object-cover"
//                 />
//               </div>
//               <p>{selectedItemInfo ? getCustomDescription(selectedItemInfo.itemName) : ""}</p>
//             </div>
//           </AlertDialogContent>
//         </AlertDialog>

//         {/* 결제 결과(성공/실패) 안내 모달창 */}
//         <AlertDialog open={finish}>
//           <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
//             <AlertDialogHeader>
//               <AlertDialogDescription className="sr-only">
//                 Payment result
//               </AlertDialogDescription>
//               <AlertDialogTitle className="text-center font-bold text-xl"></AlertDialogTitle>
//             </AlertDialogHeader>
//             <div className="flex flex-col items-center justify-center">
//               <div className="relative w-full rounded-full mt-12 mx-1 overflow-hidden flex items-center justify-center">
//                 <img
//                   src={isSuccess ? Images.success : Images.failed}
//                   alt={isSuccess ? "success" : "failed"}
//                   className="w-[50px] h-[50px] object-cover"
//                 />
//               </div>
//               <p className="mt-5 text-xl font-semibold">{paymentMessage}</p>
//               <div className="mt-10">
//                 <button
//                   onClick={() => {
//                     playSfx(Audios.button_click);
//                     setFinish(false);
//                     navigate("/my-assets")
//                   }}
//                   className="w-[165px] h-14 rounded-full bg-[#0147E5] text-white text-base font-medium"
//                 >
//                   {isSuccess ? "Continue" : "Close"}
//                 </button>
//               </div>
//             </div>
//           </AlertDialogContent>
//         </AlertDialog>

//       </div>
//     )
//   );
// };

// export default ItemStore;
