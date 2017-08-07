import React, {Component} from 'react'


class DungeonLayer extends Component {

  componentDidMount() {
    this.draw(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.draw(nextProps)
  }

  draw(vals) {
    const {rooms, items, pos} = vals
    const dungeonLayer = this.refs.dungeon.getContext('2d')
    const itemLayer = this.refs.items.getContext('2d')
    dungeonLayer.scale(20,20)
    itemLayer.scale(20,20)
    this.drawRoom(dungeonLayer, rooms, pos)
    this.drawItems(itemLayer, items, pos)
  }


  drawRoom(ctx, rooms, pos) {
    const [xTrans, yTrans] = pos
    ctx.translate(-xTrans/2, -yTrans/2)
    rooms.forEach(room => {
      let {position, items, room_size, exits} = room
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
  }

  drawItems(ctx, items, pos) {
    const [xTrans, yTrans] = pos
    ctx.translate(-xTrans/2, -yTrans/2)
    items.forEach(item => {
      let {color, xpos, ypos, name} = item
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.fillRect(xpos, ypos, 1, 1)
      ctx.closePath()
    })
  }

  deathScreen = () => {
    if (this.props.alive) {return null}
    return (
      <div style={{...this.props.canvasStyle, color: 'red'}}>
        YOU DIED
      </div>
    )
  }

  render() {

    const {width, height, canvasStyle} = this.props

    return (
      <div>
        <canvas ref='dungeon'
          style = {canvasStyle}
          width = {width}
          height = {height}
          tabIndex = '0'
          onKeyDown = {this.handleKey}
        ></canvas>
        <canvas ref='items'
          style = {{...canvasStyle, backgroundColor: 'none'}}
          width = {width}
          height = {height}
        ></canvas>
        {this.deathScreen}
      </div>
    )
  }
}

export default DungeonLayer
