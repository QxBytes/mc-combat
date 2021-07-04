import functionPlot from "function-plot";

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
    return Color.hsl(180*(value/max),70,70);
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