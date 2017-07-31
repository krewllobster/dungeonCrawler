import React, { Component } from 'react';
import InfoBar from './components/InfoBar'
import Board from './components/Board'
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
        pos: null,
      },
      dungeon: {
        floor: 0,
        walls: [],
        room: null,
        size: null,
        start: null,
      }
    }
  }

  componentWillMount() {
    let d = new Dungeon(level(50,50))
    d.generate()
    console.log(d.children)
    this.setState({
      dungeon: {
        walls: d.walls.rows,
        room: d.initial_room,
        size: d.size,
        start: d.start_pos,
      },
      character: {
        pos: d.start_pos,
      }
    })
  }

  handleKey = event => {
    console.log('click')
  }

  render() {

    const flexStyle = {
      display: 'flex',
      flexFlow: 'column',
      height: '100vh',
    }

    const {walls, size, start} = this.state.dungeon
    const {pos} = this.state.character
    return (
      <div
        className="App"
        style={flexStyle}
        onKeyDown={this.handleKey}
      >
        <InfoBar
          char={this.state.character}
          dungeon={this.state.dungeon}
          setChar={this.setChar}
        />
        <Board
          walls={walls}
          size={size}
          charPos={pos}
        />
      </div>
    );
  }
}

export default App;
