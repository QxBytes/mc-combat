import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectDamage, selectEntity } from "../item/activeSlice";
import { CollapsableGraph } from "../item/DamageGraph";
import { MELEE } from "../item/calculations/damageTypes";
import { damageEquation, takeDamage } from "../item/utility/maths";
import { fullChargeDamage, getDamage, getDamageEquation, Weapon } from "./weapon";

export interface WeaponGraphType {
    weapon: Weapon
}
export function WeaponGraph(props: WeaponGraphType) {
    const entity = useSelector(selectEntity);
    const damage = useSelector(selectDamage);
    const getFunctions = () => {
        let data = [];
        for (let item of entity) {
            let eq = damageEquation({amount: 1, type: MELEE, ticks: 10}, item);
            let attackDamageEquation = getDamageEquation(props.weapon);
            //console.log("Substituted in: " + (eq.replaceAll("x ", "[" + attackDamageEquation + "]")));
            data.push( (eq.replaceAll("x ","("+ attackDamageEquation + ")")) );
        }
        return data;
    }
    return (
        <Col xs={12} lg={6} id="wrapper3">
        <CollapsableGraph
        data={getFunctions()}
        annotations={[{text:"1 second", x: 20}, {text:"Your Attack", x: props.weapon.ticksSinceLast}]}
        widthReference="wrapper3"
        target="weaponGraphPane"
        title={"True Melee Damage Dealt"}
        xAxis={ { domain: [0, Math.max(25, props.weapon.ticksSinceLast+5)], label: "Time before attack"} }
        yAxis={ {domain: [0, fullChargeDamage(props.weapon)+3], label: "Damage"} }
        hidden={true}
        />
        </Col>
    );
}