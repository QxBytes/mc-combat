import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectEntity, setType } from "../item/activeSlice";
import { armor_data, getTough, MATERIAL_ARRAY, PIECE_ARRAY } from "./armor";
import { EnchantContainer } from "./EnchantContainer";
import { Entity } from "./entity";

interface ArmorSlotType {
    slot: number
}
export function ArmorSlot(props : ArmorSlotType) {
    const entity : Entity = useAppSelector(selectEntity);
    const dispatch = useAppDispatch();
    const onMaterialChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setType({type: e.target.value.split(" ")[2], slot: props.slot}));
    }
    return (
        <React.Fragment>
        <Row noGutters className="">
            <Col>
                <h3 className="text-left bottom-border p-1">{PIECE_ARRAY[props.slot]}</h3>
            </Col>
        </Row>
        <Row className="container-bottom">
            <Col sm={3} className="min-width-1">
            <Form>
            <Form.Group as={Row} controlId="armorSelect.ControlSelect1">
                <Form.Control as="select" onChange={(e : React.ChangeEvent<HTMLInputElement>) => onMaterialChange(e)}> {
                    MATERIAL_ARRAY[props.slot].map( (item) => {
                        return (
                        <option>{armor_data.get(item)![props.slot]} {getTough(item)} {item}
                        </option>);
                    } )
                }
                </Form.Control>
            </Form.Group>
            
            </Form>
            <div className="text-left">
            <li>
                    +{entity.armor[props.slot].armor} Armor
            </li>
            <li>
                    +{entity.armor[props.slot].toughness} Tough
            </li>
            </div>
            
            </Col>
            <Col sm={9}>
                <div className="text-left">
                    <EnchantContainer slot={props.slot} />
                </div>
            </Col>
        </Row>
        </React.Fragment>
    )
}
export function ArmorContainer() {
    return (
        <div className="container-top">
          <ArmorSlot slot={0}/>
          <ArmorSlot slot={1}/>
          <ArmorSlot slot={2}/>
          <ArmorSlot slot={3}/>
        </div>
    );
}