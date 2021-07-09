import { useState } from "react";
import { Form, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectDamages, selectEntity } from "../item/activeSlice";
import { DamageItem } from "../item/calculations/damage";
import { maxHealth, summary } from "../item/calculations/entity";
import { takeDamage } from "../item/utility/maths";
import { elementwiseAdd, getColor, getDeltaColor, getPresetColor, round } from "../item/utility/Utils";
import { getSeconds } from "../weapon/weapon";

export function Simulator() {
    const entities = useSelector(selectEntity);
    const damages = useSelector(selectDamages);
    const [percent, setPercent] = useState(false);
    const [showChanges, setShowChanges] = useState(false);
    const [showSteps, setShowSteps] = useState(true);
    const renderSettings = () => {
        return (
            <Form className="text-left p-1">
                <div key={"sim-settings"}>
                    <Form.Check custom inline label={"Steps"} type="checkbox" name="sim-settings"
                        checked={showSteps}
                        id={`simulator-settings-2`}
                        onChange={ (e) => setShowSteps(!showSteps)}
                    />
                    <Form.Check custom inline label={"Changes"} type="checkbox" name="sim-settings"
                        checked={showChanges}
                        id={`simulator-settings-1`}
                        onChange={ (e) => setShowChanges(!showChanges)}
                    />
                    
                    <Form.Check custom inline label={"Percents"} type="checkbox" name="sim-settings"
                        checked={percent}
                        id={`simulator-settings-3`}
                        onChange={ (e) => setPercent(!percent)}
                    />
                </div>
            </Form>
        );
    }
    const renderHeader = () => {
        return (
            <>
            <th>
            Attack
            </th>
            <th>
            Time
            </th>
            {entities.map( (item, index) => {
                return (
                    <>
                    
                    <th style={{
                        borderBottomColor: getPresetColor(index),
                        borderBottomWidth: 3,
                        borderBottomStyle: "solid",
                        color: getPresetColor(index)
                    }}>
                        {summary(item)}
                    </th>
                    </>
            )})}
            </>
        );
    }
    const renderBody = () => {
        let hp = entities.map((item) => maxHealth(item));
        let time = 0;
        let maxHp = entities.map((item) => maxHealth(item));
        const renderDamages = () => {
            let initial = (
                <SimulatorRow
                    deltaTime={0}
                    newTime={time}
                    deltaHp={entities.map( (item) => 0)}
                    newHp={hp}
                    maxHp={maxHp}
                    index={-1}
                    percent={percent}
                    type={"Initial"}
                    showChanges={false}
                    showResults={true}
                />
            );
            let rows = damages.map( (damageItem: DamageItem, index) => {
                if (damageItem.visible === false) {
                    return "";
                }
                let elements = [];
                for (let i = 0 ; i < damageItem.times ; i++) {
                    let damage = damageItem.dmg;

                    //update the values one step forward
                    time += damage.ticks;
                    let deltaHp = entities.map( (entity) => {
                        return -takeDamage(damage, entity);
                    });
                    hp = elementwiseAdd(hp, deltaHp);
                    
                    elements.push (<SimulatorRow
                        deltaTime={damage.ticks}
                        newTime={time}
                        deltaHp={deltaHp}
                        newHp={hp}
                        maxHp={maxHp}
                        index={index}
                        percent={percent}
                        type={damage.type}
                        showChanges={showChanges}
                        showResults={showSteps}
                    />);
                }
                return <>{elements}</>
            })

            return (<>
                {initial}
                <SimulatorRow
                deltaTime={0} deltaHp={[0]}
                newTime={time} newHp={hp}
                maxHp={maxHp} index={-2}
                percent={percent}
                type={"Final Result"}
                showChanges={false}
                showResults={true}
                />
                {showChanges || showSteps ? renderHeader() : ""}
                {rows}
            </>);
        }
        return (
            renderDamages()
        );
    }
    return (
        <>
        <div className="container-bottom">
            {renderSettings()}
        </div>
        <div className="container-bottom overflow-scroll h-simulator">
            
        <Table className="simulator-table text-left">
            <thead>
                <tr>
                    
                    {renderHeader()}
                </tr>
            </thead>
            <tbody>
                {renderBody()}
            </tbody>
        </Table>
        </div>
        </>
    );
}
interface SimulatorRowType {
    deltaTime: number,
    newTime: number,
    deltaHp: number[],
    newHp: number[],
    maxHp: number[],
    index: number,
    percent: boolean,
    type: string,
    showChanges: boolean,
    showResults: boolean
}
export function SimulatorRow(props: SimulatorRowType) {
    const [hover, setHover] = useState(false);
    const getPercent = (num: number, index: number) => {
        return round(num*100 / props.maxHp[index]);
    }
    const getContent = (num: number, index: number) => {
        if (props.percent) {
            return getPercent(num, index) + "%";
        } else {
            return round(num);
        }
    }
    const renderDeltas = () => {
        return (
            <tr onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <td id={"sim-delta-" + props.index} className="type-display">
                    {renderName()}
                </td>
                <td>
                    +{getSeconds(props.deltaTime)} sec
                </td>
                {
                props.deltaHp.map( (num, index) => {
                    return (
                    <td style={{backgroundColor:getDeltaColor(35,getPercent(num, index))}}>
                        {getContent(num, index)}
                    </td>);
                })
                }
            </tr>
        );
    }
    const renderResults = () => {
        return (
            <tr onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <td id={"sim-result-" + props.index} className="type-display">
                    {!props.showChanges ? renderName() : ""}
                </td>
                <td>
                    {getSeconds(props.newTime)} sec
                </td>
                {
                props.newHp.map( (num, index) => {
                    return (
                    <td style={{backgroundColor:getColor(100,getPercent(num, index))}}>
                        {getContent(num, index)}
                    </td>)
                })
                }
            </tr>
        );
    }
    const renderName = () => {
        return (
            hover ?
            props.type :
            props.type.substring(0, 25)
        )
    }
    return (
        <>
        {props.showChanges ? renderDeltas() : ""}
        {props.showResults ? renderResults() : ""}
        </>
    );
}