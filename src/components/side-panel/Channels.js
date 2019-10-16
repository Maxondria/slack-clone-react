import React, { Component } from "react";
import firebase from "../../firebase/firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../redux/actions";
import { Icon, Menu, Modal, Form, Input, Button } from "semantic-ui-react";
import ModalSpinner from "../ModalSpinner";

class Channels extends Component {
  state = {
    activeChannel: "",
    channels: [],
    isSaving: false,
    channelname: "",
    channeldetail: "",
    channelsRef: firebase.database().ref("channels"),
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
  };

  setFirstChannel = () => {
    if (this.state.firstLoad && this.state.channels.length > 0) {
      const firstChannel = this.state.channels[0];

      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  addListerners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", snapshot => {
      loadedChannels.push(snapshot.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
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
        #{channel.name}
      </Menu.Item>
    ));

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
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
    const { displayName, photoURL } = this.props.currentUser;

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
        <Menu.Menu style={{ paddingBottom: "2em" }}>
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

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

export default connect(
  mapStateToProps,
  { setCurrentChannel }
)(Channels);
