import React, {Component} from 'react'

class NewCanvas extends Component {

  constructor() {
    super()

    this.state = {
      rooms: [],
      items: [],
      size: [],
      pos: [],
      collision: [],
      torch: null,
      alive: true,
      exit: [],
      level: null,
      lights: true,
      win: false,
    }

    this.handleKey = this.handleKey.bind(this)
  }

  componentWillMount() {
    let {dungeon, torch, alive, win} = this.props
    let rooms = dungeon.getRooms()
    let items = dungeon.getItems()
    let size = dungeon.getSize()
    let pos = dungeon.getPos()
    let exit = dungeon.getExit()
    let level = dungeon.getLevel()
    let collision = dungeon.getCollision()
    this.setState({rooms, items, win, size, pos, level, collision, torch, alive, exit})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.torch) {
      this.setState({torch: nextProps.torch})
    }
    if (!nextProps.alive) {
      this.setState({alive: nextProps.alive})
      setTimeout(() => this.props.init(0), 3000)
    }
    if (nextProps.win) {
      this.setState({win: true})
    }
    if (this.state.rooms[0] !== nextProps.dungeon.getRooms()[0]) {
      let {dungeon, torch, alive, win} = nextProps
      let rooms = dungeon.getRooms()
      let items = dungeon.getItems()
      let size = dungeon.getSize()
      let pos = dungeon.getPos()
      let exit = dungeon.getExit()
      let level = dungeon.getLevel()
      let collision = dungeon.getCollision()
      this.setState({rooms, items, win, size, pos, level, collision, torch, alive, exit})
      setTimeout(() => this.draw(), 10)
    }
  }

  componentDidReceiveProps() {
    this.draw()
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKey)
    this.draw()
  }

  handleKey(event) {
    event.preventDefault()
    let moveX = 0
    let moveY = 0
    switch(event.key) {
      case 'ArrowUp': moveY = -1; break
      case 'ArrowDown': moveY = 1; break
      case 'ArrowLeft': moveX = -1; break
      case 'ArrowRight': moveX = 1; break
      case 'l': this.setState({lights: !this.state.lights}); break
      default:
        break
    }
    this.setState(prevState => {
      let [x, y] = prevState.pos
      if(prevState.alive && !this.state.win && !prevState.collision[moveY + y + 1][moveX + x + 1]) {
        this.props.setTorch(-1)
        return {pos: [x + moveX, y + moveY]}
      }
    })
    this.checkCollision()
    this.draw()
  }

  checkCollision() {
    const [xPos, yPos] = this.state.pos
    const [x, y] = this.state.exit.pos
    if (xPos === x && yPos === y) {
      this.props.itemCollision(this.state.exit)
    }
    const index = this.state.items.findIndex(item => item.id === `${xPos}:${yPos}`)
    if (index >= 0) {
      const item = this.state.items[index]
      this.props.itemCollision(item)
      this.setState(prevState => {
        prevState.items.splice(index, 1)
        return {
          items: prevState.items
        }
      })
    }
  }

  draw() {
    this.drawRoom()
    this.drawItems()
    if(this.state.lights) {
      this.drawTorch()
      this.drawLight()
    }
    if(this.state.win) {
      this.drawWin()
    }
  }

  drawWin() {
    const ctx = this.refs.dungeon.getContext('2d')
    ctx.fillStyle = 'Green'
    ctx.font = '50px Courrier'
    ctx.fillText('YOU WIN!!!', 50, 150)
  }

  drawTorch() {
    const [x, y] = this.state.pos
    const coll = this.state.collision
    const ctx = this.refs.dungeon.getContext('2d')
    ctx.scale(20,20)
    ctx.translate(-(x-10), -(y-10))
    let [c, r] = [x + 1, y + 1]
    const grd = ctx.createRadialGradient(10.5,10.5,1.5,10.5,10.5,2+this.state.torch/10)
    grd.addColorStop(0,'transparent')
    grd.addColorStop(1,'black')
    ctx.fillStyle = 'rgba(100,100,0,.02)'
    let lit = []
    for(let i = -1; i <= 1; i ++) {
      for(let j = -1; j <= 1; j ++) {
        if(!coll[r+j][c+i]) {
          ctx.fillRect(x+i, y+j, 1, 1)
          lit.push(`${x+i}:${y+j}`)
          let prevVal = true
          for (let k = 2; k <= 5; k++) {
            if (!coll[r+(j*k)][c+(i*k)] && prevVal) {
              ctx.fillRect(x+(i*k), y+(j*k), 1, 1)
              lit.push(`${x+i*k}:${y+j*k}`)
              if(Math.abs(i) === 1 && Math.abs(j) === 1 && k===3) break;
            } else {break}
          }
        }
      }
    }
    for(let i = -1; i <= 1; i += 2) {
      for(let j = -1; j <= 1; j += 2) {
        if(!coll[r+j][c+i]) {
          if(!coll[r][c+i]) {
            if(!coll[r+j][c+i+i]) {
              ctx.fillRect(x+i+i, y+j, 1, 1)
              lit.push(`${x+i+i}:${y+j}`)
              if(!coll[r+j+j][c+i+i+i]) {
                ctx.fillRect(x+i+i+i, y+j+j, 1, 1)
                lit.push(`${x+i+i+i}:${y+j+j}`)
              }
            }
            if(!coll[r][c+i+i] && !coll[r+j][c+i+i+i]) {
              ctx.fillRect(x+i+i+i, y+j, 1, 1)
              lit.push(`${x+i+i+i}:${y+j}`)
              if(!coll[r+j][c+i*4]) {
                ctx.fillRect(x+i*4, y+j, 1, 1)
                lit.push(`${x+i*4}:${y+j}`)
              }
            }
          }
          if(!coll[r+j][c]) {
            if(!coll[r+j+j][c+i]) {
              ctx.fillRect(x+i, y+j+j, 1, 1)
              lit.push(`${x+i}:${y+j+j}`)
              if(!coll[r+j+j+j][c+i+i]) {
                ctx.fillRect(x+i+i, y+j+j+j, 1, 1)
                lit.push(`${x+i+i}:${y+j+j+j}`)
              }
            }
            if(!coll[r+j+j][c] && !coll[r+j+j+j][c+i]) {
              ctx.fillRect(x+i, y+j+j+j, 1, 1)
              lit.push(`${x+i}:${y+j+j+j}`)
              if(!coll[r+j*4][c+i]) {
                ctx.fillRect(x+i, y+j*4, 1, 1)
                lit.push(`${x+i}:${y+j*4}`)
              }
            }
          }
        }
      }
    }
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        ctx.fillStyle = 'black'
        if (!lit.includes(`${i}:${j}`)) {
          ctx.fillRect(i, j, 1, 1)
        }
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  drawLight() {
    const ctx = this.refs.dungeon.getContext('2d')
    ctx.scale(10,10)
    const grd = ctx.createRadialGradient(21,21,1.5,21,21,4+this.state.torch/10)
    grd.addColorStop(0,'transparent')
    grd.addColorStop(1,'black')
    ctx.fillStyle = grd
    ctx.fillRect(0,0,40,40)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    if(!this.state.alive) {
      ctx.fillStyle = 'rgba(255, 0, 0, .3)'
      ctx.fillRect(0,0,400,400)
      ctx.font = '20px Arial'
    }
  }

  drawRoom() {
    const ctx = this.refs.dungeon.getContext('2d')
    ctx.scale(20,20)
    ctx.clearRect(0,0,100,100)
    const {rooms} = this.state
    const [xTrans, yTrans] = this.state.pos
    ctx.translate(-(xTrans-10), -(yTrans-10))
    rooms.forEach(room => {
      let {position, room_size, exits} = room
      let [x, y] = position
      let [w, h] = room_size
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.fillStyle = 'white'
      ctx.fillRect(x, y, w, h)
      ctx.closePath()
      exits.forEach(exit => {
        let [x2, y2] = exit[0]
        ctx.beginPath()
        ctx.fillStyle = 'white'
        ctx.fillRect(x + x2 - 1, y + y2 - 1, 1, 1)
        ctx.closePath()
      })
    })
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  drawItems() {
    const ctx = this.refs.dungeon.getContext('2d')
    ctx.scale(20,20)
    // ctx.clearRect(0,0,100,100)
    const {items, exit} = this.state
    const [xTrans, yTrans] = this.state.pos
    ctx.translate(-(xTrans-10), -(yTrans-10))
    ctx.fillStyle = 'blue'
    ctx.fillRect(exit.pos[0], exit.pos[1], 1, 1)
    items.forEach(item => {
      let {color, xpos, ypos} = item
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.fillRect(xpos, ypos, 1, 1)
      ctx.closePath()
    })
    ctx.fillStyle = 'purple'
    ctx.fillRect(xTrans, yTrans, 1, 1)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  render() {
    const canvasStyle = {margin: '15px', backgroundColor: 'black', position: 'relative', left: '0', right: '0'}

    return(
      <div style={{backgroundColor: 'black'}}>
        <canvas ref='dungeon'
          style = {canvasStyle}
          width = '400'
          height = '400'
        ></canvas>
      </div>
    )
  }
}

export default NewCanvas
