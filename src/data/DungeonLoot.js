import LootTable from './LootTable'
import {randomInt} from './dungeons'
import {weapons, items, enemies} from './items'

class DungeonLoot {
  constructor(walls = [], level = 0) {
    const weaponLootTable = new LootTable(weapons, level)
    const enemyLootTable = new LootTable(enemies, level)
    this.items = new LootTable(items(weaponLootTable, enemyLootTable), level)
  }

  rndRoomPos(room) {
    const {room_size, position} = room
    const [x, y] = room_size; const [xpos, ypos] = position
    return [randomInt([0, x - 1]) + xpos, randomInt([0, y - 1]) + ypos]
  }

  choose() {
    return this.items.choose()
  }

  populate(room) {
    const occupied = []
    const roomItems = []
    for (let i = 0; i <= randomInt([1,6]); i++) {
      let [x, y] = this.rndRoomPos(room)
      let item = this.choose()()
      let id = `${x}:${y}`
      if (item && !occupied.includes(id)) {
        roomItems.push({...item, xpos: x, ypos: y, id})
        occupied.push(id)
      }
    }
    return roomItems
  }
}

export default DungeonLoot
