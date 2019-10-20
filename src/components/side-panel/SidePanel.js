import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";
import UserAndChannelContext from "../../context/UserAndChannel";

class SidePanel extends Component {
  static contextType = UserAndChannelContext;

  render() {
    const { colors } = this.context;
    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{ background: colors.primary, fontSize: "1.2rem" }}
      >
        <UserPanel />
        <Starred />
        <Channels />
        <DirectMessages />
      </Menu>
    );
  }
}

export default SidePanel;
