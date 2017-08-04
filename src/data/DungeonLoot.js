import LootTable from './LootTable'
import {randomInt} from './dungeons'
import {weapons, items, enemies} from './items'

class DungeonLoot {
  constructor(rooms = [], level = 0) {
    this.rooms = rooms.filter(room => room.constructor.name === "Room")
    const weaponLootTable = new LootTable(weapons, level)
    const enemyLootTable = new LootTable(enemies, level)
    this.items = new LootTable(items(weaponLootTable, enemyLootTable), level)
    this.allItems = []
  }

  print() {
    this.rooms.forEach(room => {
      console.log(room.position, room.room_size)
    })
  }

  rndRoomPos(room) {
    const {room_size, position} = room
    const [x, y] = room_size; const [xpos, ypos] = position
    const rndX = randomInt([0, x - 1]) + xpos
    const rndY = randomInt([0, y - 1]) + ypos
    return [rndX, rndY]
  }

  choose() {
    return this.items.choose()
  }

  populate() {
    const occupied = []
    this.rooms.forEach(room => {
      for (let i = 0; i <= randomInt([1,6]); i++) {
        let [x, y] = this.rndRoomPos(room)
        let [xpos, ypos] = room.position
        let [xs, ys] = room.room_size
        let item = this.choose()()
        let id = `${x}:${y}`
        if (item && !occupied.includes(id)) {
          this.allItems.push({...item, xpos: x, ypos: y, id})
          occupied.push(id)
        }
      }
    })
    return this.allItems
  }
}

export default DungeonLoot
