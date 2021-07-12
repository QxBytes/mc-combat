import React from "react";
import { Col, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectEntity, setType } from "../activeSlice";
import { armor_data, getTough, invalidEnchants, MATERIAL_ARRAY, PIECE_ARRAY } from "../calculations/armor";
import { Entity } from "../calculations/entity";
import { Tip } from "../utility/Icons";
import { DropInput } from "../utility/Parts";
import { EnchantContainer } from "./EnchantContainer";

interface ArmorSlotType {
    entity: number
    slot: number
}
export function ArmorSlot(props : ArmorSlotType) {
    const entity : Entity = useAppSelector(selectEntity)[props.entity];
    const dispatch = useAppDispatch();
    const onMaterialChange = (value: string) => {
        dispatch(setType({entity: props.entity, type: value.split(" ")[2], slot: props.slot}));
    }
    const getFormatted = (type : string) => {
        return armor_data.get(type)![props.slot] + " " + getTough(type) + " " + type;
    }
    return (
        <React.Fragment>

        <Row className="container-bottom">
            <Col sm={3} className="min-width-1">
            <span className="border-bottom armor-title">{PIECE_ARRAY[props.slot]}</span>

            <DropInput 
                selected={getFormatted(entity.armor[props.slot].type)}
                inputs={MATERIAL_ARRAY[props.slot].map( (item) => getFormatted(item))}
                onDropClicked={(value) => onMaterialChange(value)}
            />

            </Col>
            <Col sm={9}>
                <div className="text-left">
                    <EnchantContainer entity={props.entity} slot={props.slot} />
                    {
                    invalidEnchants(entity.armor[props.slot]) ? (
                        <>
                        <span id={"invalid-enchant-" + props.entity + "-" + props.slot}>⚠️</span>
                        <Tip 
                            target={"invalid-enchant-" + props.entity + "-" + props.slot}
                            val={"Normally, only one of the following can be applied: Protection," + 
                            " Projectile Protection, Blast Protection, or Fire Protection"}
                            pos={"right"}
                        />
                        </>
                    ): ""
                    }
                </div>
            </Col>
        </Row>
        </React.Fragment>
    )
}
