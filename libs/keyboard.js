window.addEventListener('keyup', function (event) {
    Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function (event) {
    Key.onKeydown(event);
}, false);


var Key = {
    _pressed: {},

    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,

    LT: 79,
    GT: 80,

    SPACE: 32,

    LEFTARROW: 37,
    UPARROW: 38,
    RIGHTARROW: 39,
    DOWNARROW: 40,

    isDown: function (keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown: function (event) {
        this._pressed[event.keyCode] = true;
    },

    oneDown: function (keyCodes) {
        for (var i = 0; i < keyCodes.length; i++) {
            if (this._pressed[keyCodes[i]])
                return true;
        }
        return false;
    },

    onKeyup: function (event) {
        delete this._pressed[event.keyCode];
    }
};


/*
    window.addEventListener("keydown", function(evt) {
        alert("keydown: " + evt.keyCode);
    }, false);
*/