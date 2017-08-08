export const weapons = [
  {item: {name: 'stick', attack: [0,2], level: 1}, weight: [50,30,10,0]},
  {item: {name: 'dagger', attack: [0,4], level: 2}, weight: [30, 15, 10, 5]},
  {item: {name: 'short sword', attack: [1,6], level: 3}, weight: [15, 20, 30, 40]},
  {item: {name: 'bastard sword', attack: [2,8], level: 4}, weight: [4, 10, 15, 20]},
  {item: {name: 'polearm', attack: [3,12], level: 5}, weight: [3, 5, 10, 15]},
  {item: {name: 'vorpal sword', attack: [4, 24], level: 6}, weight: [1,1,3,6]}
]

export const enemies = [
  {item: {name: 'giant rat', damage: [0,4], hp: 5, exp: 20}, weight:        [50,20,10,0 ]},
  {item: {name: 'kobold', damage: [0,6], hp: 8, exp: 50}, weight:           [30,15,10,5 ]},
  {item: {name: 'giant spider', damage: [1,8], hp: 10, exp: 75}, weight:     [15,20,30,40]},
  {item: {name: 'ghost', damage: [2,10], hp: 20, exp: 150}, weight:         [4 ,10,15,20]},
  {item: {name: 'wyvern', damage: [4,12], hp: 40, exp: 500}, weight:        [1 ,5 ,10,15]},
  {item: {name: 'black dragon', damage: [6,20], hp: 80, exp: 4000}, weight: [0 ,0 ,2 ,3 ]}
]

export const items = (wepTable, enemyTable) => {
  return [
    {item: () => {return {type: 'torch', color: 'orange', message: 'You found a torch! The darkness shrinks away...'}}, weight: [5,5,5,5]},
    {item: () => {return {type: 'health', color: 'green', message: 'You eat a mushroom and feel stronger'}}, weight: [2,2,1,1]},
    {item: () => {
      let wep = wepTable.choose()
      return {...wep, type: 'weapon', color: 'brown', message: `You picked up a ${wep.name}!`}
    }, weight: [6,5,5,5]},
    {item: () => {
      let enemy = enemyTable.choose()
      return {
        ...enemy, type: 'enemy', color: 'red', message: `You picked a fight with a ${enemy.name}`}
      }, weight: [5,6,7,8]},
    {item: () => {return null}, weight: [15,15,15,15]}
  ]
}
