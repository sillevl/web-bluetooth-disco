var app = null;

console.log(navigator.bluetooth)

document.addEventListener('DOMContentLoaded', () => {
   app = new Vue({
    el: '#app',
    data: {
      color: {red: 0, green: 128, blue: 255},
      presets: [],
      ledCharacteristic: null
    },
    mounted() {
      if (localStorage.getItem('color')) {
        this.color = JSON.parse(localStorage.getItem('color'))
      }
    },
    computed: {
      colorStyle() {
        let c = this.color
        return {
          backgroundColor: `rgb(${c.red}, ${c.green}, ${c.blue})`,
        };
      }
    },
    watch: {
      color: {
        handler(newValue, oldValue) {
          this.sendColor()
          localStorage.setItem('color',JSON.stringify(newValue))
        },
        deep: true 
      }
    },
    methods: {
      connect: function(){
        console.log("connect button pressed")
        navigator.bluetooth.requestDevice({ 
            filters: [{
                namePrefix: 'Proto',
            }],
            // acceptAllDevices: true, 
            optionalServices: ['ad11cf40-063f-11e5-be3e-0002a5d5c51b']
        })
        .then(device => {
            console.log(`Connected to: ${device.name}`);
            return device.gatt.connect();
        })
        .then(server => {
            console.log('Getting primary service')
            return server.getPrimaryService('ad11cf40-063f-11e5-be3e-0002a5d5c51b');
        })
        .then(service => {
            console.log('Getting Characteristic for rgb led')
            return service.getCharacteristic('bf3fbd80-063f-11e5-9e69-0002a5d5c503');
        })
        .then(charcteristic => {
            console.log(charcteristic)
            this.ledCharacteristic = charcteristic;
        })
        .catch(error => { console.log(error.name, error.message); });
      },
      sendColor: function(){
        let view = new Uint8Array(3);
        view[0] = this.color.red;
        view[1] = this.color.green;
        view[2] = this.color.blue;
        this.ledCharacteristic.writeValue(view);
      }
    }
  })
})