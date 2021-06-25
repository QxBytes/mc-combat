import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

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
                    console.log(e.target.text);
                }}>
                    {item}
                </Dropdown.Item>
            )
        }
        </DropdownButton>
    );
}