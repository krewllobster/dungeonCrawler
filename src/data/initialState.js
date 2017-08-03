export const initialCharacterState = {
  health: 20,
  maxHealth: 20,
  level: 1,
  experience: 0,
  torch: 100,
  pos: [0,0],
}

export const initialDungeonState = {
  walls: [],
  room: null,
  size: [0,0],
  start: [0,0],
  children: null
}

export const initialWeaponState = {
  name: 'fists',
  attack: [0,1],
  level: 0,
}
