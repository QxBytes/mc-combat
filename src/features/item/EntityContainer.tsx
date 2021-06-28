import { ArmorSlot } from "./ArmorSlot";

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
        </div>
    );
}