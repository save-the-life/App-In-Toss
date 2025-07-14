import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopTitle } from '@/shared/components/ui';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";
import updateNickname from '@/entities/User/api/updateNickname';
import { useUserStore } from '@/entities/User/model/userModel';

const EditNickname: React.FC = () => {
    const navigate = useNavigate();
    const { playSfx } = useSound();
    const { nickName } = useUserStore();
    
    const [newNickname, setNewNickname] = useState(nickName ?? "");
    
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);


    // 완료 버튼 클릭 (닉네임 수정)
    const editBtn = async () => {       
        playSfx(Audios.button_click); 

        if (!newNickname) {
            setShowModal(true);
            setModalMessage('Please provide the new Nickname.');
            return;
        }

        try{
            const updateNick = await updateNickname(newNickname);

            if(updateNick.message === "Success"){
                navigate("/dice-event");
            } else if(updateNick.message === "Exist User Name."){
                setShowModal(true);
                setModalMessage("중복된 닉네임입니다.");
            } else {
                setShowModal(true);
                setModalMessage("잠시 후 다시 시도해 주세요.");

            }
        } catch(error: any){
            // console.log("error 확인: ", error);
            setShowModal(true);
            setModalMessage("잠시 후 다시 시도해 주세요.");
        }
    };

    return (
        <div className="flex flex-col items-center text-white mx-6 relative min-h-screen pb-20">
            <TopTitle title={"닉네임 수정"} back={true} />
      
            {/* 이름 입력란 */}
            <div className="mt-8 w-full">
                <input
                    type="text"
                    placeholder={"이름을 입력해주세요."}
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    maxLength={8}
                    className="w-full p-4 rounded-2xl mb-4 bg-gray-900 text-white border border-[#35383F] focus:outline-none text-base font-normal"
                />
            </div>
            <div className='w-full mt-3 text-left'>
                <p className='text-xs font-normal'>*닉네임은 최대 8자까지 사용할 수 있습니다.</p>
            </div>

            {/* 취소 및 수정 버튼을 하단에 고정 */}
            <div className="w-full max-w-md absolute bottom-16 left-1/2 transform -translate-x-1/2 flex justify-between gap-4">
                <button
                    className="w-1/2 py-4 rounded-full text-base font-medium border-4"
                    style={{ backgroundColor: "#252932", borderColor:"#35383F" }}
                    onClick={()=>{navigate(-1)}}
                    >
                    취소
                </button>
                <button
                    className="w-1/2 py-4 rounded-full text-base font-medium"
                    style={{ backgroundColor: "#0147E5" }}
                    onClick={editBtn}
                    >
                    완료
                </button>
            </div>

            {/* 모달창 */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white text-black p-6 rounded-lg text-center">
                        <p>{modalMessage}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-[#0147E5] text-white rounded-lg"
                            onClick={() => setShowModal(false)}
                            >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditNickname;
