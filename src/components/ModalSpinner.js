import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const ModalSpinner = () => (
  <Dimmer active>
    <Loader content="Preparing things..." />
  </Dimmer>
);

export default ModalSpinner;
