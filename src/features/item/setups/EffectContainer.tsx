import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../app/hooks";
import { selectEntity, setEffect } from "../activeSlice";
import { removeEffect } from "../activeSlice";
import { EFFECTS, ENTITY_EFFECTS, excludeEffect, getEffect } from "../calculations/effects";
import { Add, ItemBadge } from "./EnchantContainer";
import { getEnchantment, NONE } from "../calculations/enchants";
import { Entity } from "../calculations/entity";
import { range } from "../utility/Utils";

export interface EffectContainerType {
    entity: number
}
export function EffectContainer(props: EffectContainerType) {
    const dispatch = useAppDispatch();
    const entity = useSelector(selectEntity)[props.entity];
    return (
        <Col>
        {
            entity.effects.map( (item) => {
            return (
                <ItemBadge
                    name={item.key}
                    value={item.value}
                    onDelete={ () => 
                        dispatch(removeEffect({entity:props.entity, name: item.key}))}
                    onValueChange={ (val) => {
                        dispatch(setEffect({entity:props.entity, name:item.key, level: val}))
                    }}
                    getValidValues={ () => {
                        return range(1, getEffect(EFFECTS, item.key)!.value+1);
                    }}
                />
            );
        })//cannot put a semicolon here?
        }
        <Add 
            defaultName={NONE.key}
            defaultValue={1}
            validate={(name, value, setter) => {
                if (value > getEnchantment(EFFECTS, name)!) {
                    setter(getEnchantment(EFFECTS, name)!);
                }
            }}
            getValid={ () => {
                return excludeEffect(ENTITY_EFFECTS, entity.effects);
            }}
            getValidValues={ (name) => {
                return range(1,getEffect(EFFECTS, name)!.value+1);
            }}
            onSave={ (name, value) => {
                dispatch(setEffect({entity: props.entity, name: name, level: value}));
            }}
        />
        </Col>
    );
}