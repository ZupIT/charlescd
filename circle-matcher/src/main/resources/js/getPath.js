//This Source Code Form is subject to the terms of the Mozilla Public
//License, v. 2.0. If a copy of the MPL was not distributed with this
//file, You can obtain one at https://mozilla.org/MPL/2.0/.

function getPath(object, path) {

    if (object == null || path == null) {
        return null;
    }

    var index = -1,
        pathArr = path.split('\.');

    while (object != null && ++index < pathArr.length) {
        object = object[pathArr[index]];
    }
    return object;
}