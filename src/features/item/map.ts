export interface Entry<K,V>{
    key: K,
    value: V
}
export function shallowCopy<K,V>(item: Entry<K,V>) {
    return {key: item.key, value: item.value};
}
export function has<K,V>(e: Entry<K, V>[], type: K) : boolean {
    return get<K,V>(e, type) ? true : false;
}
export function getValue<K,V>(e: Entry<K, V>[], type: K, fallback: V) : V {
    if (get<K,V>(e, type)) {
        return get<K,V>(e, type)!.value;
    }
    return fallback;
}
export function get<K,V>(e: Entry<K, V>[], type: K) : Entry<K,V> | undefined {
    for (let item of e) {
        if (item.key === type) {
            return item;
        }
    }
    return undefined;
}
export function set<K,V>(e: Entry<K, V>[], type: K, value: V) {
    if (get(e, type)) {
        get(e, type)!.value = value;
    } else {
        e.push({key: type, value: value});
    }
} 
export function remove<K,V>(e: Entry<K,V>[], type: K) {
    let index = -1;
    e.forEach( (item, i) => {
        if (item.key === type) {
            index = i;
        }
    })
    e.splice(index, 1);
}