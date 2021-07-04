import functionPlot from "function-plot";
import React from "react";
import { Row, Col, ButtonGroup, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/hooks";
import { addSetup, removeSetup, selectEntity } from "./activeSlice";
import { Entity, getDefaultSetup, maxSetups, summary } from "./entity";
import { EntityContainer } from "./EntityContainer";
import Icon from "./Icons";
import { Collapseable } from "./Parts";

const _ = require('lodash');

export function SetupContainer() {
    const entities : Entity[] = useSelector(selectEntity);
    const dispatch = useAppDispatch();
    
    return (
        <div className="container-top">
            <Row noGutters>
                <Col>
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
                                {   borderLeftColor:functionPlot.globals.COLORS[index], 
                                    borderLeftWidth:3, 
                                    borderLeftStyle:"solid"}
                                }
                        >
                            <Collapseable inner={<EntityContainer entity={index}/>}
                                title={summary(item)}
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
                                            <Icon val="close" />
                                        </Button> : ""
                                        }
                                        
                                    </ButtonGroup>
                                    </React.Fragment>
                                }
                                className="w-80"
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