// components/LuckyWheelModal.jsx (PHẦN QUAN TRỌNG ĐÃ SỬA)

import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, } from 'zmp-ui';
// import confetti from 'canvas-confetti';
// const fireConfetti = () => {
//   const count = 200;
//   const defaults = {
//     origin: { y: 0.7 }
//   };

//   function fire(particleRatio, opts) {
//     confetti({
//       ...defaults,
//       ...opts,
//       particleCount: Math.floor(count * particleRatio)
//     });
//   }

//   fire(0.25, { spread: 26, startVelocity: 55 });
//   fire(0.2, { spread: 60 });
//   fire(0.35, { spread: 100, decay: 0.91 });
//   fire(0.1, { spread: 120, startVelocity: 25 });
//   fire(0.1, { spread: 120, startVelocity: 45 });
// };

const LuckyWheelModal = ({
    visible,
    onClose,
    prizes = [],
    targetPrize = null,
    onSpinEnd,
    size = 300,
    maxSpins = 0, // số lượt quay tối đa
    handleSpinEnd

}) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [hasSpun, setHasSpun] = useState(false);
    const [resultPrize, setResultPrize] = useState(null);
    const [resultPrizeList, setResultPrizeList] = useState(null);
    const wheelRef = useRef(null);
    const currentRotation = useRef(0);

    const numPrizes = prizes.length;
    const anglePerPrize = 360 / numPrizes;

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9', '#74B9FF', '#A29BF6'];
    const [spinCount, setSpinCount] = useState(0);


    useEffect(() => {
        if (visible) {
            setHasSpun(false);
            setResultPrize(null);
            setIsSpinning(false);
            setResultPrizeList(null);
            setSpinCount(0); // reset lượt quay
            if (wheelRef.current) {
                wheelRef.current.style.transition = 'none';
                wheelRef.current.style.transform = 'rotate(0deg)';
                currentRotation.current = 0;
            }
        }
    }, [visible]);

    // ✅ HÀM SPIN MỚI - CHÍNH XÁC
    const spin = () => {
        console.log('🚀 Spin button clicked',targetPrize);


        if (isSpinning || hasSpun) return;

        setIsSpinning(true);
        if (spinCount >= maxSpins) {
            alert('Bạn đã hết lượt quay!');
            return;
        }
        // Tìm index của phần thưởng muốn trúng
        let targetIndex = 0;
        if (targetPrize) {
            if ( targetPrize&& targetPrize.length > 0) {
                targetIndex =targetPrize[spinCount] ;
            } 
        } else {
            targetIndex = Math.floor(Math.random() * numPrizes);
        }

        // ✅ CÔNG THỨC ĐÚNG - Chuẩn hóa góc dương
        // Góc để mũi tên (ở vị trí 12h) chỉ vào GIỮA ô targetIndex
        let targetMiddleAngle = 360 - (targetIndex * anglePerPrize + anglePerPrize / 2);
        targetMiddleAngle = ((targetMiddleAngle % 360) + 360) % 360;


        // Số vòng quay thêm (3-6 vòng)
        const extraSpins = 360 * (3 + Math.floor(Math.random() * 4));

        // Tính góc cần quay thêm từ vị trí hiện tại
        const currentAngle = ((currentRotation.current % 360) + 360) % 360;
        let deltaAngle = targetMiddleAngle - currentAngle;

        // Đảm bảo deltaAngle dương (quay theo chiều kim đồng hồ)
        if (deltaAngle <= 0) deltaAngle += 360;

        // Góc quay cuối cùng
        const finalRotation = currentRotation.current + extraSpins + deltaAngle;

        console.log(`🎯 Target: ${prizes[targetIndex]?.name}`);
        console.log(`🎯 Target middle angle: ${targetMiddleAngle}°`);
        console.log(`🎯 Current angle: ${currentAngle}°`);
        console.log(`🎯 Delta angle: ${deltaAngle}°`);
        console.log(`🎯 Extra spins: ${extraSpins}°`);
        console.log(`🎯 Final rotation: ${finalRotation}°`);

        const wheel = wheelRef.current;
        wheel.style.transition = 'transform 2.5s cubic-bezier(0.25, 0.1, 0.15, 1)';
        wheel.style.transform = `rotate(${finalRotation}deg)`;
        currentRotation.current = finalRotation;

        setTimeout(() => {
            setIsSpinning(false);
            //setHasSpun(true);
            wheel.style.transition = 'none';

            const wonPrize = prizes[targetIndex];
            setResultPrize(wonPrize);
            setResultPrizeList(prev => [...(prev || []), wonPrize]);
            console.log(`🎉 Bạn đã trúng: ${wonPrize.name}`);
            setSpinCount(prev => prev + 1);

            // fireConfetti(); // 🎉 gọi ở đây

            // if (onSpinEnd) onSpinEnd(wonPrize);
        }, 2500);
    };
    const handleClose = () => {
        if (isSpinning) {
            // showToast({ message: 'Vòng quay đang chạy, vui lòng đợi!', type: 'warning' });
            return;
        }
        onClose();
    };

    // Render các slice SVG
    const renderSlices = () => {
        const radius = size / 2;
        const center = radius;

        return prizes.map((prize, i) => {
            const startAngle = i * anglePerPrize - 90;
            const endAngle = (i + 1) * anglePerPrize - 90;
            const midAngle = startAngle + anglePerPrize / 2;

            const startRad = startAngle * Math.PI / 180;
            const endRad = endAngle * Math.PI / 180;

            const textRadius = radius * 0.65;
            const textX = center + textRadius * Math.cos(midAngle * Math.PI / 180);
            const textY = center + textRadius * Math.sin(midAngle * Math.PI / 180);

            return (
                <g key={i}>
                    <path
                        d={`M ${center} ${center} L ${center + radius * Math.cos(startRad)} ${center + radius * Math.sin(startRad)} A ${radius} ${radius} 0 0 1 ${center + radius * Math.cos(endRad)} ${center + radius * Math.sin(endRad)} Z`}
                        fill={colors[i % colors.length]}
                        stroke="#fff"
                        strokeWidth="2"
                    />
                    <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#fff"
                        fontSize="11"
                        fontWeight="bold"
                        transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                    >
                        {(() => {
                            // Tách tên giải thưởng thành 2 dòng nếu quá dài
                            const maxLen = 18;
                            const name = prize.name;
                            if (name.length <= maxLen) {
                                return <tspan x={textX} dy="0">{name}</tspan>;
                            }
                            // Tìm vị trí cắt gần nhất là khoảng trắng
                            let splitIdx = name.lastIndexOf(' ', Math.floor(name.length / 2));
                            if (splitIdx === -1 || splitIdx < 6) splitIdx = maxLen; // fallback nếu không có khoảng trắng hợp lý
                            const firstLine = name.slice(0, splitIdx).trim();
                            const secondLine = name.slice(splitIdx).trim();
                            return (
                                <>
                                    <tspan x={textX} dy="-7">{firstLine}</tspan>
                                    <tspan x={textX} dy="14">{secondLine.length > maxLen ? secondLine.slice(0, maxLen - 1) + '…' : secondLine}</tspan>
                                </>
                            );
                        })()}
                    </text>
                </g>
            );
        });
    };

    return (
        <Modal
            visible={visible}
           // onClose={handleClose}
            modalClassName="lucky-wheel-modal"
            showCloseButton={!isSpinning}
            maskClosable={!isSpinning}
        >
            <div style={{ padding: '0px', textAlign: 'center' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '22px' }}>
                    🎡 Vòng quay may mắn
                </h2>


                <div style={{ marginBottom: '20px', color: '#666', fontWeight: 'bold' }}>
                    🎯 Còn {maxSpins - spinCount} lượt quay
                </div>
                {!hasSpun && (
                    <div style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
                        {/* Quay ngay để nhận quà khủng! */}
                    </div>
                )}
                {resultPrize && (
                    <div style={{
                        // background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
                        color: 'red',
                        padding: '14px',
                        borderRadius: '14px',
                        marginBottom: '15px'
                    }}>
                        🎁 {resultPrize.name}
                    </div>
                )}


                {/* Vòng quay */}
                <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
                    <div
                        ref={wheelRef}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                            background: '#fff',
                        }}
                    >
                        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                            {renderSlices()}
                            <circle cx={size / 2} cy={size / 2} r={size * 0.1} fill="#fff" stroke="#ddd" strokeWidth="3" />
                        </svg>
                    </div>

                    {/* Mũi tên chỉ */}
                    <div style={{
                        position: 'absolute',
                        top: '-18px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '18px solid transparent',
                        borderRight: '18px solid transparent',
                        borderTop: '35px solid #FF4757',
                        zIndex: 10,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    }} />

                    {/* Điểm trung tâm */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: size * 0.12,
                        height: size * 0.12,
                        background: '#fff',
                        borderRadius: '50%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        zIndex: 5,
                    }} />
                </div>

                {/* Nút quay / Đóng */}
                <div style={{ textAlign: 'center', marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    {spinCount < maxSpins ? (
                        <Button
                            onClick={spin}
                            disabled={isSpinning || spinCount >= maxSpins}
                        >
                            {isSpinning
                                ? 'Đang quay...'
                                : spinCount >= maxSpins
                                    ? 'Hết lượt'
                                    : 'QUAY NGAY'}
                        </Button>

                    ) : (
                        <>
                            <Button onClick={() => {
                                //  showToast({ message: 'Vui lòng liên hệ CSKH để nhận quà!', type: 'info' });
                                console.log('🎁 Liên hệ CSKH để nhận quà!',resultPrizeList);
                                handleSpinEnd(resultPrizeList);

                            }}>
                                🎁 Nhận quà
                            </Button>
                        </>
                    )}
                </div>
                {/* hiện lại ds trúng thưởng */}
                {resultPrizeList && resultPrizeList.length > 0 && (
                    <div style={{ marginTop: '20px', textAlign: 'left', maxHeight: '150px', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Danh sách phần thưởng đã trúng:</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {resultPrizeList.map((prize, index) => (
                                <li key={index} style={{
                                    background: 'linear-gradient(45deg, #74b9ff, #a29bfe)',
                                    color: '#fff',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    fontSize: '14px'
                                }}>
                                    🎁 {prize.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}


            </div>
        </Modal>
    );
};

export default LuckyWheelModal;