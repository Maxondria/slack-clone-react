import React from "react";
import { connect } from "react-redux";
import { Button, Input, Segment } from "semantic-ui-react";
import firebase from "../../firebase/firebase";

class MessageForm extends React.Component {
  state = {
    messagesRef: this.props.messagesRef,
    message: "",
    user: this.props.currentUser,
    loading: false,
    errors: []
  };

  handleOnChange = ({ target: { value, name } }) => {
    this.setState({
      [name]: value
    });
  };

  createMessage = () => {
    const { message, user } = this.state;
    return {
      content: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      }
    };
  };

  sendMessage = async () => {
    const { message, messagesRef } = this.state;

    try {
      if (message) {
        this.setState({ loading: true, errors: [] });

        await messagesRef
          .child(this.props.currentChannel.id)
          .push()
          .set(this.createMessage());

        this.setState({ loading: false, message: "" });
      } else {
        this.setState({ errors: [{ message: "Add a message" }] });
      }
    } catch (error) {
      this.setState({ errors: [{ message: error.message }], loading: false });
    }
  };

  render() {
    const { errors, message, loading } = this.state;
    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          value={message}
          onChange={this.handleOnChange}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder="Write your message"
          className={
            errors.some(({ message }) =>
              message.toLowerCase().includes("message")
            )
              ? "error"
              : ""
          }
        />
        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            disabled={loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    );
  }
}

const mapStateToProps = ({
  channel: { currentChannel },
  user: { currentUser }
}) => ({
  currentChannel,
  currentUser
});

export default connect(mapStateToProps)(MessageForm);
