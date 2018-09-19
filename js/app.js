let ledCharacteristic = null;

window.addEventListener('load', () => {
    console.log("Staring application");

    let button = document.getElementById('connect');
    button.addEventListener('click', connect);

    let sendButton = document.getElementById('send');
    sendButton.addEventListener('click', function(){
        let view = new Uint8Array(3);
        view[0] = 0x00;
        view[1] = 0x00;
        view[2] = 0xFF;
        ledCharacteristic.writeValue(view);
    });
});

function handleCharacteristicValueChanged(event) {
    var value = event.target.value;
    console.log('Received ' + value);
  }

function connect(){
    navigator.bluetooth.requestDevice({ 
        filters: [{
            namePrefix: 'SoDaQ',
        }],
        // acceptAllDevices: true, 
        optionalServices: ['ad11cf40-063f-11e5-be3e-0002a5d5c51b']
    })
    .then(device => {
        // Human-readable name of the device.
        console.log(device.name);

        // Attempts to connect to remote GATT Server.
        return device.gatt.connect();
    })
    .then(server => {
        return server.getPrimaryService('ad11cf40-063f-11e5-be3e-0002a5d5c51b');
    })
    .then(service => {
        return service.getCharacteristic('bf3fbd80-063f-11e5-9e69-0002a5d5c503');
    })
    .then(charcteristic => {
        ledCharacteristic = charcteristic;
    })
    // .then(characteristic => characteristic.startNotifications()
    // .then(characteristic => {
    //     characteristic.addEventListener('characteristicvaluechanged',
    //                                     handleCharacteristicValueChanged);
    //     console.log('Notifications have been started.');
    // })
    // )
    .catch(error => { console.log(error); });
}