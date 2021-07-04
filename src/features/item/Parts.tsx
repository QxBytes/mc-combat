import React, { useState } from "react";
import { Button, Col, Collapse, Dropdown, DropdownButton } from "react-bootstrap";
import Icon from "./Icons";

export interface DropInputType {
    selected: string,
    inputs: string[],
    onDropClicked: (item : string) => void
}
export function DropInput(props: DropInputType) {

    return (
        <DropdownButton title={props.selected}>
        {
            props.inputs.map( (item) => 
                <Dropdown.Item onClick={(e : any) => {
                    props.onDropClicked(e.target.text);
                }}>
                    {item}
                </Dropdown.Item>
            )
        }
        </DropdownButton>
    );
}

export interface CollapseableType {
    handleCollapse?: (open?: boolean) => void,
    inner?: React.ReactNode,
    title?: string,
    options?: React.ReactNode,
    className?: string
}

export function Collapseable(props: CollapseableType) {
    let [toggle, setToggle] = useState(true);
    const {inner} = props;
    return (
        <React.Fragment>
            <Button 
                className={"collapse-btn text-left " + (props.className||"")} 
                onClick={ () => {
                    let newState = !toggle;
                    setToggle(newState); 
                    if (props.handleCollapse) {
                        props.handleCollapse(newState);
                    }
                } }
                
            >
            {
                toggle ? 
                <Icon val="expand_less"/> :
                <Icon val="expand_more"/>
            }
            {
                props.title ?
                props.title : ""
            }
            </Button>
            {
                props.options ? props.options : ""
            }
            <Collapse in={toggle}>
                <div>{inner!}</div>
            </Collapse>
        </React.Fragment>
    );
}