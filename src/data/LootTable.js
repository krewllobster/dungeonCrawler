import {randomInt} from './dungeons'

class LootTable {
  constructor(table = [], level = 0) {
    this.table = table
    this.level = level
  }

  clear() {
    this.table.length = 0
  }

  add(item, weight = 1) {
    this.table.push({item, weight})
  }

  choose() {
    if (this.table.length === 0) return null

    let totalWeight = 0

    this.table.forEach(item => {
      totalWeight += item.weight[this.level]
    })

    let choice
    let weight = 0
    let rng = randomInt([0, totalWeight])

    // for (let i = 0; i < this.table.length; i++) {
    //   weight += this.table[i].weight[this.level]
    //   if (rng <= weight)
    // }
    this.table.some((item, index) => {

      weight += item.weight[this.level]

      if (rng <= weight) {
        choice = index
        return true
      }

      return false
    })

    const chosenItem = this.table[choice]

    return chosenItem.item
  }
}

export default LootTable
