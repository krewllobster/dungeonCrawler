import React, {Component} from 'react'

class CanvasBoard extends Component {

  componentDidMount() {
    this.updateDungeon(this.props)
    this.updateLight(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateLight(nextProps)
    if(nextProps.items !== this.props.items) {
      console.log('item should disappear')
      this.updateDungeon(nextProps)
    }
  }

  updateLight({pos, size, torch}) {
    const ctx = this.refs.light.getContext('2d')
    let x = pos[0]*10
    let y = pos[1]*10
    ctx.clearRect(0,0,size[0]*10, size[1]*10)
    ctx.fillStyle='black'
    let rad = 20 + 70*torch/100
    const grd = ctx.createRadialGradient(x+5, y+5, 15, x+5, y+5, rad)
    grd.addColorStop(0, 'rgba(0,0,0,0)')
    grd.addColorStop(1, 'black')
    ctx.fillStyle = grd
    ctx.fillRect(0,0,size[0]*10, size[1]*10)
    ctx.fillStyle='purple'
    ctx.fillRect(x, y, 10,10)
  }

  updateDungeon({rooms, items}) {
    const ctx = this.refs.dungeon.getContext('2d')

    Object.keys(rooms).forEach(id => {
      let room = rooms[id]
      const {position, room_size, exits} = room
      this.drawRoom(position, room_size, ctx)
      exits.forEach(exit => {
        this.drawExit(position, exit[0], ctx)
      })
    })

    items.forEach(item => {
      ctx.fillStyle = item.color
      ctx.fillRect(item.xpos * 10, item.ypos * 10, 10, 10)
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

    return (
      <div style={{width: '100%', height: '100%', backgroundColor: 'black'}}>
        <canvas
          style={canvasStyle}
          ref='dungeon'
          width={size[0]*10} height={size[1]*10}>
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
