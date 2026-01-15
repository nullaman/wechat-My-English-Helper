import React from 'react';
import { WordData } from '../types';

interface WordCardProps {
  data: WordData;
}

const WordCard: React.FC<WordCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100 transition-transform active:scale-[0.98] duration-200">
      {/* Header Section */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{data.word}</h2>
        <p className="text-gray-500 text-sm mt-1">{data.definition_cn}</p>
        <p className="text-gray-400 text-xs mt-1 italic">{data.definition_en}</p>
      </div>

      {/* Separator Line */}
      <div className="h-px bg-gray-100 my-4 w-full"></div>

      {/* Examples Section */}
      <div className="space-y-2">
        <p className="text-gray-800 text-base leading-relaxed">
          {data.example_sentence_en}
        </p>
        <p className="text-gray-500 text-sm leading-relaxed">
          {data.example_sentence_cn}
        </p>
      </div>
    </div>
  );
};

export default WordCard;