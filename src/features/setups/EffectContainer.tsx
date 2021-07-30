import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/hooks";
import { removeEffect, selectEntity, setEffect } from "../activeSlice";
import { EFFECTS, ENTITY_EFFECTS, excludeEffect, getEffect, Effect } from "../calculations/effects";
import { getEnchantment, NONE } from "../calculations/enchants";
import { range } from "../utility/Utils";
import { Add, ItemBadge } from "./EnchantContainer";

export interface EffectContainerType {
    entity: number
}
export function EffectContainer(props: EffectContainerType) {
    const dispatch = useAppDispatch();
    const entity = useSelector(selectEntity)[props.entity];
    return (
        <Col>
        <span className="armor-title pr-2">Effects</span>
        {
            entity.effects.map( (item: Effect) => {
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