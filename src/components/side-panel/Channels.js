import React, { Component } from "react";
import firebase from "../../firebase/firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../redux/actions";
import UserAndChannelContext from "../../context/UserAndChannel";
import {
  Icon,
  Menu,
  Modal,
  Form,
  Input,
  Button,
  Label
} from "semantic-ui-react";
import ModalSpinner from "../ModalSpinner";

class Channels extends Component {
  static contextType = UserAndChannelContext;

  state = {
    activeChannel: "",
    channels: [],
    isSaving: false,
    channelname: "",
    channeldetail: "",
    channelsRef: firebase.database().ref("channels"),
    messagesRef: firebase.database().ref("messages"),
    channel: null,
    notifications: [],
    modal: false,
    firstLoad: true
  };

  componentDidMount() {
    this.addListerners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.channelsRef.off();
    this.state.messagesRef.off();
  };

  setFirstChannel = () => {
    if (this.state.firstLoad && this.state.channels.length > 0) {
      const firstChannel = this.state.channels[0];

      this.changeChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  //for every channel
  addNotificationListener = channelId => {
    this.state.messagesRef.child(channelId).on("value", snap => {
      if (this.state.channel) {
        this.handleNotifications(
          channelId,
          this.state.channel.id,
          this.state.notifications,
          snap
        );
      }
    });
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      notification => notification.id === channelId
    );

    if (index === -1) {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    } else {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    }

    this.setState({ notifications });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.state.channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  getNotificationCount = channel => {
    let count = 0;

    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) {
      return count;
    }
  };

  addListerners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", snapshot => {
      loadedChannels.push(snapshot.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
      //setup listeners for every other channel
      this.addNotificationListener(snapshot.key);
    });
  };

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        {this.getNotificationCount(channel) && (
          <Label color="red">{this.getNotificationCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ));

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.clearNotifications();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);

    this.setState({ channel });
  };

  onCloseModal = () => this.setState({ modal: false });

  openModal = () => this.setState({ modal: true });

  handleOnChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    });
  };

  isValidForm = ({ channelname, channeldetail }) =>
    channeldetail && channelname;

  handleSubmit = event => {
    event.preventDefault();
    if (this.isValidForm(this.state)) {
      return this.saveChannel();
    }
  };

  saveChannel = async () => {
    const { channeldetail, channelname, channelsRef } = this.state;
    const { displayName, photoURL } = this.context.user;

    try {
      this.setState({ isSaving: true });
      const id = channelsRef.push().key;

      const newChannel = {
        id,
        name: channelname,
        details: channeldetail,
        createdBy: {
          name: displayName,
          avatar: photoURL
        }
      };

      await channelsRef.child(id).update(newChannel);
      this.setState({
        channelname: "",
        channeldetail: "",
        modal: false,
        isSaving: false
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { channels, modal, isSaving } = this.state;
    return (
      <>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" />
              CHANNELS
            </span>{" "}
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {/*Channel List*/}
          {this.displayChannels(channels)}
        </Menu.Menu>

        {/*Add Channel Modal*/}
        <Modal basic open={modal} onClose={this.onCloseModal}>
          <Modal.Header>Create a channel</Modal.Header>
          <Modal.Content>
            {isSaving ? (
              <ModalSpinner />
            ) : (
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <Input
                    fluid
                    label="Channel Name"
                    name="channelname"
                    onChange={this.handleOnChange}
                  />
                </Form.Field>

                <Form.Field>
                  <Input
                    fluid
                    label="About Channel"
                    name="channeldetail"
                    onChange={this.handleOnChange}
                  />
                </Form.Field>
              </Form>
            )}
          </Modal.Content>

          <Modal.Actions>
            {isSaving ? (
              ""
            ) : (
              <>
                <Button color="green" inverted onClick={this.handleSubmit}>
                  <Icon name="checkmark" /> Add
                </Button>
                <Button color="red" inverted onClick={this.onCloseModal}>
                  <Icon name="remove" /> Cancel
                </Button>
              </>
            )}
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default connect(
  undefined,
  { setCurrentChannel, setPrivateChannel }
)(Channels);
