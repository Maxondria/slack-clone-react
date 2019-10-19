import React, { useState } from "react";
import { Icon, Label, Menu } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../redux/actions";

const Starred = props => {
  const [starredChannels, setStarredChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");

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
