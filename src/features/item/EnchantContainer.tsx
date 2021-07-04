import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectEntity, setEnchant, removeEnchant } from "./activeSlice";
import { getLeft, PIECE_ARRAY } from "./armor";
import { ENCHANT_ARRAY, getEnchantment, NONE } from "./enchants";
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
    const dispatch = useAppDispatch();
    return (
        <div>
            {
                entity.armor[props.slot].enchantments.map( (item) => 
                    (<ItemBadge 
                        //entity={props.entity} slot={props.slot} enchant={item}
                        name={item.key}
                        value={item.value}
                        getValidValues={ () => {
                            return (range(1,getEnchantment(ENCHANT_ARRAY, item.key)+1));
                        }}
                        onValueChange={ (val) => {
                            dispatch(
                            setEnchant(
                            {entity: props.entity, name: item.key, level: (val), slot: props.slot}))
                            
                        }}
                        onDelete={ () => {
                            dispatch(
                                removeEnchant({entity: props.entity, name:item.key, slot: props.slot})
                            );
                        }}
                        
                    />)
                )
            }
            <Add
                defaultName={NONE.key}
                defaultValue={1}
                validate={(name, value, setter) => {
                    if (value > getEnchantment(ENCHANT_ARRAY, name)) {
                        setter(getEnchantment(ENCHANT_ARRAY, name));
                    }
                }}
                getValid={ () => {
                    return getLeft(PIECE_ARRAY[props.slot], entity.armor[props.slot].enchantments);
                }}
                getValidValues={ (name) => {
                    return range(1,getEnchantment(ENCHANT_ARRAY, name)+1);
                }}
                onSave={ (name, value) => {
                    dispatch(setEnchant(
                        {entity: props.entity, name: name, level: value, slot: props.slot}));
                }}
            />
        </div>
    );
}
interface ItemBadgeType {
    name: string,
    value: number,
    onDelete: () => void,
    onValueChange: (value: number) => void,
    getValidValues: () => number[]
}
export function ItemBadge(props : ItemBadgeType) {
    return (
        <ButtonGroup>
            <Button >
                {props.name}
            </Button>
            <DropInput 
                selected={nomar(props.value)} 
                onDropClicked={(val) => {
                    props.onValueChange(nomar(val));
                    /*
                    dispatch(
                        setEnchant(
                            {entity: props.entity, name: props.enchant.key, level: nomar(val), slot: props.slot}))
                            */
                }}
                inputs={
                    nomar(props.getValidValues())
                    //nomar(range(1,getEnchantment(ENCHANT_ARRAY, props.enchant.key)+1))
                }
            />
            <Button onClick={(e) => {
                props.onDelete();
                //dispatch(
                //removeEnchant({entity: props.entity, name:props.enchant.key, slot: props.slot}))
            }}>
                {/*&#10006;*/}
                <Icon val="close" />
            </Button>
        </ButtonGroup>
    );
}
interface AddType {
    defaultName: string,
    defaultValue: number,
    validate: (name: string, value: number, 
        setter: React.Dispatch<React.SetStateAction<number>>) => void,
    
    getValid: () => string[],
    getValidValues: (name: string) => number[],

    onSave: (name: string, value: number) => void

}

export function Add(props : AddType) {
//    const entity : Entity = useAppSelector(selectEntity)[props.entity];
//    const dispatch = useAppDispatch();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("None");
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
        /*
        setName(NONE.key);
        setLevel(1);
        */
       setName(props.defaultName);
       setLevel(props.defaultValue);
    }
    useEffect( () => {
        //validate inputs
        /*
        if (level > getEnchantment(ENCHANT_ARRAY, enchant)) {
            setLevel(getEnchantment(ENCHANT_ARRAY, enchant));
        }
        */
       props.validate(name, level, setLevel);
    }, [level, name]);
    return (
        (!editing ) ? 
            (
                //getLeft(PIECE_ARRAY[props.slot], entity.armor[props.slot].enchantments).length 
                props.getValid().length > 1)
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
                    selected={name} 
                    onDropClicked={(val) => 
                        setName(val)
                    } 
                    inputs={
                        //getLeft(PIECE_ARRAY[props.slot], entity.armor[props.slot].enchantments)
                        props.getValid()
                    }
                />
                <DropInput 
                    selected={nomar(level)} 
                    onDropClicked={(val) => 
                        setLevel(nomar(val))
                    } 
                    inputs={
                        nomar(
                            //range(1,getEnchantment(ENCHANT_ARRAY, enchant)+1)
                            props.getValidValues(name)
                        )
                    }
                />
                <Button autoFocus onClick={(e) => {
                        //dispatch(setEnchant(
                        //{entity: props.entity, name: enchant, level: level, slot: props.slot}));
                        props.onSave(name, level);
                        setEditing(false);
                    }}>
                    <Icon val="done" />
                </Button>
            </ButtonGroup>
            </div>
        )
    );
}