export function range(from: number, to: number) {
    let arr : number[] = [];
    for (let i = 0 ; i < to ; i++) {
        arr.push(i);
    }
    return arr;
}
export function round(num : number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}