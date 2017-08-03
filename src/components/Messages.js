import React, {Component} from 'react'


class Messages extends Component {


  render() {

    const styleFull = {
      position: 'absolute', right: '0', top: '150px',
      width: '350px', color: 'white', maxHeight: '400px'
    }

    const messages = [...this.props.messages].reverse().slice(0,9).reverse()
    const styleInner = {position: 'relative', bottom: '0', width: '100%', maxHeight: '100%'}

    return (
      <div style={styleFull}>
        <div style={styleInner}>
          {messages.map((message, i) => {
            return (
              <div key={i} style={{overflow: 'hidden', maxHeight: '100%'}}>
                <br/>
                {`${i + 1}: ${message}`}
                <br/>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Messages
