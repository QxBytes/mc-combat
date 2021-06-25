import React from "react";
import { Row, Col, Form, Button, ButtonGroup } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectEntity, setType, setEnchant, removeEnchant } from "./activeSlice";
import { Enchantment, ENCHANT_ARRAY, getEnchantment } from "./enchants";
import { Entity } from "./entity";
import { DropInput } from "./Parts";
import { range } from "./Utils";
const nomar = require('nomar');

interface EnchantContainerType {
    slot: number
}
export function EnchantContainer(props : EnchantContainerType) {
    const entity : Entity = useAppSelector(selectEntity);
    const dispatch = useAppDispatch();
    const onMaterialChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setType({type: e.target.value, slot: props.slot}));
    };
    return (
        <div>
            {
                entity.armor[props.slot].enchantments.map( (item) => 
                    (<EnchantBadge slot={props.slot} enchant={item}></EnchantBadge>)
                )
            }
        </div>
    );
}
interface EnchantBadgeType {
    slot: number,
    enchant: Enchantment
}
export function EnchantBadge(props : EnchantBadgeType) {
    const entity : Entity = useAppSelector(selectEntity);
    const dispatch = useAppDispatch();
    return (
        <ButtonGroup>
            <Button>
                {props.enchant.key}
            </Button>
            <DropInput 
                selected={nomar(props.enchant.value)} 
                onDropClicked={(val) => 
                    dispatch(setEnchant({name: props.enchant.key, level: nomar(val), slot: props.slot}))
                } 
                inputs={
                    nomar(range(1,getEnchantment(ENCHANT_ARRAY, props.enchant.key)+1))
                }
            />
            <Button onClick={(e) => dispatch(removeEnchant({name:props.enchant.key, slot: props.slot}))}>
                &#10006;
            </Button>
        </ButtonGroup>
    );
}