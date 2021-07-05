import React, { useState } from "react";
import { Button, Col, Collapse, Dropdown, DropdownButton, Image } from "react-bootstrap";
import Icon from "./Icons";

import no_heart from './images/no_heart.png';
import half_heart from './images/half_heart.png';
import full_heart from './images/full_heart.png';

import half_heart_lg from './images/half_heart_lg.png';

import no_armor from './images/no_armor.png';
import half_armor from './images/half_armor.png';
import full_armor from './images/full_armor.png';
import { Tooltip } from "reactstrap";
import { Placement } from "react-bootstrap/esm/Overlay";

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
    title?: React.ReactNode,
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
export function HalfHeart() {
    return (
        <Image className="m-1" src={half_heart_lg} width={18} height={18}></Image>
    );
}
export function HealthBar(props: {health: number}) {
    return <DynamicBar 
        value={props.health + .49999999}
        full={full_heart}
        half={half_heart}
    />
}
export function ArmorBar(props: {armor: number}) {
    return <DynamicBar 
        value={props.armor}
        max={20}
        full={full_armor}
        half={half_armor}
        empty={no_armor}
    />
}
export function ToughnessBar(props: {toughness: number}) {
    return <DynamicBar 
        value={props.toughness}
        max={12}
        full={full_armor}
        half={half_armor}
        empty={no_armor}
    />
}
interface DynamicBarType {
    value: number,
    max?: number,
    full: string,
    half: string,
    empty?: string
}
export function DynamicBar(props: DynamicBarType) {
    let val = Math.round(props.value);
    let full = Math.floor(val / 2);
    let half = val % 2 === 1;
    let elements = [];
    for (let i = 0 ; i < full ; i++) {
        elements.push(
            <Image src={props.full} />
        )
    }
    if (half) {
        elements.push(
            <Image src={props.half} />
        )
    }
    if (props.max && props.empty) {
        let left = Math.floor((props.max - val)/2);
        for (let i = 0 ; i < left ; i++) {
            elements.push(
                <Image src={props.empty} />
            );
        }
    }
    return <span>{elements}</span>;
}