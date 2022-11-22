const EventEmitter = require("events");

class Time {
    constructor(timeStr) {
        this.time = timeStr;
    }

    timeToSeconds() {
        let [hours, day, month, year] = this.time.split('-');
        let  date = new Date(year, month-1, day, hours);
        return date.getTime();
    }
}

class Handler {
    static timers = [];
    static interval = null;

    //добавлениие таймера из аргумента в список таймеров
    static setTimer(timer){
        this.timers.push(timer);
    }

     static showRemainingTime(distance){

         const _second = 1000;
         let _minute = _second * 60;
         let _hour = _minute * 60;
         let _day = _hour * 24;
         let timer;
         let now = new Date();

         let days = Math.floor(distance / _day);
         let hours = Math.floor((distance % _day) / _hour);
         let minutes = Math.floor((distance % _hour) / _minute);
         let seconds = Math.floor((distance % _minute) / _second);

         return ( ` осталось | days: ${days} | hours: ${hours} | minutes: ${minutes} | seconds: ${seconds} `);

    }

    static handler(){
        const now = Date.now();
        if (!this.timers.length){
            console.log("Нет таймеров. Запустите в формате H-D-M-Y");
            clearInterval(this.interval);
        } else {

            this.timers.forEach((timer) => {
                const diffTime = timer.timeToSeconds() - now;
                if(diffTime > 0){
                    console.log(timer.time, Handler.showRemainingTime(diffTime))
                } else {
                    console.log(timer.time,  "закончил отсчет. Удаляем таймер");
                    //удаляем таймер из списка счетчиков
                    this.timers = this.timers.filter(item => item !== timer);
                }
            })
        }
        console.log("__________________________________");
    }
}

const lesson2 = () => {
    class TimeEmitter extends EventEmitter {}
    const emitter = new TimeEmitter();

    emitter.on('getTimers', Handler.handler.bind(Handler));

    Handler.interval = setInterval(() => emitter.emit('getTimers'), 1000);

    const args = process.argv.slice(2);


    args.forEach( item => {
        return  Handler.setTimer(new Time (item));
    })
}

lesson2();




