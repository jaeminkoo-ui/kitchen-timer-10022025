
import { Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat1',
    name: 'PRE COOK',
    items: [
      { id: 'pc1', name: 'Wings', cookTime: 300 },
      { id: 'pc2', name: 'Boneless', cookTime: 240 },
      { id: 'pc3', name: 'Drumstick', cookTime: 360 },
      { id: 'pc4', name: 'Sandwich', cookTime: 180 },
    ],
  },
  {
    id: 'cat2',
    name: 'REGULAR COOK',
    items: [
      { id: 'rc1', name: 'Wings', cookTime: 480 },
      { id: 'rc2', name: 'Boneless', cookTime: 360 },
      { id: 'rc3', name: 'Drumstick', cookTime: 540 },
      { id: 'rc4', name: 'Sandwich', cookTime: 300 },
    ],
  },
  {
    id: 'cat3',
    name: 'FRESH COOK',
    items: [
      { id: 'fc1', name: 'Wings', cookTime: 600 },
      { id: 'fc2', name: 'Boneless', cookTime: 480 },
      { id: 'fc3', name: 'Drumstick', cookTime: 720 },
      { id: 'fc4', name: 'Sandwich', cookTime: 420 },
    ],
  },
  {
    id: 'cat4',
    name: 'SIDES',
    items: [
      { id: 's1', name: 'Fries', cookTime: 180 },
      { id: 's2', name: 'Cheese Ball', cookTime: 210 },
      { id: 's3', name: 'Mandoo', cookTime: 300 },
      { id: 's4', name: 'Gimmali', cookTime: 240 },
    ],
  },
];
