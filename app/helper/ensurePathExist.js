/* eslint-disable no-unsafe-finally */
const fs = require('fs');


const mkdir = (path) => {
    try {
        fs.mkdirSync(path);
    } catch (error) {
        if (error.code === 'EEXIST') {
            return true; // ignore the error if the folder already exists
        } else if (error.code === 'ENOENT') {
            if(mkdir(popper(path.split('/')).join('/'))) {
                return mkdir(path);
            }
            return false;
        } else {
            return false; // something else went wrong
        }
    } finally {
        return true;
    }
};

const popper = (arr) => {
    arr.pop();
    return arr;
};

exports.mkdir = mkdir;