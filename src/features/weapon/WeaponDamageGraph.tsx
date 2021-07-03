import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectDamage } from "../item/activeSlice";
import { CollapsableGraph } from "../item/DamageGraph";
import { getDamageEquation, Weapon } from "./weapon";

export interface WeaponDamageGraphType {
    weapon: Weapon
}
export function WeaponDamageGraph(props: WeaponDamageGraphType) {
    const damage = useSelector(selectDamage);
    const getFunctions = () => {
        let data = [];
        let attackDamageEquation = getDamageEquation(props.weapon);
        data.push( attackDamageEquation );
        return data;
    }
    return (
        <Col xs={12} lg={6} id="wrapper4">
        <CollapsableGraph
        data={getFunctions()}
        annotations={[{text:"1 second", x: 20}]}
        widthReference="wrapper4"
        target="weaponDamageGraphPane"
        title={"Raw Melee Damage Dealt"}
        xAxis={ { domain: [0, 20], label: "Time before attack (ticks) - 1 sec = 20 ticks"} }
        yAxis={ {domain: [0, damage.amount], label: "Damage"} }
        />
        </Col>
    );
}