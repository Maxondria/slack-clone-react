import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase/firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref("messages")
  };

  render() {
    const { messagesRef } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">{/* Messages */}</Comment.Group>
        </Segment>

        <MessageForm messagesRef={messagesRef} />
      </React.Fragment>
    );
  }
}

export default Messages;
