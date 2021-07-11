import React, { useState } from "react";
import { Button, ButtonGroup, Col, Form, Row } from "react-bootstrap";
import NumericInput from "react-numeric-input";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/hooks";
import { selectDamage, setDamageType, setDamage, setDamageTicks } from "../activeSlice";
import { Damage, equals } from "../calculations/damage";
import { getEffect, setEffect, STRENGTH, WEAKNESS } from "../calculations/effects";
import { SHARPNESS } from "../calculations/enchants";
import { SyncSave } from "../calculator/SyncSave";
import { ItemBadge } from "../setups/EnchantContainer";
import { Tip } from "../utility/Icons";
import { DropInput, Collapseable } from "../utility/Parts";
import { round, range } from "../utility/Utils";
import { AXE, defaultWeapon, FIST, fullCharge, getDamage, getDamageMultiplier, getSeconds, getTicks, MIN_CRITICAL_CHARGE, percentCharge, preset, SWORD, toString, TRIDENT, Weapon, WEAPONS, WEAPON_MATERIALS } from "./weapon";
import { WeaponDamageGraph } from "./WeaponDamageGraph";
import { WeaponGraph } from "./WeaponGraph";



const _ = require('lodash');
export function WeaponEditor() {
    const dispatch = useAppDispatch();
    const globalDamage = useSelector(selectDamage);
    const [weapon, setActualWeapon] = useState(defaultWeapon());
    const setWeapon = (w: Weapon) => {
        setActualWeapon(w);
        dispatch(setDamageType(toString(w)));
        dispatch(setDamage(getDamage(w)));
        dispatch(setDamageTicks(w.ticksSinceLast))
    }
    const c = () => {
        return _.cloneDeep(weapon);
    }
    const getDamageObj = (w: Weapon): Damage => {
        return {amount: getDamage(w), ticks: w.ticksSinceLast, type: toString(w)}
    }
    
    return (
        <div className={equals(getDamageObj(weapon), globalDamage) ? "active-calculator" : "inactive-calculator"}>
        <Row>
            
        <Col xs={12} lg={6} className="text-left">
            <Row className="text-left">
                <Col>
                <ButtonGroup>
                <DropInput 
                selected={weapon.type}
                inputs={WEAPONS}
                onDropClicked={(val) => {
                    const x = c(); preset(x, val, x.material); setWeapon(x);
                }}
                />
                {
                    weapon.type === TRIDENT ||
                    weapon.type === FIST ? "" :
                    <DropInput 
                    selected={weapon.material}
                    inputs={WEAPON_MATERIALS.get(weapon.type)!}
                    onDropClicked={(val) => {
                        const x = c(); preset(x, x.type, val); setWeapon(x);
                    }}
                    />
                }
                </ButtonGroup>
                
                <Form.Check custom inline label={"Attempt Critical"} type="checkbox" name="critical"
                    checked={weapon.critical}
                    id={`critical`}
                    onChange={ (e) => {
                        const x = c(); x.critical = !weapon.critical; setWeapon(x);
                    }}
                />
                { 
                getDamageMultiplier(weapon) < MIN_CRITICAL_CHARGE ? 
                <>
                <span id="no-critical">❌ No critical hit</span>
                <Tip 
                    target="no-critical"
                    val="Wait longer between attacks to perform a critical"
                    pos="top"
                />
                </>
                : ""
                }
                </Col>
            </Row>
            <Row>
                <Col>
                <span className="p-1"> Wait 
                <NumericInput className="align-middle"  min={0.05} max={20} step={.05} precision={3} 
                        value={getSeconds(weapon.ticksSinceLast)}
                        onChange={(valueAsNumber:(number|null), stringValue:string, el: HTMLInputElement) => {
                        //Poor documentation
                            if (valueAsNumber) {
                                const x = c(); x.ticksSinceLast = getTicks(valueAsNumber); setWeapon(x);
                            }
                        }}
                        format={(num) => num + " s (" + (getTicks(num||0)) + " ticks, " + 
                        percentCharge(weapon) + "%)"}
                />
                before attack
                </span>
                <Button onClick={ () => {
                    const x = c(); x.ticksSinceLast = round(fullCharge(x)); setWeapon(x);}}>
                    max
                </Button>
                </Col>
            </Row>
        </Col>
        <Col xs={12} lg={6} className="text-left">
            { 
            weapon.type === SWORD ||
            weapon.type === AXE ?
            <ItemBadge 
                name={SHARPNESS.key}
                value={weapon.sharpness}
                getValidValues={ () => {
                    return (range(1, SHARPNESS.value+1))}}
                onValueChange={(val) => {
                    const x = c(); x.sharpness = (val); setWeapon(x);
                }}
                onDelete={() => {const x = c(); x.sharpness = (0); setWeapon(x);}}
            /> : ""
            }
            <ItemBadge 
                name={STRENGTH.key}
                value={(getEffect(weapon.effects, STRENGTH.key) || {value:0}).value}
                getValidValues={ () => {
                    return (range(1, 3))}}
                onValueChange={(val) => {
                    const x = c(); setEffect(x.effects, STRENGTH.key, (val)); setWeapon(x);
                }}
                onDelete={() => {const x = c(); setEffect(x.effects, STRENGTH.key, (0)); setWeapon(x)}}
            />
            <ItemBadge 
                name={WEAKNESS.key}
                value={(getEffect(weapon.effects, WEAKNESS.key) || {value:0}).value}
                getValidValues={ () => {
                    return (range(1, 2))}}
                onValueChange={(val) => {
                    const x = c(); setEffect(x.effects, WEAKNESS.key, (val)); setWeapon(x);
                }}
                onDelete={() => {const x = c(); setEffect(x.effects, WEAKNESS.key, (0)); setWeapon(x);}}
            />
            
        </Col>
        </Row>
        <Row>
            <Col className="vc">
                <span className="p-1">DPS: {round(getDamage(weapon) / getSeconds(weapon.ticksSinceLast))}</span>
                {weapon.ticksSinceLast < 10 ? 
                <span>⚠️ Damage triggers 0.5 sec immunity</span>
                : ""}
            </Col>
            <Col className="text-right">
                <SyncSave dmg={getDamageObj(weapon)} />
            </Col>
        </Row>
        <Row>
            <Col>
        <Collapseable
            title={"Weapon Damage Graphs"}
            inner={(
                <Row>
                <WeaponGraph 
                weapon={weapon}
                />
                <WeaponDamageGraph 
                weapon={weapon}
                />
                </Row>
            )}
            className={"w-100"}
        />
        </Col>
        </Row>
        </div>
    )
}

