import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";
import UserAndChannelContext from "../../context/UserAndChannel";

class MessagesHeader extends React.Component {
  static contextType = UserAndChannelContext;

  render() {
    const {
      channelName,
      uniqueUsers,
      handleSearchChange,
      searchLoading,
      isChannelPrivate,
      handleStar,
      isChannelStarred
    } = this.props;

    return this.context.channel ? (
      <Segment clearing>
        {/* Channel Title */}
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {channelName}{" "}
            {!isChannelPrivate && (
              <Icon
                name={isChannelStarred ? "star" : "star outline"}
                color={isChannelStarred ? "yellow" : "black"}
                size="small"
                onClick={handleStar}
              />
            )}
          </span>
          <Header.Subheader>{uniqueUsers}</Header.Subheader>
        </Header>

        {/* Channel Search Input */}
        <Header floated="right">
          <Input
            onChange={handleSearchChange}
            loading={searchLoading}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    ) : (
      ""
    );
  }
}

export default MessagesHeader;
