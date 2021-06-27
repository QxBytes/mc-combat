import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, ButtonGroup } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectEntity, setType, setEnchant, removeEnchant } from "./activeSlice";
import { getLeft, PIECE_ARRAY } from "./armor";
import { Enchantment, ENCHANT_ARRAY, getEnchantment, NONE } from "./enchants";
import { Entity } from "./entity";
import Icon from "./Icons";
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
            <AddEnchant slot={props.slot}/>
        </div>
    );
}
interface EnchantBadgeType {
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
                    dispatch(setEnchant({name: props.enchant.key, level: nomar(val), slot: props.slot}))
                } 
                inputs={
                    nomar(range(1,getEnchantment(ENCHANT_ARRAY, props.enchant.key)+1))
                }
            />
            <Button onClick={(e) => dispatch(removeEnchant({name:props.enchant.key, slot: props.slot}))}>
                {/*&#10006;*/}
                <Icon val="close" />
            </Button>
        </ButtonGroup>
    );
}
interface AddEnchantType {
    slot: number
}

export function AddEnchant(props : AddEnchantType) {
    const entity : Entity = useAppSelector(selectEntity);
    const dispatch = useAppDispatch();
    const [editing, setEditing] = useState(false);
    const [enchant, setName] = useState("None");
    const [level, setLevel] = useState(1);
    const left : Enchantment[] = [];
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
            (<Button onClick={() => setEditing(true)}>
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
                        {name: enchant, level: level, slot: props.slot}));
                        setEditing(false);
                    }}>
                    <Icon val="done" />
                </Button>
            </ButtonGroup>
            </div>
        )
    );
}