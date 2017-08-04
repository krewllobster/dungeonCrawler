import React, { Component } from 'react'
import InfoBar from './components/InfoBar'
import CanvasBoard from './components/CanvasBoard'
import Dungeon from 'dungeon-generator'
import extendDungeon from './data/dungeonExtend'
import Messages from './components/Messages'
import {level, randomInt} from './data/dungeons'
import DungeonLoot from './data/DungeonLoot'
import {initialCharacterState, initialDungeonState, initialWeaponState} from './data/initialState'

class App extends Component {
  constructor() {
    super()

    this.state = {
      character: initialCharacterState,
      dungeon: initialDungeonState,
      weapon: initialWeaponState,
      items: [],
      floor: 0,
      messages: [],
      combat: false,
    }
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this), false)
    this.init(0)
  }

  init(level, char = initialCharacterState, weapon = initialWeaponState) {
    let pos = this.generateDungeonInit(level)
    let messages = []
    let character = {...char, pos}
    this.setState({
      character,
      weapon: {...weapon},
      floor: level,
      messages,
      combat: false,
    })
  }

  restart(level, char = initialCharacterState, weapon = initialWeaponState) {
    let pos = this.generateDungeonInit(level)
    let messages = []
    let character = {...char, pos}
    this.setState({
      character,
      weapon: {...weapon},
      floor: level,
      messages,
      combat: false,
    })
  }

  generateDungeonInit(floor) {
    let d = new extendDungeon(0)
    this.setState({
      dungeon: {
        walls: d.walls.rows,
        room: d.initial_room,
        size: d.size,
        start: d.start_pos,
        children: d.children,
      },
      items: d.allItems
    })
    return d.start_pos
  }

  setVal(val, values, message = null) {
    if (values.torch < 1) values.torch = 1
    this.setState(prevState => {
      let newMessages = message ? [...prevState.messages, message] : prevState.messages
      return {
        [val]: {...prevState[val], ...values},
        messages: newMessages
      }
    })
  }

  pushMessage(message, clear = false) {
    if (clear) [
      this.setState({messages: [message]})
    ]
    this.setState(prevState => {
      return {
        messages: [...prevState.messages, message]
      }
    })
  }

  checkCollision(pos) {
    const {items, weapon, combat} = this.state
    let {health, maxHealth, torch} = this.state.character

    let id = `${pos[0]}:${pos[1]}`
    let item = items.find(item => item.id === id)

    if(!item && !combat) {
      this.setVal('character', {pos, torch: torch - 1})
    }

    if(item) {
      let newItems = [...this.state.items].filter(item => item.id !== id)
      switch(item.type) {
        case 'torch':
          this.setVal('character', {torch: 120, pos}, item.message)
          break
        case 'health':
          health = health + 8 > maxHealth + 2 ? maxHealth + 2 : health + 8
          this.setVal('character', {health, maxHealth: maxHealth + 2, pos, torch: torch - 1}, item.message)
          break
        case 'weapon':
          if (item.level > weapon.level) {
            this.setVal('character', {pos, torch: torch - 1})
            this.setVal('weapon', {...item}, item.message)
          } else {
            this.setVal('character', {pos, torch: torch - 1}, `Another lousy ${item.name}...you throw it away in disgust`)
          }
          break
        case 'enemy':
          this.setVal('character', {pos, torch: torch - 1})
          this.initiateCombat(item)
          break
        default:
          break
      }
      this.setState({
        items: newItems
      })
    }
  }

  initiateCombat(enemy) {
    let {health, level, experience} = this.state.character
    let {attack} = this.state.weapon
    let {hp, damage, name, exp} = enemy
    this.setState({combat: true})
    this.pushMessage(`You see a ${enemy.name} crouched before you. It attacks!`)
    while(health > 0) {
      if (hp <= 0) {
        this.setVal('character', {experience: experience + exp}, `You were victorious!`)
        this.setState({combat: false})
        return
      }
      let eDamage = randomInt(damage)
      let cDamage = randomInt(attack)
      this.setVal('character', {health: health - eDamage}, `The ${name} strikes, doing ${eDamage} damage`)
      health -= eDamage
      hp -= cDamage
      this.pushMessage(`You strike the ${name}, doing ${cDamage} damage`)
    }
    if(health <= 0) {
      this.pushMessage('You died. Whoops')
      this.setState({dungeon: initialDungeonState, items: []})
      this.restart(0)
    }
    return
  }

  handleKeyDown(event) {
    event.preventDefault()
    const {pos} = this.state.character
    let [x, y] = pos
    const {walls} = this.state.dungeon
    let keys = ['ArrowUp', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'y', 'n']
    if (keys.includes(event.key)) {
      if(!this.state.combat) {
        switch(event.key) {
          case 'ArrowUp': y -= 1; break
          case 'ArrowDown': y += 1; break
          case 'ArrowRight': x += 1; break
          case 'ArrowLeft': x -= 1; break
          default: break
        }
        if (!walls[y+1][x+1]) {
          this.checkCollision([x, y])
        }
      }
    }
  }

  render() {

    const flexStyle = {
      display: 'flex',
      flexFlow: 'column',
      height: '100vh',
    }
    const {items, messages, weapon, floor} = this.state
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
          floor={floor}
          weapon={weapon}
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
