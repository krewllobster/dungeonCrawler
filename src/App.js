import React, { Component } from 'react'
import InfoBar from './components/InfoBar'
import NewCanvas from './components/newCanvas'
import extendDungeon from './data/dungeonExtend'
import Messages from './components/Messages'
import {randomInt} from './data/utils'

class App extends Component {
  constructor() {
    super()

    this.state = {
      dungeon: null,
      char: null,
      weapon: null,
      messages: [],
      attempt: 0,
      win: false,
    }
    this.setTorch = this.setTorch.bind(this)
    this.itemCollision = this.itemCollision.bind(this)
    this.combat = this.combat.bind(this)
    this.init = this.init.bind(this)
  }

  componentWillMount() {
    this.init(0)
  }

  setTorch(val) {
    this.setState(prevState => {
      let newTorch = prevState.char.torch + val < 1 ? 1 : prevState.char.torch + val
      return {
        char: {...prevState.char, torch: newTorch}
      }
    })
  }

  itemCollision(item) {
    let charMerge = {}
    let newWeapon = {}
    let message
    let win = false
    let {health, maxHealth} = this.state.char
    let {level} = this.state.weapon
    switch (item.type) {
      case 'exit':
        message = 'You stumble out of a steep staircase -- the door closes behind you'
        this.init(this.state.dungeon.level + 1)
        break
      case 'boss':
        const {bossChar} = this.bossFight()
        if (bossChar.alive) {
          message = 'You found the Big Boss in his lair and slew him. You win!'
          win = true
        } else {
          message = 'You found the Big Boss, but he proved too strong and sliced you in half. You died'
        }
        charMerge = bossChar
        break
      case 'torch':
        charMerge.torch = 100
        message = item.message
        break
      case 'weapon':
        if(item.level > level) {
          newWeapon = item
          message = item.message
        } else if (item.level === level) {
          message = `You toss away another ${item.name}`
        } else {
          message = `You toss aside a ${item.name}.`
        }
        break
      case 'enemy':
        const {newChar, newMessage} = this.combat(item)
        charMerge = newChar
        message = newMessage
        break
      case 'health':
        let newHealth = Math.min(maxHealth + 4, health + 8)
        charMerge.health = newHealth
        charMerge.maxHealth = maxHealth + 4
        message = item.message
        break;
      default: break;
    }
    this.setState(prevState => {
      return {
        char: {...prevState.char, ...charMerge},
        weapon: {...prevState.weapon, ...newWeapon},
        messages: [...prevState.messages, message],
        win
      }
    })
  }
  bossFight() {
    const boss = {name: 'The Big Boss', hp: '150', damage: [5,25], exp: 10000}
    let {damage, hp} = boss
    let {health, level, torch} = this.state.char
    let {attack} = this.state.weapon
    while (health > 0 && hp > 0) {
      if (torch <= 50) {
        health -= randomInt(damage)
        hp -= randomInt(attack)*level
      } else {
        hp -= randomInt(attack)*level
        if (hp <= 0) {break}
        health -= randomInt(damage)
      }
    }
    return {
      bossChar: {
        health: health, alive: health > 0
      }
    }
  }

  combat(enemy) {
    let {health, exp, level, torch} = this.state.char
    let {attack} = this.state.weapon
    let {damage, hp} = enemy
    const progression = [0,100,200,400,800,1600,3200,6400,12800,25600,50000,100000,200000]
    while (health > 0 && hp > 0) {
      if (torch <= 50) {
        health -= randomInt(damage)
        hp -= randomInt(attack)*level
      } else {
        hp -= randomInt(attack)*level
        if (hp <= 0) {break}
        health -= randomInt(damage)
      }
    }
    let newLevel = progression.findIndex(i => i > exp+enemy.exp)
    return {
      newChar: {
        health: health, alive: health > 0,
        exp: exp += enemy.exp,
        level: newLevel,
      },
      newMessage: `You ${health <= 0 ? 'died to' : 'vanquished'} a ${enemy.name}!`
    }
  }

  init(level) {
    const dungeon = new extendDungeon(level)
    let char; let weapon
    if (level !== 0) {
      char = this.state.char
      weapon = this.state.weapon
    } else {
      char =  {
        exp: 0,
        health: 20,
        maxHealth: 20,
        torch: 100,
        alive: true,
        level: 1,
      }
      weapon = {
        name: 'fists',
        attack: [0,2],
        level: 0,
      }
    }
    let messages = []
    if(level===0) {messages.push('Welcome to Rogue-Like. Green = health, Brown = weapon, Yellow = Torch, and Red = enemy. Blue takes you down a level. If you get lost, press "L"','Make sure you fight in the light! Enemies strike first when your torch is half gone!')}
    messages.push(`You are starting level ${level + 1}`)
    let {attempt} = this.state
    if (level === 0) {attempt += 1}
    this.setState({
      dungeon, char, weapon, messages, attempt
    })
  }

  render() {

    const flexStyle = {
      backgroundColor: 'black',
      height: '100vh',
      width: '100%',
    }

    let {char, weapon, attempt, win} = this.state

    return (
      <div
        className="App"
        style={flexStyle}
      >
        <InfoBar char={char} weapon={weapon} attempt={attempt}/>
        <div style={{width: '400px', height: '400px', margin: 'auto'}}>
          <NewCanvas
            dungeon={this.state.dungeon}
            itemCollision={this.itemCollision}
            torch={this.state.char.torch}
            setTorch={this.setTorch}
            alive={this.state.char.alive}
            charLevel={this.state.char.level}
            init={this.init}
            win={win}
          />
        </div>
        <Messages messages={[...this.state.messages].reverse()} />
      </div>
    );
  }
}

export default App;
