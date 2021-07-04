import { useState } from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectDamages, selectEntity } from "../item/activeSlice";
import { Damage, DamageItem } from "../item/damage";
import { maxHealth, summary } from "../item/entity";
import { takeDamage } from "../item/maths";
import { elementwiseAdd, getPresetColor, round } from "../item/Utils";
import { getDamage, getSeconds, toString, Weapon } from "../weapon/weapon";

const ABSOLUTE = 'Absolute';
const PERCENT = 'Percent';
const SETTINGS = [ABSOLUTE, PERCENT];

export function Simulator() {
    const entities = useSelector(selectEntity);
    const damages = useSelector(selectDamages);
    const [setting, setSetting] = useState(ABSOLUTE);
    
    const renderHeader = () => {
        return entities.map( (item, index) => {
            return (
                <th style={{
                    borderBottomColor: getPresetColor(index),
                    borderBottomWidth: 3,
                    borderBottomStyle: "solid"
                }}>
                    {summary(item)}
                </th>
            );
        })
    }
    const renderBody = () => {
        let hp = entities.map((item) => maxHealth(item));
        let time = 0;
        let maxHp = entities.map((item) => maxHealth(item));
        return (
            damages.map( (damageItem: DamageItem, index) => {
                if (damageItem.visible === false) {
                    return "";
                }

                let damage = damageItem.dmg;

                //update the values one step forward
                time += damage.ticks;
                let deltaHp = entities.map( (entity) => {
                    return -takeDamage(damage, entity);
                });
                hp = elementwiseAdd(hp, deltaHp);
                
                return (<SimulatorRow
                    deltaTime={damage.ticks}
                    newTime={time}
                    deltaHp={deltaHp}
                    newHp={hp}
                    maxHp={maxHp}
                    index={index}
                    show={setting}
                    type={damage.type}
                />);
            })
        );
    }
    return (
        <div className="container-bottom h-90 overflow-scroll">
        <Table className="simulator-table text-left">
            <thead>
                <tr>
                    <th>
                        Order
                    </th>
                    <th>
                        Time
                    </th>
                    {renderHeader()}
                </tr>
            </thead>
            <tbody>
                {renderBody()}
            </tbody>
        </Table>
        </div>
    );
}
interface SimulatorRowType {
    deltaTime: number,
    newTime: number,
    deltaHp: number[],
    newHp: number[],
    maxHp: number[],
    index: number,
    show: string,
    type: string
}
export function SimulatorRow(props: SimulatorRowType) {
    const getContent = (num: number, index: number) => {
        if (props.show === ABSOLUTE) {
            return num;
        }
        if (props.show === PERCENT) {
            return num / props.maxHp[index];
        }
    }
    const renderDeltas = () => {
        return (
            <tr>
                <td>
                    {props.type}
                </td>
                <td>
                    +{getSeconds(props.deltaTime)} sec (+{props.deltaTime}) ticks
                </td>
                {
                props.deltaHp.map( (num, index) => {
                    return (<td>
                        {getContent(round(num), index)}
                    </td>);
                })
                }
            </tr>
        );
    }
    const renderResults = () => {
        return (
            <tr>
                <td>

                </td>
                <td>
                    {getSeconds(props.newTime)} sec ({props.deltaTime}) ticks
                </td>
                {
                props.newHp.map( (num, index) => {
                    return (<td>
                        {getContent(round(num), index)}
                    </td>)
                })
                }
            </tr>
        );
    }
    return (
        <>
        {renderDeltas()}
        {renderResults()}
        </>
    );
}