import { Coordinates } from '../types';
import { SHOP_LOCATION } from '../constants';

// In a real app, this would be a database. 
// We will manage this state in the top-level App component, 
// but we define helper logic here to simulate "server-side" calculations.

export const calculateDistance = (p1: Coordinates, p2: Coordinates): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const interpolatePosition = (
  start: Coordinates,
  end: Coordinates,
  progress: number // 0 to 1
): Coordinates => {
  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress,
  };
};

// Simulate finding a nearby rider
export const findNearbyRider = (): Coordinates => {
  // Random start point near shop for simulation
  return {
    x: SHOP_LOCATION.x + (Math.random() * 10 - 5),
    y: SHOP_LOCATION.y + (Math.random() * 10 - 5)
  };
};