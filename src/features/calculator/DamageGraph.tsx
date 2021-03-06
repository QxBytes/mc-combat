import functionPlot from "function-plot";
import { FunctionPlotAnnotation, FunctionPlotOptions } from "function-plot/dist/types";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Col, Collapse, Row } from "react-bootstrap";
import { useAppSelector } from "../../app/hooks";
import { selectDamage, selectEntity } from "../activeSlice";
import { Damage } from "../calculations/damage";
import { baseDamageType } from "../calculations/damageTypes";
import { Entity, MAX_SETUPS } from "../calculations/entity";
import Icon from "../utility/Icons";
import { damageEquation } from "../utility/maths";
import { range } from "../utility/Utils";


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
    data: string[],
    annotations: FunctionPlotAnnotation[],
    widthReference: string,
    target: string,
    title: string,

    xAxis: {domain: number[], label: string},
    yAxis: {domain: number[], label: string},

    hidden?: boolean
}
export function CollapsableGraph(props: CollapsableGraphType) {
    const [width, height] = useWindowSize();
    const [toggle, setToggle] = useState(false);
    
    const options : FunctionPlotOptions = {
        target: "#" + props.target,
        title: props.title,
        annotations: props.annotations,
        height: 350,
        width: 100,
        yAxis: { domain: props.yAxis.domain, label: props.yAxis.label },
        xAxis: { domain: props.xAxis.domain, label: props.xAxis.label },
        grid: true,
        data: range(0, MAX_SETUPS).map( (item) => {
            return {fn: "-999999", nSamples:1000, range:[0,200]}
        })
    };

    const refresh = () => {
        //This function is not called for some reason.
        //Cannot be called from inside useEffect.
        options.title = props.title;
        options.annotations = props.annotations;
        options.width = document.getElementById(props.widthReference)!.clientWidth;
        options.yAxis = { domain: props.yAxis.domain, label: props.yAxis.label };
        options.xAxis = { domain: props.xAxis.domain, label: props.xAxis.label };

        options.data = props.data.map( (item) => {
            return {fn: item, range:[0,200], graphType:'polyline'}
        });
        for (let i = props.data.length ; i <= MAX_SETUPS ; i++) {
            options.data.push({fn: "-999999",  range:[0,0]});
        }
        functionPlot(options)
    }
    useEffect(refresh);
    return (
        <Row noGutters>
            { !props.hidden ? "" :
                <Button 
                    className="collapse-btn pr-2"
                    onClick={ () => {
                        setToggle(!toggle); refresh();
                    } }
                >
                    {
                        toggle ? 
                        <Icon val="expand_more"/> :
                        <Icon val="chevron_right"/>
                    }
                    { props.title }
                </Button>
            }
                <Collapse in={toggle}>
                    <div id={props.target} className="graph"></div>
                </Collapse>
        </Row>
    );
}
export function DamageGraph() {
    const entity : Entity[] = useAppSelector(selectEntity);
    const damage : Damage = useAppSelector(selectDamage);
    const getFunctions = () => {
        let data = [];
        for (let item of entity) {
            data.push( damageEquation(damage, item) );
        }
        return data;
    }
    const getPercents = () => {
        let data = [];
        for (let item of entity) {
            //console.log( "(100 - 100* ((" + damageEquation(damage, item) + ")))/x");
            data.push( "(100 - 100* ((" + damageEquation(damage, item) + "))/x)");
        }
        return data;
    }
    return (
        <React.Fragment>
            <Row>
        <Col xs={12} lg={6} id="wrapper">
        {/*damageEquation(damage,entity)*/}
            <CollapsableGraph 
                data={getFunctions()}
                annotations={[{text:"Damage", x: damage.amount}]}
                widthReference="wrapper"
                target="graphPane"
                title={baseDamageType(damage.type) + " Damage Curve"}
                xAxis={ { domain: [0, Math.max(25, damage.amount+10)], label: "Damage before reduction"} }
                yAxis={ {domain: [0, Math.max(25, damage.amount+10)], label: "Damage after reduction"} }
                hidden
            />
        </Col>
        <Col xs={12} lg={6} id="wrapper2">
            <CollapsableGraph 
                data={getPercents()}
                annotations={[{text:"Damage", x: damage.amount}]}
                widthReference="wrapper2"
                target="percentGraphPane"
                title={baseDamageType(damage.type) + " % Damage Curve"}
                xAxis={ { domain: [0, Math.max(25, damage.amount+10)], label: "Damage"} }
                yAxis={ {domain: [0, 100], label: "% Damage Mitigated"} }
                hidden
            />
        </Col>
        </Row>
        </React.Fragment>
    );
}
