"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ImageCard, WordCard } from "../types/card";
import { ImageCardArt } from "./ImageCardArt";

interface CardViewProps {
  card?: ImageCard | WordCard | null;
  type?: "image" | "word";
  isFlipped?: boolean; // false = back, true = front
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg" | "responsive";
  showLabel?: boolean;
  interactive?: boolean;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  type = "image",
  isFlipped = true,
  onClick,
  className = "",
  size = "responsive",
  showLabel = false,
  interactive = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-28 h-[149px] text-xs",
    md: "w-48 h-[256px] text-sm",
    lg: "w-64 h-[341px] text-base",
    responsive: "w-full max-w-[280px] aspect-[3/4]",
  }[size];

  // 卡牌背面（精装艺术画册极简烫金线条风格）
  const renderCardBack = () => (
    <div className="w-full h-full rounded-2xl bg-[#282522] p-4 flex flex-col justify-between items-center border border-[#3E3A35] shadow-[0_12px_28px_-6px_rgba(20,18,16,0.2)] select-none relative overflow-hidden">
      {/* 细腻底纹线 */}
      <div className="absolute inset-2 border border-[#48423B]/60 rounded-xl pointer-events-none" />

      <div className="w-full flex justify-between items-center text-[10px] text-[#A69E94] tracking-widest font-serif uppercase z-10">
        <span>INSIGHT</span>
        <span>NO. 00</span>
      </div>

      <div className="w-24 h-32 rounded-xl border border-[#524B43] flex items-center justify-center relative p-3 z-10 bg-[#282522]">
        <div className="w-full h-full border border-dashed border-[#6B6258] rounded-lg flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full border border-[#DCE6D9]/60 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#DCE6D9]" />
          </div>
        </div>
        <div className="absolute -top-2 px-2.5 bg-[#282522] text-[9px] text-[#B8AEA3] tracking-widest font-serif">
          映见
        </div>
      </div>

      <div className="text-[10px] text-[#8C8377] tracking-wider z-10 font-sans">
        轻触翻开
      </div>
    </div>
  );

  // 卡牌正面
  const renderCardFront = () => {
    if (!card) return null;

    if (type === "image") {
      const imgCard = card as ImageCard;
      const hasImage = imgCard.imageUrl && !imageError;

      return (
        <div className="w-full h-full rounded-2xl bg-[#FAF8F4] p-2.5 flex flex-col justify-between border border-[#E5DEC9] shadow-[0_10px_28px_-4px_rgba(40,36,30,0.12)] overflow-hidden">
          <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-[#FAF6EE] border border-[#EBE4D5] flex items-center justify-center">
            {hasImage ? (
              <img
                src={imgCard.imageUrl}
                alt={imgCard.alt}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-opacity duration-500"
                loading="lazy"
              />
            ) : (
              <ImageCardArt svgName={imgCard.svgName} />
            )}
          </div>
          {showLabel && (
            <div className="pt-2 px-1 text-[11px] text-charcoal-600 truncate text-center tracking-wide font-sans">
              {imgCard.alt}
            </div>
          )}
        </div>
      );
    }

    if (type === "word") {
      const wordCard = card as WordCard;
      return (
        <div className="w-full h-full rounded-2xl bg-[#FBF9F5] p-5 flex flex-col justify-between items-center border border-[#DFD8C4] shadow-[0_10px_28px_-4px_rgba(40,36,30,0.12)] relative overflow-hidden">
          {/* 细腻的卡纸微边框 */}
          <div className="absolute inset-2 border border-[#EFE8DA] rounded-xl pointer-events-none" />

          <div className="w-full flex justify-between items-center text-[10px] text-charcoal-400 font-serif tracking-widest uppercase z-10">
            <span>WORD CARD</span>
            <span>{wordCard.pinyin}</span>
          </div>

          <div className="my-auto text-center z-10">
            <span className="text-3xl md:text-4xl font-serif text-charcoal-900 tracking-widest font-normal drop-shadow-xs">
              {wordCard.word}
            </span>
          </div>

          <div className="w-full pt-3 border-t border-[#ECE5D6] flex justify-between items-center text-[9px] text-charcoal-400 tracking-wider z-10">
            <span>联想词语</span>
            <span className="w-1.5 h-1.5 rounded-full bg-insight" />
          </div>
        </div>
      );
    }

    return null;
  };

  const flipTransition = shouldReduceMotion
    ? { duration: 0.1 }
    : { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

  return (
    <motion.div
      onClick={onClick}
      whileHover={interactive && !shouldReduceMotion ? { y: -4, scale: 1.02 } : {}}
      whileTap={interactive && !shouldReduceMotion ? { scale: 0.98 } : {}}
      className={`relative cursor-pointer transition-shadow select-none ${sizeClasses} ${className}`}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 0 : 180 }}
        transition={flipTransition}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 正面 */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          {renderCardFront()}
        </div>

        {/* 背面 */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {renderCardBack()}
        </div>
      </motion.div>
    </motion.div>
  );
};
