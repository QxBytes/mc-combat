import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Placement } from "react-bootstrap/esm/Overlay";
import { Tooltip } from "reactstrap";

export default function Icon(props : {val: string}) {
    return (
        <i className="material-icons vc">{props.val}</i>
    );
}

interface InputModalType {
  prompt: string,
  onSubmit: (val : string) => void
}
interface InputModalState {
  show: boolean,
  input: string
}
//Use this later
//<InputModal prompt="Type something" onSubmit={ (val) => alert(val)} />
export class InputModal extends React.Component<InputModalType, InputModalState> {
  constructor(props: InputModalType) {
    super(props);

    this.state = {
      show: true,
      input: ""
    }

    this.hide = this.hide.bind(this);
  }
  hide() {
    this.setState({show: false, input: ""})
  }
  render() { return (
    <Modal
      onHide={() => this.hide()}
      show={this.state.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {this.props.prompt}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input className="form-control dark-input" type="text" 
        onChange={ (e) => this.setState({input: e.target.value})} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => {
            this.props.onSubmit(this.state.input);
            this.hide();
          }}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
  }
}

export function Tip(props : {target: string, val: string, pos: Placement}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <Tooltip placement={props.pos} isOpen={tooltipOpen} target={props.target} toggle={toggle}>
      {props.val}
    </Tooltip>
  );
}