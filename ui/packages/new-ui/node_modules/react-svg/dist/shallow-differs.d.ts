interface O {
    [key: string]: any;
}
declare const shallowDiffers: (a: O, b: O) => boolean;
export default shallowDiffers;
