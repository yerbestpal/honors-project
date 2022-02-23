import ScrollToBottom from 'react-scroll-to-bottom'
import { Card, Row } from 'react-bootstrap'
import { css } from '@emotion/css'
import { useEffect } from 'react'

let messageContainer
let scrollToBottomCss

const Messages = ({ messages, name }) => {
  useEffect(() => {
    messageContainer = document.getElementById('message-container')
    scrollToBottomCss = css({
      height: messageContainer.offsetHeight
    })
  }, [messageContainer])

  return (
    <section className='chat-view'>
      <ScrollToBottom className={scrollToBottomCss}>
        {messages.map((message, i) => (
          <Row key={i}
               className={message.user === String(name).toLowerCase() ? 'px-3 m-0 col-12 mb-3' : 'px-3 m-0 col-12 mb-3'}>
            <Card bg={message.user === String(name).toLowerCase() ? 'primary' : 'light'}
                  text={message.user === String(name).toLowerCase() ? 'light' : 'dark'}
                  className={message.user === String(name).toLowerCase() ? 'p-0 m-0 mb-3 float-end' : 'p-0 m-0 mb-3 float-start'}
                  >
              <Card.Header as="h5">{message.user}</Card.Header>
              <Card.Body>
                <Card.Text>
                  {message.text}
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>
        ))}
      </ScrollToBottom>
    </section>
  )
}

export default Messages