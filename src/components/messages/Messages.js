import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase/firebase";

import Message from "./Message";
import UserAndChannelContext from "../../context/UserAndChannel";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";

class Messages extends React.Component {
  static contextType = UserAndChannelContext;

  state = {
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    countedUsers: "",
    channel: this.context.channel,
    messagesLoading: true
  };

  componentDidMount() {
    const { channel } = this.state;

    if (channel) {
      this.addListener(channel.id);
    }
  }

  componentWillUnmount() {
    this.state.messagesRef.off();
  }

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.id)) {
        acc.push(message.user.id);
      }
      return acc;
    }, []);

    const plural = uniqueUsers.length > 1;
    const countedUsers = `${uniqueUsers.length} Member${plural ? "s" : ""}`;

    this.setState({ countedUsers });
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.context.user}
      />
    ));

  addListener = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];

    this.state.messagesRef.child(channelId).on("child_added", snapshot => {
      loadedMessages.push(snapshot.val());

      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });

      this.countUniqueUsers(loadedMessages);
    });
  };

  displayChannelName = channel => (channel ? `#${channel.name}` : "");

  render() {
    const { messages, messagesRef, countedUsers } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(this.context.channel)}
          uniqueUsers={countedUsers}
        />

        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        {this.context.channel && <MessageForm messagesRef={messagesRef} />}
      </React.Fragment>
    );
  }
}

export default Messages;
