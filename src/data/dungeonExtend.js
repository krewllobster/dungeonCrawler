import Dungeon from 'dungeon-generator'
import LootTable from './LootTable'
import {weapons, items, enemies} from './items'
import {randomInt} from './utils'


class extendDungeon extends Dungeon {

  constructor(level) {

    let options = {
      size: [50, 60],
      rooms: {
        initial: {
          min_size: [3,3],
          max_size: [6,6],
          max_exits: 4
        },
        any: {
          min_size: [5,5],
          max_size: [15,15],
          max_exits: 4,
        }
      },
      max_corridor_length: 10,
      min_corridor_length: 2,
      corridor_density: 0.8,
      symmetric_rooms: false,
      interconnects: 5,
      max_interconnect_length: 20,
      room_count: 20
    }

    super(options)

    this.level = level
    this.allItems = []

    const weaponLootTable = new LootTable(weapons, level)
    const enemyLootTable = new LootTable(enemies, level)
    this.items = new LootTable(items(weaponLootTable, enemyLootTable), level)

    this.generate()

    this.genItems()

    console.log(this)
  }

  genItems() {
    let occupied = [this.genId(this.start_pos)]

    this.children.map(child => {
      const {tag, position, room_size} = child
      let roomItems = []
      if (tag === "any") {
        for (let i = 1; i < 7; i ++) {
          const itemRoomPos = this.randomPos(room_size)
          const itemGlobalPos = this.randomPos(room_size, position)
          const itemId = this.genId(itemGlobalPos)
          const item = this.items.choose()()

          if (!occupied.includes(itemId) && item) {
            occupied.push(itemId)
            this.allItems.push({...item, xpos: itemGlobalPos[0], ypos: itemGlobalPos[1], id: itemId})
            roomItems.push({...item, xpos: itemRoomPos[0], ypos: itemRoomPos[1], id: itemId})
          }
        }
      }
      child.items = roomItems
      return child
    })
  }

  getRooms() {
    return this.children
  }

  getItems() {
    return this.allItems
  }

  getSize() {
    return this.size
  }

  getPos() {
    return this.start_pos
  }

  getCollision() {
    return this.walls.rows
  }

  genId([x, y]) {
    return `${x}:${y}`
  }

  randomPos([x, y], [xpos, ypos] = [0,0]) {
    const rndX = randomInt([0, x - 1]) + xpos
    const rndY = randomInt([0, y - 1]) + ypos
    return [rndX, rndY]
  }

}

export default extendDungeon
