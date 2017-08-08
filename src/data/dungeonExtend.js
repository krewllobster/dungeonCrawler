import Dungeon from 'dungeon-generator'
import LootTable from './LootTable'
import {weapons, items, enemies} from './items'
import {randomInt} from './utils'


class extendDungeon extends Dungeon {

  constructor(level) {

    let options = {
      size: [30+level*10, 40+level*10],
      rooms: {
        initial: {
          min_size: [3,3],
          max_size: [6,6],
          max_exits: 4
        },
        any: {
          min_size: [5,5],
          max_size: [10,10],
          max_exits: 4,
        }
      },
      max_corridor_length: 6,
      min_corridor_length: 2,
      corridor_density: 0.8,
      symmetric_rooms: false,
      interconnects: 10,
      max_interconnect_length: 10,
      room_count: 15+level*5
    }

    super(options)

    this.level = level
    this.allItems = []
    this.exit = null

    const weaponLootTable = new LootTable(weapons, level)
    const enemyLootTable = new LootTable(enemies, level)
    this.items = new LootTable(items(weaponLootTable, enemyLootTable), level)

    this.generate()

    this.genExit()

    this.genItems()

    console.log(this)
  }

  genItems() {
    let occupied = [this.genId(this.start_pos), this.genId(this.exit)]

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

  genExit() {
    let c = [...this.children].filter(child => child.tag === 'any')
    let r = randomInt([1,c.length-1])
    let exitRoom = c[r]
    let {position, room_size} = exitRoom
    let rndX = position[0] + randomInt([1,room_size[0]-1])
    let rndY = position[1] + randomInt([1,room_size[1]-1])
    this.exit = [rndX, rndY]
  }

  getExit() {
    return this.exit
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

  getLevel() {
    return this.level
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
