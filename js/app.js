window.addEventListener('load', () => {
    console.log("Staring application");

    let button = document.getElementById('connect');
    button.addEventListener('click', connect)
});

function handleCharacteristicValueChanged(event) {
    var value = event.target.value;
    console.log('Received ' + value);
  }

function connect(){
    navigator.bluetooth.requestDevice({ 
        acceptAllDevices: true, 
        optionalServices: ['e95d9882-251d-470a-a062-fa1922dfa9a8']
    })
.then(device => {
    // Human-readable name of the device.
    console.log(device.name);

    // Attempts to connect to remote GATT Server.
    return device.gatt.connect();
})
.then(server => {
    // Getting Battery Service...
    return server.getPrimaryService('e95d9882-251d-470a-a062-fa1922dfa9a8');
})
.then(service => {
    // Getting Battery Level Characteristic...
    return service.getCharacteristic('e95dda90-251d-470a-a062-fa1922dfa9a8');
})
.then(characteristic => characteristic.startNotifications()
.then(characteristic => {
    characteristic.addEventListener('characteristicvaluechanged',
                                    handleCharacteristicValueChanged);
    console.log('Notifications have been started.');
  })
)
.catch(error => { console.log(error); });
}