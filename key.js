let canvas,
    ctx,
    time = 0.0,
    keyState = [],
    ripple = [];

function rgba(r, g, b, a) {
    return `rgba(${r},${g},${b},${a})`;
}

function circlePos(k) {
    k -= 'A'.charCodeAt(0);
    const r = k * Math.PI * 2.0 / 26.0;
    const x = 200 + 160 * Math.cos(r);
    const  y = 200 + 160 * Math.sin(r);
    return {x: x, y: y};
}

function interval(callback) {
    let start = performance.now();
    const proc = t => {
        callback(t - start);
        start = t;
        window.requestAnimationFrame(proc);
    };
    proc(start);
}

function ready() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.font = '16pt Consolas';
    document.onkeypress = e => {
        return false;
    };
    document.onkeydown = e => {
        if(e.keyCode >= 'A'.charCodeAt(0) && e.keyCode <= 'Z'.charCodeAt(0)) {
            if(!keyState[e.keyCode]) {
                const p = circlePos(e.keyCode);
                ripple.push({x: p.x, y: p.y, z: 0});
            }
            keyState[e.keyCode] = true;
            return false;
        }
    };
    document.onkeyup = e => {
        if(e.keyCode >= 'A'.charCodeAt(0) && e.keyCode <= 'Z'.charCodeAt(0)) {
            keyState[e.keyCode] = false;
        }
        return false;
    };

    interval(d => {
        ctx.clearRect(0, 0, 400, 400);
        
        ripple = ripple.filter(function(e) {
            ctx.strokeStyle = rgba(0x44, 0xDD, 0xFF, 1.0 - e.z / 200.0);
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.z, 0, Math.PI * 2, false);
            ctx.stroke();
            e.z += d * 0.1;
            return e.z < 200.0;
        });
        
        for(var i = 0; i < 26; i++) {
            var r = i * Math.PI * 2.0 / 26.0;
            var x = 200.0 + 160 * Math.cos(r);
            var y = 200.0 + 160 * Math.sin(r);
            var key = 'A'.charCodeAt(0) + i;
            if(keyState[key]) {
                ctx.font = '24pt Consolas';
                ctx.fillStyle = '#EE4455';
            } else {
                ctx.font = '16pt Consolas';
                ctx.fillStyle = '#444444';
            }
            ctx.fillText(String.fromCharCode('A'.charCodeAt(0) + i), x, y);
        }
        time += d;
    });
}