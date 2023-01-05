
window.onload=function(){
    fetchPerdayPrecipitation();
}

function fetchPerdayPrecipitation(){
    let url="https://opendata.cwb.gov.tw/api/v1/rest/datastore/C-B0025-001?Authorization=CWB-77BB959D-93FD-4464-A496-4055FE8BC87E&format=JSON";
    fetch(url,{
        method:"GET",
    }).then(function(response){
        return response.json();
    }).then(function(data){
        pickPerdayPrecipitationData(data);
    })
}

let attractionNameArray = [];
let attractionPrecipitationArray = [];
let attractionAmount="";
let dataDay="";
function pickPerdayPrecipitationData(data){ 
    let attractionIndexArray = [];
    dataDay=data.records.location[1].stationObsTimes.stationObsTime[data.records.location[1].stationObsTimes.stationObsTime.length-1].Date;
    // console.log(data.records.location[9].stationObsTimes.stationObsTime[3-1]);
    attractionAmount=(data.records.location).length;
    for(let i =0;i<attractionAmount;i++){
        attractionIndexArray.push(i);
        attractionNameArray.push(data.records.location[i].station.StationName);
        attractionPrecipitationArray.push(data.records.location[i].stationObsTimes.stationObsTime[data.records.location[0].stationObsTimes.stationObsTime.length-1].weatherElements.Precipitation);
    }
    createSearchItem(attractionIndexArray,attractionNameArray);
    // console.log(attractionPrecipitationArray);
    dealAttractionPrecipitationArray(attractionPrecipitationArray,attractionNameArray);
}

function createSearchItem(attractionIndexArray,attractionNameArray){
    const selectTitle = document.getElementById("selectTitle"); 
    for(let i = 0;i<attractionIndexArray.length;i++){ 
        let option = document.createElement("option"); 
        option.setAttribute("value",attractionIndexArray[i]);
        option.appendChild(document.createTextNode(attractionNameArray[i])); 
        selectTitle.appendChild(option);
    }
}

let averagePrecipitation=0;
function dealAttractionPrecipitationArray(attractionPrecipitationArray,attractionNameArray){
    let floatAttractionPrecipitationArray=[];
    let totalAttractionPrecipitation=0;
    for(let i=0;i<attractionPrecipitationArray.length;i++){
        if(attractionPrecipitationArray[i]=="X" || attractionPrecipitationArray[i]=="T"){
            floatAttractionPrecipitationArray.push(0);
            totalAttractionPrecipitation+=0;
        }else{
            floatAttractionPrecipitationArray.push(parseFloat(attractionPrecipitationArray[i]));
            totalAttractionPrecipitation+=parseFloat(attractionPrecipitationArray[i]);
        }  
    }
    // console.log(totalAttractionPrecipitation);
    averagePrecipitation=totalAttractionPrecipitation/attractionPrecipitationArray.length;
    // console.log(averagePrecipitation);
    createChart(floatAttractionPrecipitationArray,attractionNameArray);
}





const optionElement = document.getElementById("selectTitle");
optionElement.addEventListener("click",contentShow); // 當下拉式選單被點擊時，要執行什麼函數
function contentShow(event){
    let itemIndex=event.target.value;
    let dataForCompare=[];
    let attractionName=[];
    document.querySelector(".day_contain").textContent=dataDay;
    if(attractionPrecipitationArray[itemIndex]=="T"){
        document.querySelector(".daily_rain_contain").textContent="小於0.1mm";
        document.querySelector(".daily_rain_contain").style.color="rgb(72, 72, 72)";
        dataForCompare=[0,averagePrecipitation];
        attractionName=attractionNameArray[itemIndex];
    }
    else if(attractionPrecipitationArray[itemIndex]=="X"){
        document.querySelector(".daily_rain_contain").textContent="無記錄值或儀器故障";
        document.querySelector(".daily_rain_contain").style.color="red";
        dataForCompare=[0,averagePrecipitation];
        attractionName=attractionNameArray[itemIndex];
    }else{
        document.querySelector(".daily_rain_contain").textContent=attractionPrecipitationArray[itemIndex];
        // attractionPrecipitation=attractionPrecipitationArray[itemIndex];
        document.querySelector(".daily_rain_contain").style.color="rgb(72, 72, 72)";
        // dealAttractionPrecipitation(attractionPrecipitation);
        dataForCompare=[attractionPrecipitationArray[itemIndex],averagePrecipitation];
        attractionName=attractionNameArray[itemIndex];
    }
    createChartCampare(dataForCompare,attractionName);
}






//=======================   判讀是否超大豪雨    ========================

// function dealAttractionPrecipitation(attractionPrecipitation){
//     attractionPrecipitation=parseInt(attractionPrecipitation);
//     if(attractionPrecipitation>=500){
//         console.log("超大豪雨");
//         createChart(100);
//     }else if(attractionPrecipitation>=350){
//         console.log("大豪雨");
//         createChart(100);
//     }else if(attractionPrecipitation>=200){
//         console.log("豪雨");
//         createChart(100);
//     }else if(attractionPrecipitation>=80){
//         console.log("大雨");
//         attractionPrecipitation=Math.sqrt(attractionPrecipitation)*10;
//         createChart(attractionPrecipitation);
//     }else{
//         attractionPrecipitation=Math.sqrt(attractionPrecipitation)*10;
//         createChart(attractionPrecipitation);
//     }
// }


