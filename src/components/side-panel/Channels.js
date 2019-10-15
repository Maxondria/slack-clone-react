import React, { Component } from "react";
import { Icon, Menu, Modal, Form, Input, Button } from "semantic-ui-react";

class Channels extends Component {
  state = {
    channels: [],
    channelname: "",
    channeldetail: "",
    modal: false
  };

  onCloseModal = () => this.setState({ modal: false });

  openModal = () => this.setState({ modal: true });

  handleOnChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    });
  };

  render() {
    const { channels, modal } = this.state;
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
        </Menu.Menu>

        {/*Add Channel Modal*/}
        <Modal basic open={modal} onClose={this.onCloseModal}>
          <Modal.Header>Create a channel</Modal.Header>
          <Modal.Content>
            <Form>
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
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted>
              <Icon name="checkmark" /> Add
            </Button>

            <Button color="red" inverted onClick={this.onCloseModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default Channels;
