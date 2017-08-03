import React, {Component} from 'react'

class CanvasBoard extends Component {

  constructor() {
    super()
    this.state= {}
  }

  componentDidMount() {
    this.updateBoard(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateBoard(nextProps)
  }

  updateBoard({pos, size, torch, rooms, items}) {
    this.updatePlayer(pos, size)
    // this.updateLight(pos, size, torch)
    this.updateDungeon(rooms, items)
  }

  updatePlayer(pos, size) {
    let [x, y] = pos
    const ctx = this.refs.player.getContext('2d')
    ctx.clearRect(0,0,size[0]*10, size[1]*10)
    ctx.fillStyle='purple'
    ctx.fillRect(x*10, y*10, 10,10)
  }

  updateLight(pos, size, torch) {
    const ctx = this.refs.light.getContext('2d')
    let x = pos[0]*10
    let y = pos[1]*10
    ctx.clearRect(0,0,size[0]*10, size[1]*10)
    let rad = 20 + 70*torch/100
    const grd = ctx.createRadialGradient(x+5, y+5, 15, x+5, y+5, rad)
    grd.addColorStop(0, 'rgba(0,0,0,0)')
    grd.addColorStop(1, 'black')
    ctx.fillStyle = grd
    ctx.fillRect(0,0,size[0]*10, size[1]*10)
  }

  updateDungeon(rooms, items) {
    const ctx = this.refs.dungeon.getContext('2d')

    Object.keys(rooms).forEach(id => {
      let room = rooms[id]
      const {position, room_size, exits, items} = room
      this.drawRoom(position, room_size, ctx)
      exits.forEach(exit => {
        this.drawExit(position, exit[0], ctx)
      })
      if (items.length > 0) {
        items.forEach(item => {
          ctx.fillStyle = item.color
          ctx.fillRect(item.xpos * 10, item.ypos * 10, 10, 10)
        })
      }
    })
  }

  drawRoom(position, room_size, ctx, fillStyle = 'white') {
    ctx.fillStyle = fillStyle
    ctx.fillRect(position[0]*10, position[1]*10, room_size[0]*10, room_size[1]*10)
  }

  drawExit(position, exit_pos, ctx) {
    let exitX = position[0] + exit_pos[0] - 1
    let exitY = position[1] + exit_pos[1] - 1
    ctx.fillStyle = 'white'
    ctx.fillRect(exitX*10, exitY*10, 10, 10)
  }

  render() {
    const {size} = this.props
    const canvasStyle = {margin: '30px', backgroundColor: 'black', position: 'absolute', left: '0', right: '0'}
    let [x, y] = size
    return (
      <div style={{width: '100%', height: '100%', backgroundColor: 'black'}}>
        <canvas
          style={canvasStyle}
          ref='dungeon'
          width={x*10} height={y*10}>
        </canvas>
        <canvas style={{...canvasStyle, backgroundColor: 'none'}}
          ref='player'
          width={x*10} height={y*10}>
        </canvas>
        <canvas
          style={{...canvasStyle, backgroundColor: 'none'}}
          ref='light'
          width={size[0]*10} height={size[1]*10}>
        </canvas>
      </div>
    )
  }
}

export default CanvasBoard
