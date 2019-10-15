import React, { Component } from "react";
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";
import firebase from "../../firebase/firebase";
import { connect } from "react-redux";

class UserPanel extends Component {
  state = {
    user: this.props.currentUser
  };

  dropDownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>
    },
    {
      key: "logout",
      text: <span onClick={this.handleSignOut}>Sign Out</span>
    }
  ];

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Signed Out");
      });
  };

  render() {
    return (
      <Grid style={{ background: "#4c3c4c" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/*App Header*/}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>WorkChat</Header.Content>
            </Header>
          </Grid.Row>

          {/*User DropDown*/}
          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown
              trigger={<span>{this.state.user.displayName}</span>}
              options={this.dropDownOptions()}
            />
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});
export default connect(mapStateToProps)(UserPanel);
