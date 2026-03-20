import { useState, useEffect } from 'react';
import { POSITION_SETS } from '@/components/ui/custom/positions';

type ShapePositions = { [key: number]: number };

interface UseShapePositionsReturn extends ShapePositions {}

/**
 * useShapePositions Hook
 * ======================
 * Manages random teleportation of SVG shapes between predefined position sets.
 * 
 * Features:
 * - Randomizes positions for each shape independently
 * - Respects available positions per shape (from POSITION_SETS)
 * - Updates at configurable interval (default: 4000ms)
 * - Properly cleans up intervals on unmount
 * 
 * @param shapeCount - Number of shapes to manage (default: 9)
 * @param updateInterval - Milliseconds between position updates (default: 4000)
 * @returns Object with shape IDs as keys and position indices as values
 */
export function useShapePositions(
  shapeCount: number = 9,
  updateInterval: number = 4000
): UseShapePositionsReturn {
  const [shapePositions, setShapePositions] = useState<ShapePositions>(() => {
    // Initialize all shapes at position 0
    const initial: ShapePositions = {};
    for (let i = 1; i <= shapeCount; i++) {
      initial[i] = 0;
    }
    return initial;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setShapePositions((prev) => {
        const newPositions = { ...prev };
        // Randomly teleport each shape to a new position
        for (let i = 1; i <= shapeCount; i++) {
          const positionCount = POSITION_SETS[i]?.length || 4;
          newPositions[i] = Math.floor(Math.random() * positionCount);
        }
        return newPositions;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [shapeCount, updateInterval]);

  return shapePositions;
}
