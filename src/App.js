import React, { Component } from 'react'
import InfoBar from './components/InfoBar'
import CanvasBoard from './components/CanvasBoard'
import Dungeon from 'dungeon-generator'
import Messages from './components/Messages'
import {level} from './data/dungeons'
import DungeonLoot from './data/DungeonLoot'

class App extends Component {
  constructor() {
    super()

    this.state = {
      character: {
        health: 20,
        maxHealth: 20,
        level: 1,
        experience: 0,
        torch: 100,
        pos: null,
      },
      dungeon: {
        walls: [],
        room: null,
        size: null,
        start: null,
        children: null
      },
      weapon: {
        name: 'fists',
        attack: [0,1],
        level: -1,
      },
      items: [],
      floor: 0,
      messages: []
    }
  }

  componentWillMount() {
    this.setState({messages: [...this.state.messages, 'Use arrow keys to move. Orange marks are torches, brown are weapons, green heals, and red are enemies (watch out!)']})
    this.generateDungeon(0)
    document.addEventListener("keydown", this.handleKeyDown.bind(this), false)
  }

  generateDungeon(floor) {
    let d = new Dungeon(level(60,50))
    d.generate()
    const loot = new DungeonLoot(d.children, floor)
    loot.populate()

    const items = loot.allItems
    this.setState(prevState => {
      return {
        character: {...prevState.character, pos: d.start_pos},
        dungeon: {
          walls: d.walls.rows,
          room: d.initial_room,
          size: d.size,
          start: d.start_pos,
          children: d.children,
        },
      floor,
      items,
      }
    })
  }

  setVal(val, values, message) {
    this.setState(prevState => {
      return {
        [val]: {...prevState[val], ...values},
        messages: [...prevState.messages, message]
      }
    })
  }

  checkCollision(pos) {
    const {items} = this.state

    let id = `${pos[0]}:${pos[1]}`
    let item = items.find(item => item.id === id)

    if(item) {
      let {health, maxHealth} = this.state.character
      let newItems = [...this.state.items].filter(item => item.id !== id)
      switch(item.type) {
        case 'torch':
          this.setVal('character', {torch: 120}, item.message)
          break
        case 'health':
          health = health + 8 > maxHealth + 2 ? maxHealth + 2 : health + 8
          this.setVal('character', {health, maxHealth: maxHealth + 2}, item.message)
          break
        case 'weapon':
          if (item.level > this.state.weapon.level) {
            this.setVal('weapon', {weapon: item}, item.message)
          }
          break
        case 'enemy':
          this.resolveCombat(item)
          this.setVal('character', {}, item.message)
          break
        default:
          break
      }
      this.setState({
        items: newItems
      })
    }
  }

  resolveCombat(enemy) {
    let {health, level} = this.state.character
    let {damage} = this.state.weapon
    console.log('you fight!')
  }

  handleKeyDown(event) {
    const {pos} = this.state.character
    let [x, y] = pos
    const {walls} = this.state.dungeon
    let keys = ['ArrowUp', 'ArrowRight', 'ArrowLeft', 'ArrowDown']
    if (keys.includes(event.key)) {
      switch(event.key) {
        case 'ArrowUp': y -= 1; break
        case 'ArrowDown': y += 1; break
        case 'ArrowRight': x += 1; break
        case 'ArrowLeft': x -= 1; break
        default: break
      }
      if (!walls[y+1][x+1]) {
        this.checkCollision([x, y])
        this.setState(prevState => {
          let {torch} = prevState.character
          let newTorch = torch > 1 ? torch - 1 : torch
          return {
            character: {
              ...prevState.character,
              torch: newTorch,
              pos: [x,y]
            }
          }
        })
      }
    }
  }

  render() {

    const flexStyle = {
      display: 'flex',
      flexFlow: 'column',
      height: '100vh',
    }
    const {items, messages} = this.state
    const {size, children} = this.state.dungeon
    const {pos, ...rest} = this.state.character
    const {torch} = this.state.character

    return (
      <div
        className="App"
        style={flexStyle}
        onKeyDown={this.handleKey}
      >
        <InfoBar
          char={rest}
          floor={this.state.floor}
        />
        <CanvasBoard
          rooms={children}
          size={size}
          pos={pos}
          torch={torch}
          items={items}
        />
        <Messages messages={messages} />
      </div>
    );
  }
}

export default App;
