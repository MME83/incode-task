module.exports = {
    getPropValues: (obj, prop) => 
        (res => (JSON.stringify(obj, (key, value) =>
        (key === prop && res.push(value), value)), res))([])
};
