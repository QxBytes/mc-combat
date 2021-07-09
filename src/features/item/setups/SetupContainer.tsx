import React, { useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../app/hooks";
import { addSetup, removeSetup, selectEntity } from "../activeSlice";
import { getSetArmor, getSetToughness } from "../calculations/armor";
import { Entity, getDefaultSetup, maxHealth, maxSetups, summary } from "../calculations/entity";
import Icon from "../utility/Icons";
import { ArmorBar, Collapseable, HealthBar, ToughnessBar } from "../utility/Parts";
import { getPresetColor } from "../utility/Utils";
import { EntityContainer } from "./EntityContainer";
const Scroll   = require('react-scroll');
const Element  = Scroll.Element;
const _ = require('lodash');

export function SetupContainer() {
    const entities : Entity[] = useSelector(selectEntity);
    const dispatch = useAppDispatch();
    const [active, setActive] = useState(0);
    
    return (
        <div className="container-top">
            <Row noGutters>
                <Col>
                    <Element name="setup-link"></Element>
                    <h3 className="text-left bottom-border p-1">Setups</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                {
                entities.map( (item, index) => {
                    return (
                    <Row noGutters>
                        <Col xs={12} className="text-left pl-2"
                            style={
                                {   borderLeftColor: getPresetColor(index), 
                                    borderLeftWidth: 3, 
                                    borderLeftStyle: "solid"}
                                }
                        >
                            <Collapseable inner={<EntityContainer entity={index}/>}
                                title={
                                    <>
                                    <span>{" " + summary(item) + " "}</span>
                                    <ArmorBar armor={getSetArmor(item.armor)} />
                                    <span> | </span>
                                    <ToughnessBar toughness={getSetToughness(item.armor)} />
                                    <span> | </span>
                                    <HealthBar health={maxHealth(item)} />
                                    </>
                                }
                                options={
                                    <React.Fragment>
                                    
                                    <ButtonGroup>
                                            {!maxSetups(entities) ?
                                        <Button onClick={() => 
                                            dispatch(addSetup(
                                                _.cloneDeep(item)
                                            ))}
                                        >
                                            <Icon val="content_copy" />
                                        </Button> : ""
                                        }
                                        {entities.length > 1 ?
                                        <Button onClick={() => dispatch(removeSetup(index))}>
                                            <Icon val="delete_outline" />
                                        </Button> : ""
                                        }
                                        
                                    </ButtonGroup>
                                    </React.Fragment>
                                }
                                className="w-80"
                                override={active === index ? "open" : "closed"}
                                handleCollapse={(open) => {
                                    if (open) {
                                        setActive(index);
                                    } else {
                                        setActive(-1);
                                    }
                                }}
                            />
                            
                        </Col>
                    </Row>
                    
                    );
                })
                }
                    <Row noGutters>
                        <Col>
                        {
                        !maxSetups(entities) ?
                        <Button onClick={() => dispatch(addSetup(getDefaultSetup()))}>
                            <Icon val="add" />
                        </Button> : ""
                        }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}