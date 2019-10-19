import React, { useState, useContext } from "react";
import { Segment, Accordion, Header, Icon, Image } from "semantic-ui-react";
import UserAndChannelContext from "../../context/UserAndChannel";

const MetaPanel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isChannelPrivate, channel } = useContext(UserAndChannelContext);

  const showItem = (event, titleProps) => {
    const { index } = titleProps;
    setActiveIndex(() => (activeIndex === index ? -1 : index));
  };

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
          Posters
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
