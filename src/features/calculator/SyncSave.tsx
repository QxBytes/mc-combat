import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveDamage, selectDamage, setDamage, setDamageTicks, setDamageType } from "../activeSlice";
import { Damage, equals } from "../calculations/damage";
import Icon from "../utility/Icons";
import { HalfHeart } from "../utility/Parts";
import { round } from "../utility/Utils";

interface SyncSaveType {
    dmg: Damage,
    label?: string
}
export function SyncSave(props: SyncSaveType) {
    const dispatch = useDispatch();
    const stagedDamage = useSelector(selectDamage);
    const stageDamage = () => {
        dispatch(setDamageType(props.dmg.type));
        dispatch(setDamage(props.dmg.amount));
        dispatch(setDamageTicks(props.dmg.ticks));
    }
    const save = () => {
        stageDamage();
        dispatch(saveDamage(props.dmg));
    }
    return (
        <>
        <HalfHeart />
                {/*
                    disabled={equals(stagedDamage, props.dmg)}
                    You cannot have props.dmg because props.dmg is an object!
                    Apply align-middle to the element you want to align, not the container.
                */}
        <span className={"align-middle"}>{round(props.dmg.amount)}</span>
        <ButtonGroup>
            <Button 
            className={"align-middle"}
            disabled={equals(stagedDamage, props.dmg)}
            onClick={ () => {
                stageDamage();
            }}>
                <Icon val="sync"/>
            </Button>
            <Button 
            className={"pl-0"}
            onClick={ () => {
                stageDamage();
                save();
            }}>
                <Icon val="add" />
                <span className={"align-middle"}>Add to Simulator</span>
            </Button>
        </ButtonGroup>
        </>
    );
}
export function SyncSaveRow(props: SyncSaveType) {
    return (
        <Row>
            <Col md={6} lg={8}>
            </Col>
            <SyncSaveColumn dmg={props.dmg} label={props.label} />
        </Row>
    );
}
export function SyncSaveColumn(props: SyncSaveType) {
    return (
        <Col md={6} lg={4} className="text-right">
                <span className="align-middle">{props.label}</span>
                <SyncSave dmg={props.dmg}/>
        </Col>
    );
}