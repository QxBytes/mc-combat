import { useState } from "react";
import { Button } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectEntity, setType } from "../item/activeSlice";
import { LEATHER, MATERIAL_ARRAY } from "./armor";
import { Entity } from "./entity";


export function ArmorSlot() {
    const entity : Entity = useAppSelector(selectEntity);
    const dispatch = useAppDispatch();
    const [curr, setCurr] = useState(0);
    return (
        <div>
            
        <Button onClick={() => dispatch(setType({type: 'golden', slot: 0}))}>
            {entity.getHelmet().armor}
        </Button>
        <Button>
            {entity.getChestplate().armor}
        </Button>
        <Button>
            {entity.getLeggings().armor}
        </Button>
        <Button>
            {entity.getBoots().armor}
        </Button>
        
        </div>
    )
}