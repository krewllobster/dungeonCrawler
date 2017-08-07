import React, {Component} from 'react'


class Messages extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.messages !== this.props.messages
  }

  render() {

    const styleFull = {
      position: 'relative', left: '0', top: '15px',
      width: '400px', color: 'white', maxHeight: '180px',
      padding: '15px',
      margin: 'auto',
      overflow: 'scroll',
    }

    const {messages} = {...this.props}

    return (
      <div style={styleFull}>
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
    )
  }
}

export default Messages
