let reconnectionsAttempts = 0;
function connectWS(){
    let ws = new WebSocket('ws://localhost:8081');

    ws.onopen = async function () {
        if(reconnectionsAttempts > 0){
            console.clear();
            console.log('Reconnected...');
            console.log('reloading...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.reload();
            reconnectionsAttempts = 0;
        }
        try {
            if (!localStorage.getItem('times')) {
                console.log('times: ', '0');
                localStorage.setItem('times', '0');
            }
            const reloaded = localStorage.getItem('reloaded')
            const times = localStorage.getItem('times');
            if (reloaded) {
                console.log('connected');
                console.log('reloaded: ', `${times} times`);
            }
            else {
                console.log('connected');
            }
        }
        catch (err) {
            console.log('error: ', err);
        }
    }

    ws.onmessage = function (event) {
        if (event.data === 'refresh') {
            localStorage.setItem('reloaded', 'true');
            if (localStorage.getItem('times')) {
                let times = localStorage.getItem('times');
                times = parseInt(times);
                times++;
                localStorage.setItem('times', times);
            }
            else {
                localStorage.setItem('times', '1');
            }
            window.location.reload(); // Recharger la page
        }
    };

    ws.onerror = function(error) {
        console.error('WebSocket encountered error:', error.message, 'Closing socket');
        localStorage.removeItem('reloaded');
        localStorage.removeItem('times');
        ws.close();
    };

    ws.onclose = function reconnect(e) {
        console.log(e);
        if(e.code === 1006){
            console.clear();
            reconnectionsAttempts++;
            console.log('Connection has been lost. Reconnect will be attempted in 5 second. Attempt number: ', reconnectionsAttempts);
        }
        setTimeout(function() {
            connectWS();
        }, 5000);
    };
}

connectWS();