import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase/firebase";
import { setUserPosts } from "../../redux/actions";
import { connect } from "react-redux";

import Message from "./Message";
import UserAndChannelContext from "../../context/UserAndChannel";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Typing from "./Typing";

class Messages extends React.Component {
  static contextType = UserAndChannelContext;

  state = {
    messagesRef: firebase.database().ref("messages"),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    usersRef: firebase.database().ref("users"),
    typingRef: firebase.database().ref("typing"),
    connectedRef: firebase.database().ref(".info/connected"),
    typingUsers: [],
    messages: [],
    countedUsers: "",
    channel: this.context.channel,
    user: this.context.user,
    messagesLoading: true,
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
    isChannelStarred: false,
    isChannelPrivate: this.context.isChannelPrivate
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel) {
      this.addListener(channel.id);
      this.addUserStarsListener(channel.id, user.uid);
    }
  }

  addUserStarsListener = (channelId, userId) => {
    this.state.usersRef
      .child(`${userId}/starred`)
      .once("value")
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          this.setState({ isChannelStarred: prevStarred });
        }
      });
  };

  componentWillUnmount() {
    this.getMessagesRef().off();
    this.state.typingRef.off();
    this.state.connectedRef.off();
  }

  handleStar = () => {
    this.setState(
      prevState => ({
        isChannelStarred: !prevState.isChannelStarred
      }),
      () => this.starChannel()
    );
  };

  starChannel = () => {
    if (this.state.isChannelStarred) {
      this.state.usersRef.child(`${this.state.user.uid}/starred`).update({
        [this.state.channel.id]: {
          name: this.state.channel.name,
          details: this.state.channel.details,
          createdBy: {
            name: this.state.channel.createdBy.name,
            avatar: this.state.channel.createdBy.avatar
          }
        }
      });
    } else {
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.channel.id)
        .remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
  };

  getMessagesRef = () => {
    const { isChannelPrivate, messagesRef, privateMessagesRef } = this.state;
    return isChannelPrivate ? privateMessagesRef : messagesRef;
  };

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

  searchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");

    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);

    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  handleSearchChange = ({ target: { value } }) => {
    this.setState(
      {
        searchTerm: value,
        searchLoading: true
      },
      () => this.searchMessages()
    );
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
    this.addTypingListeners(channelId);
  };

  addTypingListeners = channelId => {
    const { typingRef, connectedRef, user } = this.state;

    typingRef.child(channelId).on("child_added", snapshot => {
      if (snapshot.key !== this.state.user.uid) {
        this.setState(({ typingUsers }) => ({
          typingUsers: [
            ...typingUsers,
            { id: snapshot.key, name: snapshot.val() }
          ]
        }));
      }
    });

    typingRef.child(channelId).on("child_removed", snapshot => {
      const index = this.state.typingUsers.findIndex(
        user => user.id === snapshot.key
      );

      if (index !== -1) {
        this.setState(({ typingUsers }) => ({
          typingUsers: typingUsers.filter(user => user.id !== snapshot.key)
        }));
      }
    });

    connectedRef.on("value", snapshot => {
      if (snapshot.val()) {
        typingRef
          .child(`${channelId}/${user.uid}`)
          .onDisconnect()
          .remove(error => error !== null && console.log(error));
      }
    });
  };

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = { count: 1, avatar: message.user.avatar };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];

    this.getMessagesRef()
      .child(channelId)
      .on("child_added", snapshot => {
        loadedMessages.push(snapshot.val());

        this.setState({
          messages: loadedMessages,
          messagesLoading: false
        });

        this.countUniqueUsers(loadedMessages);
        this.countUserPosts(loadedMessages);
      });
  };

  displayChannelName = channel => {
    return channel
      ? `${this.state.isChannelPrivate ? "@" : "#"}${channel.name}`
      : "";
  };

  displayTypingUsers = users =>
    users.length > 0 &&
    users.map(({ id, name }) => (
      <div
        key={id}
        style={{ display: "flex", alignItems: "center", marginBottom: "0.2em" }}
      >
        <span className="user__typing">{name} is typing</span>
        <Typing />
      </div>
    ));

  render() {
    const {
      messages,
      countedUsers,
      searchTerm,
      searchResults,
      searchLoading,
      isChannelPrivate,
      isChannelStarred,
      typingUsers
    } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(this.context.channel)}
          uniqueUsers={countedUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isChannelPrivate={isChannelPrivate}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
            {this.displayTypingUsers(typingUsers)}
          </Comment.Group>
        </Segment>

        {this.context.channel && (
          <MessageForm messagesRef={this.getMessagesRef()} />
        )}
      </React.Fragment>
    );
  }
}

export default connect(
  undefined,
  { setUserPosts }
)(Messages);
