import React, { Component } from 'react'
import update from 'immutability-helper'
import InfoBar from './components/InfoBar'
import CanvasBoard from './components/CanvasBoard'
import Dungeon from 'dungeon-generator'
import {level, randomInt, randomPct} from './data/dungeons'
import {itemDropTable} from './data/items'

class App extends Component {
  constructor() {
    super()

    this.state = {
      character: {
        health: 100,
        maxHealth: 100,
        level: 0,
        experience: 0,
        weapon: 'stick',
        attack: 7,
        torch: 100,
        pos: null,
      },
      dungeon: {
        walls: [],
        room: null,
        size: null,
        start: null,
        children: null,
      },
      items: [],
      itemCollision: [],
      floor: 0
    }
  }

  componentWillMount() {
    this.generateDungeon()
    document.addEventListener("keydown", this.handleKeyDown.bind(this), false)
  }

  generateDungeon() {
    let d = new Dungeon(level(60,60))
    d.generate()
    this.setState(prevState => {
      return {
        character: {...prevState.character, pos: d.start_pos},
        dungeon: {
          walls: d.walls.rows,
          room: d.initial_room,
          size: d.size,
          start: d.start_pos,
          children: d.children,
        }
      }
    })
    this.generateItems(d.children)
  }

  generateItems(rooms) {
    const onlyRooms = rooms.filter(room => room.constructor.name === "Room")

    const rndRoomPos = (room) => {
      const {room_size, position} = room
      let [x, y] = room_size
      let [xpos, ypos] = position
      return [randomInt(0, x - 1) + xpos, randomInt(0, y - 1) + ypos]
    }

    let allItems = []
    let allItemLocations = []

    onlyRooms.forEach(room => {
      itemDropTable.forEach(item => {
        if (randomPct(item.percent)) {
          let itemPos = rndRoomPos(room)
          if (!allItemLocations.includes(itemPos)) {
            allItems.push({
              id: `${itemPos[0]}:${itemPos[1]}`,
              type: item.type,
              xpos: itemPos[0],
              ypos: itemPos[1],
              color: item.color,
            })
            allItemLocations.push(itemPos)
          }
        }
      })
    })
    this.setState({
      items: allItems
    })
  }

  checkCollision(pos) {
    const {items} = this.state

    let id = `${pos[0]}:${pos[1]}`
    let item = items.find(item => item.id === id)

    if(item) {
      let char = {...this.state.character}
      let newItems = [...this.state.items].filter(item => item.id !== id)
      switch(item.type) {
        case 'torch':
          char.torch = 101
          break
        case 'health':
          char.maxHealth += 20
          char.health += 40
          if (char.health > char.maxHealth) {char.health = char.maxHealth}
          break
        default:
          break
      }
      this.setState({
        character: char,
        items: newItems
      })
    }
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
    const {items} = this.state
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
      </div>
    );
  }
}

export default App;
