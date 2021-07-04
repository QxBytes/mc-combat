import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectEntity, selectDamage, setDamageType } from "./activeSlice";
import { getSetEPF } from "./armor";
import { Damage } from "./damage";
import { Entity } from "./entity";
import { takeDamage } from "./maths";
import { getColor, round } from "./Utils";
import * as d from './damageTypes';
import { Col, Form, Table } from "react-bootstrap";
import functionPlot from "function-plot";

const TAKEN = "Damage Taken";
const RESISTANCE = "% Resistance";
const EPF = "EPF (Enchantment Protection Factor)";
const SETTINGS = [TAKEN, RESISTANCE, EPF];

export function DamageSummaryTable() {
    const entities: Entity[] = useAppSelector(selectEntity);
    const [show, setShow] = useState(TAKEN);
    return (
        <Col>
            
            <Table className="damage-summary-table">
                <thead>
                    <tr>
                        <DamageHeader type={d.MELEE} />
                        <DamageHeader type={d.FALL} />
                        <DamageHeader type={d.EXPLOSION} />
                        <DamageHeader type={d.FIRE} />
                        <DamageHeader type={d.PROJECTILE} />
                        <DamageHeader type={d.MAGIC} />
                    </tr>
                </thead>
                <tbody>
                    {
                        entities.map( (item, index) => {
                            return (<DamageSummary entity={index} show={show}/>);
                        })
                    }
                </tbody>
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
    );
}
interface DamageHeaderType {
    type: string
}
export function DamageHeader(props: DamageHeaderType)  {
    const [hover, setHover] = useState(false);
    const damage : Damage = useAppSelector(selectDamage);
    const dispatch = useAppDispatch();
    return (
        <th onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}
        className={hover || damage.type.includes(props.type) ? "highlighted fade-transition" : "fade-transition"}
        onClick={ () => dispatch(setDamageType(props.type))}
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
        {   borderLeftColor:functionPlot.globals.COLORS[props.entity], 
            borderLeftWidth:3, 
            borderLeftStyle:"solid"}}>
        <DamageDisplay show={props.show} entity={props.entity} dmg={{amount: damage.amount, type: d.MELEE}}></DamageDisplay>
        <DamageDisplay show={props.show} entity={props.entity} dmg={{amount: damage.amount, type: d.FALL}}></DamageDisplay>
        <DamageDisplay show={props.show} entity={props.entity} dmg={{amount: damage.amount, type: d.EXPLOSION}}></DamageDisplay>
        <DamageDisplay show={props.show} entity={props.entity} dmg={{amount: damage.amount, type: d.FIRE}}></DamageDisplay>
        <DamageDisplay show={props.show} entity={props.entity} dmg={{amount: damage.amount, type: d.PROJECTILE}}></DamageDisplay>
        <DamageDisplay show={props.show} entity={props.entity} dmg={{amount: damage.amount, type: d.MAGIC}}></DamageDisplay>
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