import React, { Component } from 'react'

class InfoBar extends Component {

  render() {

    const {char, weapon} = this.props
    let {health, maxHealth, exp, torch, level} = char
    const titleStyle = {
      height: '100px',
      width: '100%',
      backgroundColor: 'rebeccapurple',
      color: 'white',
    }

    const infoStyle = {
      ...titleStyle,
      backgroundColor: 'darkorchid',
      height: '30px',
    }

    return (
      <div>
        <div style={titleStyle}>
          <div style={{textAlign: 'center'}}>
            <h1 style={{marginTop: '0'}}>
              React Roguelike
            </h1>
            <h4>Beat the boss in dungeon 4</h4>
          </div>
        </div>
        <table style={infoStyle}>
          <tbody>
            <tr>
              <td>{`Health: ${health}/${maxHealth}`}</td>
              <td>{'Exp: ' + exp}</td>
              <td>{'Level: ' + level}</td>
              <td>{'Torch: ' + torch}</td>
              <td>{'Weapon: ' + weapon.name}</td>
              <td>{`Damage: ${weapon.attack[0]*level} to ${weapon.attack[1]*level}`}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )

  }
}

export default InfoBar
