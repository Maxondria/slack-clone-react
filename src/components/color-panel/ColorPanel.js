import React, { useState, useContext, Fragment } from "react";
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Segment
} from "semantic-ui-react";
import { SliderPicker } from "react-color";
import { useColorPicker } from "../../custom-hooks/useColorPicker";
import { useColorListener } from "../../custom-hooks/useColorListener";
import firebase from "../../firebase/firebase";
import UserAndChannelContext from "../../context/UserAndChannel";
import { connect } from "react-redux";
import { setColors } from "../../redux/actions/index";

const ColorPanel = props => {
  const [modal, setModal] = useState(false);
  const [usersRef] = useState(firebase.database().ref("users"));
  const { user } = useContext(UserAndChannelContext);

  const [userColors] = useColorListener(user);

  const [{ primary, secondary }, handleChange] = useColorPicker({
    primary: "",
    secondary: ""
  });

  const handleModal = () => setModal(prevState => !prevState);

  const handleSaveColors = async () => {
    if (primary && secondary) {
      try {
        await usersRef.child(`${user.uid}/colors`).push({ primary, secondary });

        handleModal();
      } catch (e) {
        handleModal();
        console.error(e.message);
      }
    }
  };

  const displayUserColors = () => {
    return (
      userColors.length > 0 &&
      userColors.map((color, i) => (
        <Fragment key={i}>
          <Divider />
          <div
            className="color__container"
            onClick={() => props.setColors(color.primary, color.secondary)}
          >
            <div
              className="color__square"
              style={{ background: color.primary }}
            >
              <div
                className="color__overlay"
                style={{ background: color.secondary }}
              />
            </div>
          </div>
        </Fragment>
      ))
    );
  };

  return (
    <Sidebar
      as={Menu}
      icon="labeled"
      inverted
      vertical
      visible
      width="very thin"
    >
      <Divider />
      <Button icon="add" size="small" color="blue" onClick={handleModal} />

      {/*{users colors}*/}
      {displayUserColors()}

      {/*Color Picker*/}
      <Modal basic open={modal} onClose={handleModal}>
        <Modal.Header>Choose App Colors</Modal.Header>
        <Modal.Content>
          <Segment inverted>
            <Label content="Primary Color" />
            <SliderPicker color={primary} onChange={handleChange("primary")} />
          </Segment>

          <Segment inverted>
            <Label content="Secondary Color" />
            <SliderPicker
              color={secondary}
              onChange={handleChange("secondary")}
            />
          </Segment>
        </Modal.Content>

        <Modal.Actions>
          <Button color="green" inverted onClick={handleSaveColors}>
            <Icon name="checkmark" /> Save Colors
          </Button>

          <Button color="red" inverted onClick={handleModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  );
};

export default connect(
  undefined,
  { setColors }
)(ColorPanel);
