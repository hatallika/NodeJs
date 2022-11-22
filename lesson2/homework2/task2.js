const EventEmitter = require("events");

class Timer {
    constructor(timeStr) {
        let [hours, day, month, year] = timeStr.split('-');
        this.time = new Date(parseInt(year), parseInt(month)-1, parseInt(day), parseInt(hours));
    }
}

const delay = (ms) => {
    return new Promise( (resolve, reject) => {

        setInterval(resolve, ms);
    })
}

const generateNewTimer = (timeStr) => {
    console.log('generate new timer');
    return delay(1000).then( () => new Timer(timeStr));
}


class myHandler{


    static intervals = [];
    static handler (timerTime) {
        this.intervals[timerTime] = setInterval(() => this.showRemainingTime_(timerTime), 1000)
    }

    static showRemainingTime_ = (timerTime) => {

        let distance = timerTime - new Date();
        console.log(timerTime.toLocaleDateString() + ' ' + timerTime.toLocaleTimeString());

        if (distance > 0) {
            const _second = 1000;
            let _minute = _second * 60;
            let _hour = _minute * 60;
            let _day = _hour * 24;

            let days = Math.floor(distance / _day);
            let hours = Math.floor((distance % _day) / _hour);
            let minutes = Math.floor((distance % _hour) / _minute);
            let seconds = Math.floor((distance % _minute) / _second);

            console.log ( ` осталось | days: ${days} | hours: ${hours} | minutes: ${minutes} | seconds: ${seconds} `);
            console.log ('_________________________________________');


        } else {
            console.log ('Таймер завершен');
            clearInterval(this.intervals[timerTime]);
        }
    }
}

const app = () => {
    class MyEmitter_ extends EventEmitter {}
    const emitterObject = new MyEmitter_();

    emitterObject.on('setTimer', myHandler.handler.bind(myHandler));

    //запустим таймеры из очереди
    const args = process.argv.slice(2);

    args.forEach( timer => {
        let newTimer = new Timer(timer);
        emitterObject.emit('setTimer', newTimer.time)
    });

}

app();



