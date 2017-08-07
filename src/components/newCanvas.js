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
    }

    this.handleKey = this.handleKey.bind(this)
  }

  componentWillMount() {
    let {dungeon, torch, alive} = this.props
    let rooms = dungeon.getRooms()
    let items = dungeon.getItems()
    let size = dungeon.getSize()
    let pos = dungeon.getPos()
    let collision = dungeon.getCollision()
    this.setState({rooms, items, size, pos, collision, torch, alive})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.torch) {
      this.setState({torch: nextProps.torch})
    }
    if (!nextProps.alive) {
      this.setState({alive: nextProps.alive})
      setTimeout(() => this.props.init(0), 5000)
    }
    if (this.state.rooms[0] != nextProps.dungeon.getRooms()[0]) {
      let {dungeon, torch, alive} = nextProps
      let rooms = dungeon.getRooms()
      let items = dungeon.getItems()
      let size = dungeon.getSize()
      let pos = dungeon.getPos()
      let collision = dungeon.getCollision()
      this.setState({rooms, items, size, pos, collision, torch, alive})
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
      default:
        break
    }
    this.setState(prevState => {
      let [x, y] = prevState.pos
      if(prevState.alive && !prevState.collision[moveY + y + 1][moveX + x + 1]) {
        this.props.setTorch(-1)
        return {pos: [x + moveX, y + moveY]}
      }
    })
    this.checkCollision()
    this.draw()
  }

  checkCollision() {
    const [xPos, yPos] = this.state.pos
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
    this.drawLight()
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
    const {items} = this.state
    const [xTrans, yTrans] = this.state.pos
    ctx.translate(-(xTrans-10), -(yTrans-10))
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
