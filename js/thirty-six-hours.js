let line = document.getElementById("line");
let sun = document.getElementById("sun");
const windowWidth = window.innerWidth;
const lineWidth = line.offsetWidth;
const rect = line.getBoundingClientRect();

line.addEventListener("click", event => {
    const offset = event.offsetX;
    const newPosition = Math.floor(offset / (line.offsetWidth / 3)) * (line.offsetWidth / 3);
    sun.style.left = newPosition + "px";
});

function showCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() +1;
    const date = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    const currentTime = `現在是${hours}點${minutes}分`;
    const currentDate = `${year}年${month}月${date}日`;
    console.log(currentTime,currentDate);

    const timeSpan = document.querySelector(".time");
    timeSpan.textContent = currentTime;

    const dateSpan = document.querySelector(".date");
    dateSpan.textContent = currentDate;
}


function getWeather() {
    const apiKey = "CWB-A3D31E92-A9C0-49A3-A368-F98481A37B7C"
    const weatherUrl = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}`

    fetch(weatherUrl)
    .then(res => {return res.json();})
    .then(data => {
        if (data.success === "true") {
            // Get weather data of each city
            const location = data.records.location;
            const numberOfCities = location.length;

            // View of ticks
            const span = document.getElementsByClassName("tick");
            const defaultTime = location[0].weatherElement[0].time
            for (let i = 0; i < defaultTime.length; i ++) {
                const date = new Date(defaultTime[i].startTime);
                const currentDate = date.getDate();
                const currentMonth = date.getMonth() + 1;
                const currentHour = date.getHours();
                const currentTime = `${currentMonth}/${currentDate} ${currentHour}點`;
                span[i].textContent = currentTime;
            }

            // Init view
            let period = 0;
            changeData();

            // View of weather data
            function changeData() {
                const cities = document.getElementsByClassName("city");
                for (let i = 0; i < numberOfCities; i ++) {
                    cities[i].textContent = location[i].locationName;
                }
                const wx = document.getElementsByClassName("wx");
                for (let i = 0; i < numberOfCities; i ++) {
                    wx[i].textContent = location[i].weatherElement[0].time[period].parameter.parameterName;
                }
                const rain = document.getElementsByClassName("rain");
                for (let i = 0; i < numberOfCities; i ++) {
                    rain[i].textContent = location[i].weatherElement[1].time[period].parameter.parameterName + "%";
                }
            }

            // Read tick
            line.addEventListener("click", event => {
                const clickX = event.offsetX;
                if (clickX < 200) {
                    period = 0;
                }
                else if (clickX < 400) {
                    period = 1;
                }
                else {
                    period = 2;
                }
                changeData();
            })
        }
    })
}

getWeather();
showCurrentTime();