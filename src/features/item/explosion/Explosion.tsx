import update from "immutability-helper";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import NumericInput from "react-numeric-input";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../app/hooks";
import { selectDamage } from "../activeSlice";
import { equals } from "../calculations/damage";
import { EXPLOSION } from "../calculations/damageTypes";
import { SyncSaveRow } from "../SyncSave";
import { DropInput, sync } from "../utility/Parts";

export function Explosion() {
    const dispatch = useAppDispatch();
    const globalDamage = useSelector(selectDamage);
    const [localDamage, setDamage] = useState( {amount: 57, type: EXPLOSION, ticks: 10} )
    const [power, setPower] = useState(4);
    const [distance, setDistance] = useState(0);
    const [exposure, setExposure] = useState(1);
    const EASY = 'Easy (x 0.5)';
    const NORMAL = 'Normal (x 1.0)';
    const HARD = 'Hard (x 1.5)';
    const [difficulty, setDifficulty] = useState(NORMAL);

    const EXPLOSION_TYPES = [
        "7 Wither Explosion", "6 End Crystal", "6 Charged Creeper",
        "5 Bed Explosion", "5 Respawn Anchor Explosion", "4 TNT",
        "3 Creeper", "1 Ghast Fireball", "1 Wither Skull", "0 Custom"
    ];
    const [type, setType] = useState("4 TNT");

    const explosionDamage = (power: number, distance: number, exposure: number, difficulty: string) : number => {
        
        let radius = 2 * power;
        if (distance >  radius) return 0;
        let impact = (1 - (distance / radius)) * exposure;
        let multiplier = 1;
        if (difficulty === EASY) multiplier = .5;
        if (difficulty === HARD) multiplier = 1.5;
        return Math.floor( (impact * impact + impact) * 7 * power * multiplier + 1);
    }
    useEffect( () => {
        setDamage(
            update(localDamage, 
                {amount: {$set: explosionDamage(power, distance, exposure, difficulty)}}));
        sync(dispatch, localDamage);
    }, [localDamage, power, distance, exposure, difficulty, type, dispatch]);
    return (
        <div className={
            equals(localDamage, globalDamage)
            ? "active-calculator" : "inactive-calculator"}>
        <Row className="p-1">
            <Col>
            
                <span>Explosion Power </span>
                
                <NumericInput  min={0} max={10000} step={1} value={power}
                    onChange={(valueAsNumber:(number|null)) => {
                        setType("0 Custom");
                        setPower(valueAsNumber||0);
                    }}
                />
                <DropInput
                    className={"d-inline-block"}
                    inputs={EXPLOSION_TYPES}
                    selected={type}
                    onDropClicked={(val) => {
                        setType(val);
                        setPower(parseInt(val.split(" ")[0]));
                    }}
                />
                
            </Col>
        </Row>
        <Row className="p-1">
            <Col>
            
            <div className="no-wrap d-inline-block">
            <span>Distance </span>
            <NumericInput  min={0} max={10000} step={.1} value={distance}
                onChange={(valueAsNumber:(number|null)) => {
                    setDistance(valueAsNumber||0);
                }}
            />
            </div>
            <div className="no-wrap d-inline-block">
            <span>Exposure </span>
            <NumericInput  min={0} max={100} step={1} value={exposure * 100}
                onChange={(valueAsNumber:(number|null)) => {
                    setExposure( (valueAsNumber||0)/100);
                }}
                format={(val) => (val||0) + "%"}
            />
            </div>
            </Col >
        </Row>
        <Row className="p-1">
            <Col>
            <span>Difficulty </span>
            <DropInput
            className="d-inline-block"
            selected={difficulty}
            inputs={[EASY, NORMAL, HARD]}
            onDropClicked={(val) => setDifficulty(val)}
            />
            </Col>
        </Row>
        
        <SyncSaveRow dmg={localDamage} label={"Explosion"}/>
        </div>
    );
}