function createChart(floatAttractionPrecipitationArray,attractionNameArray){
    let chartStatus = Chart.getChart("myChart"); // <canvas> id
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: attractionNameArray,
            datasets: [{
                label: '該區當日累積雨量  單位mm',
                data: floatAttractionPrecipitationArray,
                backgroundColor: [
                    '#9DD9D2',
                ],
                borderColor: [
                    '#9DD9D2',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 18
                        }
                    }
                },
                title: {
                    display: true,
                    text: '各站當日累積雨量一覽表',
                    font: {
                            size: 23
                        }
                },
            },
        }
    });
}




function createChartCampare(dataForCompare,attractionName){
    let chartStatus = Chart.getChart("myChart_compare"); // <canvas> id
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
    const ctx = document.getElementById('myChart_compare').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [attractionName+" 累積降雨量","全國各區平均累積雨量"],
            datasets: [{
                label: ['該區當日累積雨量  單位mm'],
                data: dataForCompare,
                backgroundColor: [
                    '#9DD9D2',
                    '#F4D06F'
                ],
                borderColor: [
                    '#9DD9D2',
                    '#F4D06F'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 18
                        }
                    }
                },
                title: {
                    display: true,
                    text: '當日該區與全國平均雨量比較表',
                    font: {
                            size: 23
                        }
                }
                                
            },
            
        }
    });

    //==========================

    // const myChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //         datasets: [{
    //             label: '累積雨量',
    //             data: [10, 50],
    //             // this dataset is drawn below
    //             order: 2
    //         }, {
    //             label: '趨勢線',
    //             data: [10, 50],
    //             type: 'line',
    //             // this dataset is drawn on top
    //             order: 1
    //         }],
    //         labels: ['該區', '全國平均']
    //     },
    //     options: {
    //         responsive: true,
    //         maintainAspectRatio: false,  
    //         plugins: {
    //             legend: {
    //                 labels: {
    //                     font: {
    //                         size: 20
    //                     }
    //                 }
    //             },
    //             title: {
    //                 display: true,
    //                 text: '當日該區與全國平均雨量比較表',
    //                 font: {
    //                         size: 30
    //                     }
    //             },
    //         }             
            
    //     }
    // });
}






// ==================   監聽畫面變動    =====================
// function reportWindowSize() {
//     let heightOutput = window.innerHeight;
//     let widthOutput = window.innerWidth;
//     // console.log(heightOutput);
//     console.log(widthOutput);
// }
// window.addEventListener("resize", reportWindowSize);
// // reportWindowSize()












///============================











// const dataUrl= "https://opendata.cwb.gov.tw/api/v1/rest/datastore/C-B0025-001?Authorization=CWB-77BB959D-93FD-4464-A496-4055FE8BC87E&format=JSON"
// const xhr = new XMLHttpRequest()
// xhr.open('GET',dataUrl, true)
// xhr.send()
// xhr.onload = function(){
//     var data = JSON.parse(this.responseText);
//     // console.log((data.records.location).length);
//     amount=(data.records.location).length;
//     // console.log(data.records.location[0].station.StationName);
//     // console.log(data.records.location[0].stationObsTimes.stationObsTime[0].weatherElements);
//     for(let i =0;i<amount;i++){
//         console.log(data.records.location[i].station.StationName,"日降雨量 : ",data.records.location[i].stationObsTimes.stationObsTime[0].weatherElements.Precipitation);
//         // if(data.records.location[i].station.StationName=="嘉義"){
//         //     console.log(data.records.location[i].station.StationName," : ",data.records.location[i].stationObsTimes.stationObsTime[0].weatherElements.Precipitation);
//         // }
//     }
    
// }





// T 雨跡，降水量小於0.1mm。V表示風向不定。
// "X" 表無記錄值或儀器故障。
// console.log(data.records.location[0].stationObsTimes.stationObsTime[0].weatherElements);


//月
// var dataUrl= "https://opendata.cwb.gov.tw/api/v1/rest/datastore/C-B0027-001?Authorization=CWB-77BB959D-93FD-4464-A496-4055FE8BC87E&format=JSON"
// var xhr = new XMLHttpRequest()
// xhr.open('GET',dataUrl, true)
// xhr.send()
// xhr.onload = function(){
//     var data = JSON.parse(this.responseText);
//     console.log(data.records.data.surfaceObs.location[0].stationObsStatistics.Precipitation.monthly);
//     // console.log((data.records.location).length);
//     // amount=(data.records.location).length;
//     // // console.log(data.records.location[0].station.StationName);
//     // // console.log(data.records.location[0].stationObsTimes.stationObsTime[0].weatherElements);
//     // for(let i =0;i<amount;i++){
//     //     console.log(data.records.location[i].station.StationName," : ",data.records.location[i].stationObsTimes.stationObsTime[0].weatherElements.Precipitation);
//     //     // if(data.records.location[i].station.StationName=="嘉義"){
//     //     //     console.log(data.records.location[i].station.StationName," : ",data.records.location[i].stationObsTimes.stationObsTime[0].weatherElements.Precipitation);
//     //     // }
//     // }
    
// }
// T 雨跡，降水量小於0.1mm。V表示風向不定。
// "X" 表無記錄值或儀器故障。
// console.log(data.records.location[0].stationObsTimes.stationObsTime[0].weatherElements);


//===============   char
// let ctx=document.getElementById("myChart").getContext("2d");
// let labels=["apple","banana","hot dog","sushi"];
// let colorHex=["#FB3640","#EFCA08","#43aa8b","#253d5b"];

// let myChart =new Chart(ctx,{
//     type:"pie",
//     data:{
//         datasets:[{
//             data:[30,10,40,20],
//             backgroundColor:colorHex
//         }],
//         labels:labels
//     },
//     options:{
//         responsive:true
//     }
// })


// const ctx = document.getElementById('myChart').getContext('2d');
// const myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });
