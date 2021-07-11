import { Row } from "react-bootstrap";
import { ArmorSlot } from "./ArmorSlot";
import { EffectContainer } from "./EffectContainer";

interface ArmorContainerType {
    entity: number
}
export function EntityContainer(props: ArmorContainerType) {
    return (
        <div className="">
          <ArmorSlot entity={props.entity} slot={0}/>
          <ArmorSlot entity={props.entity} slot={1}/>
          <ArmorSlot entity={props.entity} slot={2}/>
          <ArmorSlot entity={props.entity} slot={3}/>
          <Row>
              <EffectContainer entity={props.entity} />
          </Row>
        </div>
    );
}