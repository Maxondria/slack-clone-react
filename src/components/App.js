import React from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import "./App.css";

import ColorPanel from "./color-panel/ColorPanel";
import SidePanel from "./side-panel/SidePanel";
import MetaPanel from "./meta-panel/MetaPanel";
import Messages from "./messages/Messages";
import UserAndChannelContext from "../context/UserAndChannel";

const App = ({ channel, user, isChannelPrivate }) => (
  <UserAndChannelContext.Provider value={{ channel, user, isChannelPrivate }}>
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel />

      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages key={channel && channel.id} />
      </Grid.Column>

      <Grid.Column width={4}>{channel && <MetaPanel />}</Grid.Column>
    </Grid>
  </UserAndChannelContext.Provider>
);

const mapStateToProps = ({
  channel: { currentChannel, isPrivateChannel },
  user: { currentUser }
}) => ({
  channel: currentChannel,
  user: currentUser,
  isChannelPrivate: isPrivateChannel
});

export default connect(mapStateToProps)(App);
