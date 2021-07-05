import functionPlot from "function-plot";
import { bound } from "./maths";

var Color = require('color');
export function range(from: number, to: number) {
    let arr : number[] = [];
    for (let i = from ; i < to ; i++) {
        arr.push(i);
    }
    return arr;
}
export function round(num : number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}
export function getColor(max: number, value: number) {
    return Color.hsl(180*(bound(value/max,0,1)),70,70);
}
export function getDeltaColor(max: number, value: number) {
    if (value > 0) {
        return Color.rgb(255 - (-value/max*255), 255, 255 - (-value/max*255));
    } else {
        return Color.rgb(255, 255 - (-value/max*255), 255 - (-value/max*255));
    }
}
export function getPresetColor(index: number) {
    return functionPlot.globals.COLORS[index];
}
export function elementwiseAdd(origin: number[], addThis: number[]) {
    let temp = [];
    for (let i = 0 ; i < addThis.length ; i++) {
        temp.push(origin[i] + addThis[i]);
    }
    return temp;
}