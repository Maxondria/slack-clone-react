import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import UserAndChannelContext from "../../context/UserAndChannel";
import firebase from "../../firebase/firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../redux/actions";

class DirectMessages extends Component {
  static contextType = UserAndChannelContext;

  state = {
    user: this.context.user,
    users: [],
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence")
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = userId => {
    let loadedUsers = [];

    this.state.usersRef.on("child_added", snapshot => {
      if (userId !== snapshot.key) {
        let user = snapshot.val();
        user["uid"] = snapshot.key;
        user["status"] = "offline";

        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    this.state.connectedRef.on("value", snapshot => {
      //turn me, the current user online
      if (snapshot.val() === true) {
        const ref = this.state.presenceRef.child(userId);
        ref.set(true);
        //if I disconnect, remove my presence
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    //listen for all users coming online
    this.state.presenceRef.on("child_added", snapshot => {
      if (snapshot.key !== userId) {
        this.addStatusToUser(snapshot.key);
      }
    });

    //listen for users going offline
    this.state.presenceRef.on("child_removed", snapshot => {
      if (snapshot.key !== userId) {
        this.addStatusToUser(snapshot.key, false);
      }
    });
  };

  componentWillUnmount() {
    this.state.usersRef.off();
    this.state.connectedRef.off();
    this.state.presenceRef.off();
  }

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);

    const channelData = {
      id: channelId,
      name: user.name
    };

    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
  };

  getChannelId = userId => {
    const currentUserId = this.state.user.uid;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return [...acc, user];
    }, []);

    this.setState({ users: updatedUsers });
  };

  isUserOnline = user => user.status === "online";

  render() {
    const { users } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
          ({users.length})
        </Menu.Item>
        {/*Users to send direct messages*/}
        {users.map(user => (
          <Menu.Item
            key={user.uid}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: "0.7", fontStyle: "italic" }}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? "green" : "red"}
            />
            @ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default connect(
  undefined,
  { setCurrentChannel, setPrivateChannel }
)(DirectMessages);
