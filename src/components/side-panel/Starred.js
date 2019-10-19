import React, { useState, useContext, useEffect, useCallback } from "react";
import { Icon, Menu } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../redux/actions";
import UserAndChannelContext from "../../context/UserAndChannel";
import firebase from "../../firebase/firebase";

const Starred = props => {
  const [starredChannels, setStarredChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");
  const { user } = useContext(UserAndChannelContext);
  const [usersRef] = useState(firebase.database().ref("users"));

  const addListeners = useCallback(() => {
    usersRef.child(`${user.uid}/starred`).on("child_added", snapshot => {
      const starredChannel = { id: snapshot.key, ...snapshot.val() };
      setStarredChannels(prevState => [...prevState, starredChannel]);
    });

    usersRef.child(`${user.uid}/starred`).on("child_removed", snapshot => {
      const channelUnstarred = { id: snapshot.key, ...snapshot.val() };

      setStarredChannels(prevState =>
        prevState.filter(channel => channel.id !== channelUnstarred.id)
      );
    });
  }, [user, usersRef]);

  useEffect(() => {
    addListeners();
    return () => usersRef.off();
  }, [usersRef, addListeners]);

  const displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  const changeChannel = channel => {
    setActiveChannel(channel.id);
    props.setCurrentChannel(channel);
    props.setPrivateChannel(false);
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star" />
          STARRED
        </span>{" "}
        ({starredChannels.length})
      </Menu.Item>
      {displayChannels(starredChannels)}
    </Menu.Menu>
  );
};

export default connect(
  undefined,
  { setCurrentChannel, setPrivateChannel }
)(Starred);
