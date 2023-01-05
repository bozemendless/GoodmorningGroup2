const date = new Date();
// 加入時間資訊
const setDtate = function(){ 
    const weekdayArry =["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    for (let i =0 ; i<7; i++){
        let milliseconds=date.getTime() + 1000*60*60*24*i;
        if ( date.getHours() > 16 ){
            milliseconds=date.getTime() + 1000*60*60*24+1000*60*60*24*i;
        }
        let newdate = new Date(milliseconds);
        let weekday = newdate.getDay();
        let month = newdate.getMonth()+1;
        let day = newdate.getDate();
        if(weekday === 0 || weekday === 6){
            document.querySelectorAll(".day"+i).forEach(element =>{element.style.backgroundColor="#F4D06F"});
            document.querySelectorAll(".day"+i).forEach(element =>{element.style.color="#767522"});
        }
        document.querySelectorAll(".day"+i).forEach(element => {element.textContent=month+"/"+day+"\n"+weekdayArry[weekday]});
    }
}
// 創建頂部欄位
const createTopBar = function(location){
    let containerAll = document.createElement("div")
    containerAll.className="containerAll"
    document.querySelector(location).appendChild(containerAll)
    let container_top = document.createElement("div")
    container_top.className="container_top"
    containerAll.appendChild(container_top)
    const TopBarElements =["country", "time", "day0", "day1", "day2", "day3", "day4", "day5", "day6"]
    TopBarElements.forEach((TopBarElement, index) => {
        let element = document.createElement("div")
        element.className = TopBarElement
        if (index === 0){
            element.textContent = "縣市"
        }else if (index === 1){
            element.textContent = "時間"
        }
        container_top.appendChild(element)
    })
}
// 把各縣市資料放入表格
const citydata =function(citynum, index, location){
    const city=records.locations[0].location[citynum];
    const container_cities=document.createElement("div");
    container_cities.className="container_cities";
    (document.querySelectorAll(location+".containerAll")[index]).appendChild(container_cities)
    // 建立側邊資料欄
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
    });
    // 建立各縣市天氣資料
    let indexArray=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    if(date.getHours()>16){
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
        let weather_rowstart=2;
        if((index % 2) === 0){
            weather_rowstart=1;
        }
        let  weather_columstart=parseInt( index / 2 )+3;
        if(document.body.clientWidth < 1201){
            oneday.style.gridArea=weather_columstart+"/"+weather_rowstart
        }else{
            oneday.style.gridArea=weather_rowstart+"/"+weather_columstart;
        }
        oneday.className="oneday";
        container_cities.appendChild(oneday);
        oneday.appendChild(img);
        oneday.appendChild(weatherdata);

    })
    // 建立各縣市紫外線資料
    for (let n=0; n<7; n++){
        let UVIvalue=city.weatherElement[9].time[n].elementValue[0].value
        let UVIdiv=document.createElement("div")
        let UVIindex=document.createElement("div")
        UVIindex.textContent=UVIvalue
        UVIindex.className="UVIindex"
        UVIdiv.className="UVIdiv"
        UVIindex.style.backgroundColor=changeUVI(UVIvalue)
        let UVI_rowstart = 3
        let UVI_columstart = n+3
        if(document.body.clientWidth < 1201){
            UVIdiv.style.gridArea=UVI_columstart+"/"+UVI_rowstart
        }else{
            UVIdiv.style.gridArea=UVI_rowstart+"/"+UVI_columstart;
        }
        container_cities.appendChild(UVIdiv)
        UVIdiv.appendChild(UVIindex)
    }}
// // 天氣icon變化
const changeImg =function(WeatherDescription){
    if(WeatherDescription.includes("雨")){
        return "./weather_icon/rainy.png";
    }else if(WeatherDescription.includes("晴")){
        return "./weather_icon/sun.png";
    }else{
        return "./weather_icon/cloud.png";
    }
}
// 紫外線圖示變化
const changeUVI = function(UVI){
    if(UVI<3){
        return "rgb(80, 152, 80)";
    }else if(UVI<6){
        return "rgb(241, 169, 14)";
    }else{
        return "rgb(202, 90, 90))";
    }
}
const fetchAPI = function(){
    const API_KEY="CWB-A3D31E92-A9C0-49A3-A368-F98481A37B7C";
    const URL= "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=";
    const NorthernTaiwan =[12, 9, 3, 13, 21, 0];
    const CentralTaiwan =[2, 20, 8, 10];
    const SouthernTaiwan =[5, 17, 18, 6, 7, 19];
    const EasternTaiwan =[4, 14, 16];
    const Outlying_Islands =[11, 1, 15];

    fetch(URL + API_KEY).then((response)=>{
        return response.json();
    }).then((data)=>{
        records = data.records;
        console.log(records);
        const wholeTaiwan = [...NorthernTaiwan, ...CentralTaiwan, ...SouthernTaiwan, ...EasternTaiwan, ...Outlying_Islands]
        // 監聽狀態改變
        const mediaQueryList = window.matchMedia("(max-width: 1200px)")
        mediaQueryList.addEventListener("change",testView)
        function testView (view) {
            if (document.querySelector(".containerAll")){
                document.querySelectorAll(".containerAll").forEach(element =>{element.remove()})
            }
            if (view.matches) {
                console.log('Smaller than 1200px width!!')
                NorthernTaiwan.forEach( (citynum, index)=> {
                    createTopBar("#NorthernTaiwan"); 
                    citydata(citynum, index, "#NorthernTaiwan>");
                }); 
                CentralTaiwan.forEach( (citynum, index)=> {
                    createTopBar("#CentralTaiwan"); 
                    citydata(citynum, index, "#CentralTaiwan>");
                }); 
                SouthernTaiwan.forEach( (citynum, index)=> {
                    createTopBar("#SouthernTaiwan"); 
                    citydata(citynum, index, "#SouthernTaiwan>");
                }); 
                EasternTaiwan.forEach( (citynum, index)=> {
                    createTopBar("#EasternTaiwan"); 
                    citydata(citynum, index, "#EasternTaiwan>");
                }); 
                Outlying_Islands.forEach( (citynum, index)=> {
                    createTopBar("#Outlying_Islands"); 
                    citydata(citynum, index, "#Outlying_Islands>");
                }); 
                setDtate()
            } else {
                console.log('Bigger than 1200px width!!')
                createTopBar("#NorthernTaiwan"); 
                NorthernTaiwan.forEach( (citynum)=> {
                    citydata(citynum, 0, "#NorthernTaiwan>");
                }); 
                createTopBar("#CentralTaiwan"); 
                CentralTaiwan.forEach( (citynum) => {
                    citydata(citynum, 0, "#CentralTaiwan>");
                }); 
                createTopBar("#SouthernTaiwan"); 
                SouthernTaiwan.forEach( (citynum)=> {
                    citydata(citynum, 0, "#SouthernTaiwan>");
                }); 
                createTopBar("#EasternTaiwan"); 
                EasternTaiwan.forEach( (citynum)=> {
                    citydata(citynum, 0, "#EasternTaiwan>");
                }); 
                createTopBar("#Outlying_Islands"); 
                Outlying_Islands.forEach( (citynum)=> {
                    citydata(citynum, 0, "#Outlying_Islands>");
                }); 
                setDtate()
                }
        }
        testView(mediaQueryList)
    });
}
fetchAPI()
