const CWB_API_KEY="CWB-25142137-EFE4-4F9E-9B46-D41BF5BD73D5"
let date = new Date()
const setDtate = function(){ 
    const weekdayArry =["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    for (let i =0 ; i<7; i++){
        let milliseconds=date.getTime() + 1000*60*60*24*i;
        if ( date.getHours() > 17 ){
            milliseconds=date.getTime() + 1000*60*60*24+1000*60*60*24*i;
        }
        let newdate = new Date(milliseconds);
        let weekday = newdate.getDay();
        let month = newdate.getMonth()+1;
        let day = newdate.getDate();
        if(weekday === 0 || weekday === 6){
            document.querySelector(".day"+i).style.backgroundColor="#F4D06F";
            document.querySelector(".day"+i).style.color="#767522";
        }
        document.querySelector(".day"+i).textContent=month+"/"+day+"\n"+weekdayArry[weekday];
    }
}

fetch("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization="+CWB_API_KEY).then((response)=>{
    return response.json();
}).then((data)=>{
    records = data.records;
    console.log(records);
    const NorthernTaiwan =[12, 9, 3, 13, 21, 0];
    const CentralTaiwan =[2, 20, 8, 10];
    const SouthernTaiwan =[5, 17, 18, 6, 7, 19];
    const EasternTaiwan =[4, 14, 16];
    const Outlying_Islands =[11, 1, 15];
    const wholeTaiwan = [...NorthernTaiwan, ...CentralTaiwan, ...SouthernTaiwan, ...EasternTaiwan, ...Outlying_Islands]
    wholeTaiwan.forEach( citynum => {citydata(citynum)});
    setDtate()
});

const citydata =function(citynum){
    const city=records.locations[0].location[citynum];
    const container_cities=document.createElement("div");
    container_cities.className="container_cities";
    document.querySelector("main").appendChild(container_cities);
    createSidebar(city,  container_cities);
    createWeatherData(city,  container_cities);
    createUVIdata (city,  container_cities);
}

const createSidebar = function(city,  container_cities){
    const SidebarElements = [
        {
            element : "div",
            content : city.locationName,
            class: "city"
        }, 
        {
            element : "div",
            content : "白天",
            class: "day"
        },
        {
            element : "div",
            content : "晚上",
            class: "night"
        },
        {
            element : "div",
            content : "紫外線",
            class: "UVI"
        }
    ]

    SidebarElements.forEach(SidebarElement =>{
        let element = document.createElement(SidebarElement["element"]);
        element.textContent = SidebarElement["content"];
        element.className = SidebarElement["class"];
        container_cities.appendChild(element);
    })
}

const createWeatherData = function(city,  container_cities){
    let indexArray=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    if(date.getHours()>17){
        indexArray=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    }
    indexArray.forEach(function(timeindex, index){
        let minT=city.weatherElement[8].time[timeindex].elementValue[0].value;
        let maxT=city.weatherElement[12].time[timeindex].elementValue[0].value;
        let WeatherDescription=city.weatherElement[6].time[timeindex].elementValue[0].value;
        let oneday=document.createElement("div");
        let weatherdata=document.createElement("div");
        let img=document.createElement("img");
        img.src=changeImg(WeatherDescription);
        weatherdata.textContent=minT+"~"+maxT+"℃"+"\n"+WeatherDescription;
        let rowstart=2;
        if((index % 2) === 0){
            rowstart=1;
        }
        columstart=parseInt( index / 2 )+3;
        oneday.style.gridArea=rowstart+"/"+columstart;
        oneday.className="oneday";
        container_cities.appendChild(oneday);
        oneday.appendChild(img);
        oneday.appendChild(weatherdata);

    })
}

const createUVIdata =function(city,  container_cities){
    for (let n=0; n<7; n++){
        let UVIvalue=city.weatherElement[9].time[n].elementValue[0].value
        let UVIdiv=document.createElement("div")
        let UVIindex=document.createElement("div")
        UVIindex.textContent=UVIvalue
        UVIindex.className="UVIindex"
        UVIdiv.className="UVIdiv"
        UVIindex.style.backgroundColor=changeUVI(UVIvalue)
        const rowstart = 3
        const columstart = n+3
        UVIdiv.style.gridArea = rowstart + "/" +columstart
        container_cities.appendChild(UVIdiv)
        UVIdiv.appendChild(UVIindex)
    }
}

const changeImg =function(WeatherDescription){
    if(WeatherDescription.includes("雨")){
        return "./weather_icon/rainy.png";
    }else if(WeatherDescription.includes("晴")){
        return "./weather_icon/sun.png";
    }else{
        return "./weather_icon/cloud.png";
    }
}

const changeUVI = function(UVI){
    if(UVI<3){
        return "rgb(80, 152, 80)";
    }else if(UVI<6){
        return "rgb(241, 169, 14)";
    }else{
        return "rgb(202, 90, 90))";
    }
}