import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button
} from "semantic-ui-react";
import firebase from "../../firebase/firebase";
import AvatarEditor from "react-avatar-editor";

import UserAndChannelContext from "../../context/UserAndChannel";

const UserPanel = () => {
  const [modal, setModal] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [blob, setBlob] = useState("");
  const [storageRef] = useState(firebase.storage().ref());
  const [loggedInUser] = useState(firebase.auth().currentUser);
  const [usersRef] = useState(firebase.database().ref("users"));
  const [uploadedImageURL, setUploadedImageURL] = useState("");

  const avatarRef = useRef(null);

  const { user, colors } = useContext(UserAndChannelContext);

  useEffect(() => {
    if (!!uploadedImageURL) {
      //update current user profile
      loggedInUser
        .updateProfile({
          photoURL: uploadedImageURL
        })
        .then(() => {
          //update our database
          usersRef
            .child(loggedInUser.uid)
            .update({
              avatar: uploadedImageURL
            })
            .then(() => {
              console.log("User Updated");
              handleModal();
            })
            .catch(e => console.log(e.message));
        })
        .catch(e => console.log(e.message));
    }
  }, [uploadedImageURL, loggedInUser, usersRef]);

  const handleModal = () => setModal(prevState => !prevState);

  const handleChange = ({ target: { files } }) => {
    const reader = new FileReader();

    if (files[0]) {
      reader.readAsDataURL(files[0]);
      reader.addEventListener("load", () => setPreviewImage(reader.result));
    }
  };

  const handleCropImage = () => {
    if (avatarRef) {
      avatarRef.current.getImageScaledToCanvas().toBlob(blob => {
        let imageURL = URL.createObjectURL(blob);
        setCroppedImage(imageURL);
        setBlob(blob);
      });
    }
  };

  const uploadCroppedImage = async () => {
    const metadata = { contentType: "image/jpeg" };

    try {
      const snapshot = await storageRef
        .child(`avatars/user-${loggedInUser.uid}`)
        .put(blob, metadata);

      const downloadURL = await snapshot.ref.getDownloadURL();
      setUploadedImageURL(downloadURL);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Signed Out");
      });
  };

  const dropDownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span onClick={handleModal}>Change Avatar</span>
    },
    {
      key: "logout",
      text: <span onClick={handleSignOut}>Sign Out</span>
    }
  ];

  return (
    <Grid style={{ background: colors.primary }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          {/*App Header*/}
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>WorkChat</Header.Content>
          </Header>

          {/*User DropDown*/}
          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={user.photoURL} spaced="right" avatar />
                  {user.displayName}
                </span>
              }
              options={dropDownOptions()}
            />
          </Header>
        </Grid.Row>
        {/*Change User Avatar Modal*/}
        <Modal basic open={modal} onClose={handleModal}>
          <Modal.Header>Change Avatar</Modal.Header>

          <Modal.Content>
            <Input
              fluid
              onChange={handleChange}
              type="file"
              label="New Avatar"
              name="previewImage"
            />

            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  {/* Image Preview */}
                  {previewImage && (
                    <AvatarEditor
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                      ref={avatarRef}
                    />
                  )}
                </Grid.Column>

                <Grid.Column>
                  {/* Cropped Image Preview */}
                  {croppedImage && (
                    <Image
                      src={croppedImage}
                      style={{ margin: "3.5em auto" }}
                      width={100}
                      height={100}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>

          <Modal.Actions>
            {croppedImage && (
              <Button color="green" inverted onClick={uploadCroppedImage}>
                <Icon name="save" /> Change Avatar
              </Button>
            )}
            <Button color="green" inverted onClick={handleCropImage}>
              <Icon name="image" /> Preview
            </Button>
            <Button color="red" inverted onClick={handleModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
