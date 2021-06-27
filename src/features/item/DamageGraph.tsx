import { timeStamp } from "console";
import functionPlot from "function-plot";
import { FunctionPlotAnnotation } from "function-plot/dist/types";
import React from "react";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button, ButtonGroup, Col, Collapse, Row } from "react-bootstrap";
import { propTypes } from "react-bootstrap/esm/Image";
import { useAppSelector } from "../../app/hooks";
import { selectDamage, selectEntity } from "./activeSlice";
import { Damage } from "./damage";
import { Entity } from "./entity";
import Icon from "./Icons";
import { damageEquation } from "./maths";

//https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}
interface CollapsableGraphType {
    fn: string,
    annotations: FunctionPlotAnnotation[],
    widthReference: string,
    target: string,
    title: string,

    xAxis: {domain: number[], label: string},
    yAxis: {domain: number[], label: string}
}
export function CollapsableGraph(props: CollapsableGraphType) {
    const [width, height] = useWindowSize();
    const [toggle, setToggle] = useState(true);
    
    const refresh = () => {
        //This function is not called for some reason.
        //Cannot be called from inside useEffect.
        functionPlot({
            target: "#" + props.target,
            title: props.title,
            annotations: props.annotations,
            height: 350,
            width: document.getElementById(props.widthReference)!.clientWidth,
            yAxis: { domain: props.yAxis.domain, label: props.yAxis.label },
            xAxis: { domain: props.xAxis.domain, label: props.xAxis.label },
            grid: true,
            data: [
              {
                fn: props.fn,
                range:[0,10000]
              }
            ]
        });
    }
    useEffect(refresh);
    return (
        <Row>
                <Button 
                    className="collapse-btn"
                    onClick={ () => {setToggle(!toggle); refresh()} }
                >
                    {
                        toggle ? 
                        <Icon val="expand_less"/> :
                        <Icon val="expand_more"/>
                    }
                    { props.title }
                </Button>
                <Collapse in={toggle}>
                    <div id={props.target} className="graph"></div>
                </Collapse>
        </Row>
    );
}
export function DamageGraph() {
    const entity : Entity = useAppSelector(selectEntity);
    const damage : Damage = useAppSelector(selectDamage);
    return (
        <React.Fragment>
        <Col xs={12} lg={6} id="wrapper">
        {/*damageEquation(damage,entity)*/}
            <CollapsableGraph 
                fn={damageEquation(damage, entity)}
                annotations={[{text:"-------------------------------------------------------", x: damage.amount}]}
                widthReference="wrapper"
                target="graphPane"
                title={damage.type + " Damage Curve"}
                xAxis={ { domain: [0, 40], label: "Damage before reduction"} }
                yAxis={ {domain: [0, 40], label: "Damage after reduction"} }
            />
        </Col>
        <Col xs={12} lg={6} id="wrapper2">
            <CollapsableGraph 
                fn={"(100 - 100* ((" + damageEquation(damage, entity) + ")/x))"}
                annotations={[{text:"-------------------------------------------------------", x: damage.amount}]}
                widthReference="wrapper2"
                target="percentGraphPane"
                title={damage.type + " % Damage Curve"}
                xAxis={ { domain: [0, 40], label: "Damage"} }
                yAxis={ {domain: [0, 100], label: "% Damage Mitigated"} }
            />
        </Col>
        </React.Fragment>
    );
}
