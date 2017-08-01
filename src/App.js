import React, { Component } from 'react';
import InfoBar from './components/InfoBar'
import Board from './components/Board'
import CanvasBoard from './components/CanvasBoard'
import Dungeon from 'dungeon-generator'
import {level} from './data/dungeons'

class App extends Component {
  constructor() {
    super()

    this.state = {
      character: {
        health: 100,
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
      floor: 0
    }
  }

  componentWillMount() {
    let d = new Dungeon(level(50,50))
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
    document.addEventListener("keydown", this.handleKeyDown.bind(this), false)
  }

  handleKeyDown(event) {
    const {pos} = this.state.character
    let [x, y] = pos
    const {walls} = this.state.dungeon
    Array(-1,0,1).forEach(i => {
      Array(-1,0,1).forEach(j => {
        console.log(`${i}, ${j}: ${walls[y + j][x + i]}`)
      })
    })
    let keys = ['ArrowUp', 'ArrowRight', 'ArrowLeft', 'ArrowDown']
    if (keys.includes(event.key)) {
      switch(event.key) {
        case 'ArrowUp': y -= 1; break
        case 'ArrowDown': y += 1; break
        case 'ArrowRight': x += 1; break
        case 'ArrowLeft': x -= 1; break
      }
      if (!walls[y+1][x+1]) {
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

    const {walls, size, start, children, room} = this.state.dungeon
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
        <CanvasBoard rooms={children} size={size} pos={pos} torch={torch}/>
      </div>
    );
  }
}

export default App;
