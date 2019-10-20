import React, { useState, useContext } from "react";
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List
} from "semantic-ui-react";
import UserAndChannelContext from "../../context/UserAndChannel";

const MetaPanel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { isChannelPrivate, channel, userPosts } = useContext(
    UserAndChannelContext
  );

  const showItem = (event, titleProps) => {
    const { index } = titleProps;
    setActiveIndex(() => (activeIndex === index ? -1 : index));
  };

  const formatCount = count =>
    count > 1 || count === 0 ? `${count} posts` : `${count} post`;

  const displayTopPosters = posts =>
    Object.entries(posts)
      .sort((b, a) => (b[1].count > a[1].count ? -1 : 1))
      .map(([username, stats], i) => (
        <List.Item key={i}>
          <Image avatar src={stats.avatar} />
          <List.Content>
            <List.Header as="a">{username}</List.Header>
            <List.Description>{formatCount(stats.count)}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 5);

  return isChannelPrivate ? null : (
    <Segment>
      <Header as="h3" attached="top">
        About # {channel.name}
      </Header>
      <Accordion styled attached="true">
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={showItem}
        >
          <Icon name="dropdown" />
          <Icon name="info" />
          Details
        </Accordion.Title>

        <Accordion.Content active={activeIndex === 0}>
          {channel.details}
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={showItem}
        >
          <Icon name="dropdown" />
          <Icon name="user circle" />
          Top Posters
        </Accordion.Title>

        <Accordion.Content active={activeIndex === 1}>
          <List>{userPosts && displayTopPosters(userPosts)}</List>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={showItem}
        >
          <Icon name="dropdown" />
          <Icon name="pencil alternate" />
          Created By
        </Accordion.Title>

        <Accordion.Content active={activeIndex === 2}>
          <Header as="h3">
            <Image circular src={channel.createdBy.avatar} />
            {channel.createdBy.name}
          </Header>
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
};

export default MetaPanel;
