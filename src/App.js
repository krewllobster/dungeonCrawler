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
    let {health, maxHealth} = this.state.char
    let {level} = this.state.weapon
    switch (item.type) {
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
        messages: [...prevState.messages, message]
      }
    })
  }

  combat(enemy) {
    let {health, exp, level, torch} = this.state.char
    let {attack} = this.state.weapon
    let {damage, hp} = enemy
    const progression = [0,100,200,400,800,1600,3200,6400,12800,25600]
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
    console.log(exp + enemy.exp, progression.findIndex(i => i > exp+enemy.exp))
    let newLevel = progression.findIndex(i => i > exp+enemy.exp)
    console.log(newLevel)
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
    this.setState({
      dungeon, char, weapon,
      messages: ['Welcome to Rogue-Like.\nGreen = health, Brown = weapon\nYellow = Torch, and Red = enemy\nBlue takes you down a level\nIf you get lost, press "l"','Make sure you fight in the light! Enemies strike first when your torch is half gone!',`You are starting level ${level + 1}`]})
  }

  render() {

    const flexStyle = {
      backgroundColor: 'black',
      height: '100vh',
      width: '100%',
    }

    let {char, weapon} = this.state

    return (
      <div
        className="App"
        style={flexStyle}
      >
        <InfoBar char={char} weapon={weapon} />
        <div style={{width: '400px', height: '400px', margin: 'auto'}}>
          <NewCanvas
            dungeon={this.state.dungeon}
            itemCollision={this.itemCollision}
            torch={this.state.char.torch}
            setTorch={this.setTorch}
            alive={this.state.char.alive}
            charLevel={this.state.char.level}
            init={this.init}
          />
        </div>
        <Messages messages={[...this.state.messages].reverse()} />
      </div>
    );
  }
}

export default App;
