import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { propTypes } from "react-bootstrap/esm/Image";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectEntity, setType } from "../item/activeSlice";
import { armor_data, getTough, MATERIAL_ARRAY, PIECE_ARRAY } from "./armor";
import { EnchantContainer } from "./EnchantContainer";
import { Entity } from "./entity";

interface ArmorSlotType {
    entity: number
    slot: number
}
export function ArmorSlot(props : ArmorSlotType) {
    const entity : Entity = useAppSelector(selectEntity)[props.entity];
    const dispatch = useAppDispatch();
    const onMaterialChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setType({entity: props.entity, type: e.target.value.split(" ")[2], slot: props.slot}));
    }
    const getFormatted = (type : string) => {
        return armor_data.get(type)![props.slot] + " " + getTough(type) + " " + type;
    }
    return (
        <React.Fragment>
        {/*
        <Row noGutters className="">
            <Col>
            </Col>
        </Row>
        */}
        <Row className="container-bottom">
            <Col sm={3} className="min-width-1">
            <h5 className="text-center bottom-border p-1">{PIECE_ARRAY[props.slot]}</h5>
            
            <Form>
            <Form.Group as={Row} controlId="armorSelect.ControlSelect1">
                <Form.Control as="select" 
                defaultValue={getFormatted(entity.armor[props.slot].type)}
                onChange={(e : React.ChangeEvent<HTMLInputElement>) => onMaterialChange(e)}> {
                    MATERIAL_ARRAY[props.slot].map( (item) => {
                        return (
                        <option>
                            {getFormatted(item)}
                        </option>);
                    } )
                }
                </Form.Control>
            </Form.Group>
            
            </Form>
            {/* 
            <div className="text-left">
            <li>
                    +{entity.armor[props.slot].armor} Armor
            </li>
            <li>
                    +{entity.armor[props.slot].toughness} Tough
            </li>
            </div>
            */}
            </Col>
            <Col sm={9}>
                <div className="text-left">
                    <EnchantContainer entity={props.entity} slot={props.slot} />
                </div>
            </Col>
        </Row>
        </React.Fragment>
    )
}
