import { useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectDamage, selectEntity } from "./activeSlice";
import { getSetEPF } from "./calculations/armor";
import { Damage } from "./calculations/damage";
import * as d from './calculations/damageTypes';
import { DAMAGE_ARRAY } from "./calculations/damageTypes";
import { Entity } from "./calculations/entity";
import { Tip } from "./utility/Icons";
import { takeDamage } from "./utility/maths";
import { HalfHeart } from "./utility/Parts";
import { getColor, getPresetColor, round } from "./utility/Utils";

const TAKEN = "Damage Taken";
const RESISTANCE = "% Resistance";
const EPF = "EPF (Enchantment Protection Factor)";
const SETTINGS = [TAKEN, RESISTANCE, EPF];

export function DamageSummaryTable() {
    const globalDamage = useSelector(selectDamage);
    const entities: Entity[] = useAppSelector(selectEntity);
    const [show, setShow] = useState(TAKEN);
    return (
        <div>
        <Row>
            <Col>
            <HalfHeart/>
            <span>{round(globalDamage.amount)}</span>
            </Col>
        </Row>
        <Row>
        <Col>
            
            <Table className="damage-summary-table">
                <thead>
                    <tr>
                        {
                        DAMAGE_ARRAY.map( (item) => 
                            <DamageHeader id={"header-" + item} type={item} />)
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        entities.map( (item, index) => {
                            return (<DamageSummary entity={index} show={show}/>);
                        })
                    }
                </tbody>
                <Tip target={"header-" + d.MELEE} val={"ex: mobs, players, lava, cactus"} pos="top" />
                <Tip target={"header-" + d.FALL} val={"ex: falling off a cliff"} pos="top" />
                <Tip target={"header-" + d.EXPLOSION} val={"ex: tnt, creeper, crossbow with damaging firework"} pos="top" />
                <Tip target={"header-" + d.FIRE} val={"ex: burning while on fire"} pos="top" />
                <Tip target={"header-" + d.PROJECTILE} val={"ex: fireballs, arrows, thrown trident, shulker bullets"} pos="top" />
                <Tip target={"header-" + d.MAGIC} val={"ex: instant damage, poison"} pos="top" />
            </Table>
            <Form className="text-left p-1">
                <div key={"table-settings"}>
                {
                    SETTINGS.map( (item, index) =>
                        (
                        <Form.Check custom inline label={item} type="radio" name="settings"
                            checked={item === show}
                            id={`table-settings-${index}`}
                            onChange={ (e) => setShow(item)}
                        />)
                    )
                }
                </div>
            </Form>
        </Col>
        </Row>
        </div>
    );
}
interface DamageHeaderType {
    type: string,
    id: string
}
export function DamageHeader(props: DamageHeaderType)  {
    //const [hover] = useState(false);
    const damage : Damage = useAppSelector(selectDamage);
    return (
        
        <th 
        
            /* onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}
            onClick={ () => dispatch(setDamageType(props.type))}
            You can't have a dangling { comment } inside of an element tag. 
            Just remove the {} and you should be fine
            In between tags, however, you need {}
            */
        id={props.id}
        className={damage.type.includes(props.type) ? "highlighted fade-transition" : "fade-transition"}
        
        >
            {props.type}
        </th>
    );
}
interface DamageSummaryType {
    entity: number,
    show: string
}
export function DamageSummary(props: DamageSummaryType) {
    const damage : Damage = useAppSelector(selectDamage);
    
    return (
    <tr style={
        {   borderLeftColor: getPresetColor(props.entity), 
            borderLeftWidth: 3, 
            borderLeftStyle: "solid"}}>
        <DamageDisplay show={props.show} entity={props.entity} dmg={{amount: damage.amount, type: d.MELEE, ticks: 10}}></DamageDisplay>
        <DamageDisplay show={props.show} entity={props.entity} dmg={{amount: damage.amount, type: d.FALL, ticks: 10}}></DamageDisplay>
        <DamageDisplay show={props.show} entity={props.entity} dmg={{amount: damage.amount, type: d.EXPLOSION, ticks: 10}}></DamageDisplay>
        <DamageDisplay show={props.show} entity={props.entity} dmg={{amount: damage.amount, type: d.FIRE, ticks: 10}}></DamageDisplay>
        <DamageDisplay show={props.show} entity={props.entity} dmg={{amount: damage.amount, type: d.PROJECTILE, ticks: 10}}></DamageDisplay>
        <DamageDisplay show={props.show} entity={props.entity} dmg={{amount: damage.amount, type: d.MAGIC, ticks: 10}}></DamageDisplay>
    </tr>);
}
interface DamageDisplayType {
    dmg: Damage,
    entity: number,
    show: string
}
export function DamageDisplay(props: DamageDisplayType) {
    const entity : Entity = useAppSelector(selectEntity)[props.entity];

    const getContent = () => {
        if (props.show === EPF) {
            return (getSetEPF(entity.armor, props.dmg.type));
        }
        if (props.show === RESISTANCE) {
            return getResist() + "%";
        }
        if (props.show === TAKEN) {
            return (round(takeDamage(props.dmg, entity)));
        }
    }
    const getResist = () => {
        return (round(100- ( (takeDamage(props.dmg, entity))*100 / props.dmg.amount)));
    }
    return (
        <td 
            style={{backgroundColor:getColor(95,getResist())}}
        >
            {getContent()}
        </td>
    );
}