import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectEntity, setEnchant, removeEnchant } from "./activeSlice";
import { getLeft, PIECE_ARRAY } from "./armor";
import { Enchantment, ENCHANT_ARRAY, getEnchantment, NONE } from "./enchants";
import { Entity } from "./entity";
import Icon from "./Icons";
import { DropInput } from "./Parts";
import { range } from "./Utils";
const nomar = require('nomar');

interface EnchantContainerType {
    entity: number,
    slot: number
}
export function EnchantContainer(props : EnchantContainerType) {
    const entity : Entity = useAppSelector(selectEntity)[props.entity];
    return (
        <div>
            {
                entity.armor[props.slot].enchantments.map( (item) => 
                    (<EnchantBadge entity={props.entity} slot={props.slot} enchant={item}></EnchantBadge>)
                )
            }
            <AddEnchant entity={props.entity} slot={props.slot}/>
        </div>
    );
}
interface EnchantBadgeType {
    entity: number,
    slot: number,
    enchant: Enchantment
}
export function EnchantBadge(props : EnchantBadgeType) {
    const dispatch = useAppDispatch();
    return (
        <ButtonGroup>
            <Button >
                {props.enchant.key}
            </Button>
            <DropInput 
                selected={nomar(props.enchant.value)} 
                onDropClicked={(val) => 
                    dispatch(
                        setEnchant(
                            {entity: props.entity, name: props.enchant.key, level: nomar(val), slot: props.slot}))
                } 
                inputs={
                    nomar(range(1,getEnchantment(ENCHANT_ARRAY, props.enchant.key)+1))
                }
            />
            <Button onClick={(e) => dispatch(
                removeEnchant({entity: props.entity, name:props.enchant.key, slot: props.slot}))}>
                {/*&#10006;*/}
                <Icon val="close" />
            </Button>
        </ButtonGroup>
    );
}
interface AddEnchantType {
    entity: number,
    slot: number
}

export function AddEnchant(props : AddEnchantType) {
    const entity : Entity = useAppSelector(selectEntity)[props.entity];
    const dispatch = useAppDispatch();
    const [editing, setEditing] = useState(false);
    const [enchant, setName] = useState("None");
    const [level, setLevel] = useState(1);
    const focusInCurrentTarget = ({ relatedTarget, currentTarget } : any) => {
        if (relatedTarget === null) return false;
        
        var node = relatedTarget.parentNode;
              
        while (node !== null) {
            if (node === currentTarget) return true;
            node = node.parentNode;
        }
        return false;
    }
    const reset = () => {
        setName(NONE.key);
        setLevel(1);
    }
    useEffect( () => {
        //validate inputs
        if (level > getEnchantment(ENCHANT_ARRAY, enchant)) {
            setLevel(getEnchantment(ENCHANT_ARRAY, enchant));
        }
    }, [level, enchant]);
    return (
        (!editing ) ? 
            (getLeft(PIECE_ARRAY[props.slot], entity.armor[props.slot].enchantments).length > 1)
            ? 
            (<Button onClick={() => {reset(); setEditing(true);} }>
                <Icon val="add" />
            </Button>) 
            : (<React.Fragment></React.Fragment>)
        : 
        (
            <div onBlur={(e: React.ChangeEvent) => {
                if(!focusInCurrentTarget(e)) {
                    setEditing(false);
                    reset();
                }
            }}>
            <ButtonGroup className="editing">
                <DropInput
                    selected={enchant} 
                    onDropClicked={(val) => 
                        setName(val)
                    } 
                    inputs={
                        getLeft(PIECE_ARRAY[props.slot], entity.armor[props.slot].enchantments)
                    }
                />
                <DropInput 
                    selected={nomar(level)} 
                    onDropClicked={(val) => 
                        setLevel(nomar(val))
                    } 
                    inputs={
                        nomar(range(1,getEnchantment(ENCHANT_ARRAY, enchant)+1))
                    }
                />
                <Button autoFocus onClick={(e) => {
                        dispatch(setEnchant(
                        {entity: props.entity, name: enchant, level: level, slot: props.slot}));
                        setEditing(false);
                    }}>
                    <Icon val="done" />
                </Button>
            </ButtonGroup>
            </div>
        )
    );
}