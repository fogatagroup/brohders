export const round = (value: number)=> {
    let floor = Math.floor(value);
    let rounded = floor == Math.floor(value + 0.5) ? floor : Math.ceil(value);
    console.log("ROUNDED", rounded);
    return rounded;
}