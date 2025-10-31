import React from 'react';

interface EditingGuidesProps {
  logoSize: number;
  logoRotation: number;
  logoPositionX: number;
  logoPositionY: number;
}

const EditingGuides: React.FC<EditingGuidesProps> = ({
  logoSize,
  logoRotation,
  logoPositionX,
  logoPositionY,
}) => {
  return (
    <div
      className="absolute w-1/2 aspect-square pointer-events-none"
      style={{
        left: `calc(50% + ${logoPositionX / 2}%)`,
        top: `calc(50% + ${logoPositionY / 2}%)`,
        transform: `translate(-50%, -50%) rotate(${logoRotation}deg) scale(${logoSize / 100})`,
        transition: 'transform 0.1s linear, left 0.1s linear, top 0.1s linear',
      }}
      aria-hidden="true"
    >
      <div className="w-full h-full border-2 border-cyan-400/70 border-dashed rounded-lg relative">
        {/* Center cross */}
        <div className="absolute top-1/2 left-[10%] w-[80%] h-px bg-cyan-400/50"></div>
        <div className="absolute left-1/2 top-[10%] h-[80%] w-px bg-cyan-400/50"></div>
        {/* Rotation handle line */}
        <div className="absolute top-1/2 left-1/2 h-1/2 w-px bg-cyan-400/50 -translate-y-full"></div>
        {/* Rotation handle circle */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-cyan-400 bg-gray-800"></div>
      </div>
    </div>
  );
};

export default EditingGuides;
