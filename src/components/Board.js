import React, {Component} from 'react'

class Board extends Component {
  constructor() {
    super()

    this.svg = this.svg.bind(this)
  }

  svg(){
    const {walls, size, charPos} = this.props
    let x = size[0]
    let y = size[1]
    let xpos = charPos[0]
    let ypos = charPos[1]
    return (
      <svg
        width="100%" height="100%"
        viewBox={`0 0 ${x} ${y}`}
        preserveAspectRatio="xMinYMin slice"
      >
        {walls.map((row, r) => {
          return row.map((col, c) => {
            return (
              <rect
                x={c} y={r}
                width='1' height='1'
                style={{
                  fill: col ? '#000' : '#fff',
                }}
              ></rect>
            )
          })
        })}
        <rect x={xpos} y={ypos}
          width='1' height='1'
          style={{
            fill: 'blue'
          }}
        />
      </svg>
    )
  }

  render() {

    const boardStyle = {
      flex: '1',
      overflow: 'auto',
      height: '100%',
      backgroundColor: 'white',
      fontFamily: 'courrier',
    }

    return (
      <div style={boardStyle}>
        {this.svg()}
      </div>
    )
  }
}

export default Board
