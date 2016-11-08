export function delay(time, value) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(value), time);
    });
}

delay.pass = function(time) {
    return function(value) {
        return delay(time, value);
    }
};

export default { delay };
