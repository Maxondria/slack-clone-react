import React from "react";
import { Button, Input, Segment } from "semantic-ui-react";
import FileModal from "./FileModal";
import uuidv4 from "uuid/v4";
import firebase from "../../firebase/firebase";
import UserAndChannelContext from "../../context/UserAndChannel";
import ProgressBar from "./ProgressBar";

class MessageForm extends React.Component {
  static contextType = UserAndChannelContext;

  state = {
    storageRef: firebase.storage().ref(),
    typingRef: firebase.database().ref("typing"),
    messagesRef: this.props.messagesRef,
    percentUploaded: 0,
    message: "",
    uploadState: "",
    uploadTask: null,
    user: this.context.user,
    loading: false,
    errors: [],
    modal: false,
    isChannelPrivate: this.context.isChannelPrivate
  };

  sendFileMessage = async downloadURL => {
    const ref = this.state.messagesRef;

    try {
      await ref
        .child(this.context.channel.id)
        .push()
        .set(this.createMessage(downloadURL));

      this.setState({
        errors: [],
        uploadState: "",
        uploadTask: null,
        percentUploaded: 0
      });
    } catch (error) {
      this.setState({
        errors: [{ message: error.message }],
        uploadState: "error",
        uploadTask: null
      });
    }
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  handleKeyDown = async () => {
    const { message, typingRef } = this.state;
    const { channel, user } = this.context;
    if (message) {
      await typingRef.child(`${channel.id}/${user.uid}`).set(user.displayName);
    } else {
      await typingRef.child(`${channel.id}/${user.uid}`).remove();
    }
  };

  getPathName = () =>
    this.state.isChannelPrivate
      ? `chat/private-${this.context.channel.id}`
      : `chat/public`;

  uploadFile = (file, metadata) => {
    const filePath = `${this.getPathName()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snapshot => {
            const percentUploaded =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.setState({ percentUploaded });
          },
          error => {
            this.setState({
              errors: [{ message: error.message }],
              uploadState: "error",
              uploadTask: null
            });
          },
          async () => {
            try {
              const downloadURL = await this.state.uploadTask.snapshot.ref.getDownloadURL();
              this.sendFileMessage(downloadURL);
            } catch (e) {
              this.setState({
                errors: [{ message: e.message }],
                uploadState: "error",
                uploadTask: null
              });
            }
          }
        );
      }
    );
  };

  handleOnChange = ({ target: { value, name } }) => {
    this.setState({
      [name]: value
    });
  };

  createMessage = (downloadURL = null) => {
    const { message, user } = this.state;
    const msg = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    if (downloadURL === null) {
      msg["content"] = message;
    } else {
      msg["image"] = downloadURL;
    }

    return msg;
  };

  sendMessage = async () => {
    const { message, messagesRef, typingRef } = this.state;
    const { channel, user } = this.context;

    try {
      if (message) {
        this.setState({ loading: true, errors: [] });

        await messagesRef
          .child(this.context.channel.id)
          .push()
          .set(this.createMessage());

        this.setState({ loading: false, message: "" });
        await typingRef.child(`${channel.id}/${user.uid}`).remove();
      } else {
        this.setState({ errors: [{ message: "Add a message" }] });
        await typingRef.child(`${channel.id}/${user.uid}`).remove();
      }
    } catch (error) {
      this.setState({ errors: [{ message: error.message }], loading: false });
    }
  };

  render() {
    const {
      errors,
      message,
      loading,
      modal,
      uploadState,
      percentUploaded
    } = this.state;
    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          value={message}
          onKeyDown={this.handleKeyDown}
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
            disabled={uploadState === "uploading"}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            onClick={this.openModal}
          />
        </Button.Group>
        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Segment>
    );
  }
}

export default MessageForm;
