// Predefined position sets and Hero Shapes component
import React from 'react';
import bluefadedtetris from '@/assets/bg/bluefadedtetris.svg';
import bluesingletetris from '@/assets/bg/bluesingletetris.svg';
import blueTetris from '@/assets/bg/bluetetris.svg';
import greensingletetris from '@/assets/bg/greensingletetris.svg';
import greenTetris from '@/assets/bg/greentetris.svg';
import redsingletetris from '@/assets/bg/redsingletetris.svg';
import redTetris from '@/assets/bg/redtetris.svg';
import yellowsingletetris from '@/assets/bg/yellowsingletetris.svg';
import yellowTetris from '@/assets/bg/yellowtetris.svg';

export const POSITION_SETS: { [key: number]: Array<{ position: string; top?: string; right?: string; bottom?: string; left?: string }> } = {
  1: [
    { position: 'absolute', top: '4px', left: '4px' },
    { position: 'absolute', top: '2%', left: '8%' },
    { position: 'absolute', top: '10%', left: '2%' },
    { position: 'absolute', top: '15%', left: '12%' },
  ],
  2: [
    { position: 'absolute', top: '8px', right: '24px' },
    { position: 'absolute', top: '5%', right: '8%' },
    { position: 'absolute', top: '12%', right: '15%' },
    { position: 'absolute', top: '3%', right: '5%' },
  ],
  3: [
    { position: 'absolute', bottom: '32px', right: '32px' },
    { position: 'absolute', bottom: '10%', right: '12%' },
    { position: 'absolute', bottom: '5%', right: '8%' },
    { position: 'absolute', bottom: '15%', right: '18%' },
  ],
  4: [
    { position: 'absolute', bottom: '16px', left: '24px' },
    { position: 'absolute', bottom: '8%', left: '10%' },
    { position: 'absolute', bottom: '12%', left: '15%' },
    { position: 'absolute', bottom: '5%', left: '8%' },
  ],
  5: [
    { position: 'absolute', top: '25%', left: '-16px' },
    { position: 'absolute', top: '20%', left: '0px' },
    { position: 'absolute', top: '30%', left: '4px' },
    { position: 'absolute', top: '18%', left: '-8px' },
  ],
  6: [
    { position: 'absolute', bottom: '33%', right: '-8px' },
    { position: 'absolute', bottom: '30%', right: '8px' },
    { position: 'absolute', bottom: '40%', right: '0px' },
    { position: 'absolute', bottom: '25%', right: '4px' },
  ],
  7: [
    { position: 'absolute', top: '8px', right: '25%' },
    { position: 'absolute', top: '2%', right: '28%' },
    { position: 'absolute', top: '5%', right: '22%' },
    { position: 'absolute', top: '10%', right: '30%' },
  ],
  8: [
    { position: 'absolute', bottom: '0px', left: '33%' },
    { position: 'absolute', bottom: '2%', left: '30%' },
    { position: 'absolute', bottom: '5%', left: '35%' },
    { position: 'absolute', bottom: '-4px', left: '32%' },
  ],
  9: [
    { position: 'absolute', top: '33%', right: '0px' },
    { position: 'absolute', top: '30%', right: '4px' },
    { position: 'absolute', top: '38%', right: '8px' },
    { position: 'absolute', top: '28%', right: '-4px' },
  ],
};

// Shape configuration
const shapeConfigs = [
  { src: bluefadedtetris, alt: 'Blue Faded Tetris', size: 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20', index: 1 },
  { src: bluesingletetris, alt: 'Blue Single Tetris', size: 'w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16', index: 2 },
  { src: blueTetris, alt: 'Blue Tetris', size: 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20', index: 3 },
  { src: greensingletetris, alt: 'Green Single Tetris', size: 'w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16', index: 4 },
  { src: greenTetris, alt: 'Green Tetris', size: 'w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18', index: 5 },
  { src: redsingletetris, alt: 'Red Single Tetris', size: 'w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16', index: 6 },
  { src: redTetris, alt: 'Red Tetris', size: 'w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18', index: 7 },
  { src: yellowsingletetris, alt: 'Yellow Single Tetris', size: 'w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16', index: 8 },
  { src: yellowTetris, alt: 'Yellow Tetris', size: 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20', index: 9 },
];

interface HeroShapesProps {
  shapePositions: { [key: number]: number };
}

export function HeroShapes({ shapePositions }: HeroShapesProps) {
  return (
    <>
      {shapeConfigs.map((shape) => (
        <div
          key={shape.index}
          className={`${shape.size} opacity-60 z-0`}
          style={POSITION_SETS[shape.index][shapePositions[shape.index]] as React.CSSProperties}
        >
          <img src={shape.src} alt={shape.alt} className="w-full h-full object-contain" />
        </div>
      ))}
    </>
  );
}
