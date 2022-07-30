const city = document.getElementById("city");
const currTemp = document.getElementById("curr-temp");
const icon = document.getElementById("icon");
const searchbox = document.querySelector(".search-box");
const searchboxMobile = document.querySelector("#search-box-mobile");
const description = document.getElementById("description")
const feelsLike = document.getElementById("feels-like");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const maxTemp = document.getElementById("max-temp");
const minTemp = document.getElementById("min-temp");
const humidity = document.getElementById("humidity-data");
const uvi = document.getElementById("uvi-data");
const alerts = document.getElementById("alert-data");
const currLocationbtn = document.getElementById("curr-location");
const mainDesc = document.getElementById("main-desc");

//autocomplete
autocomplete('search-auto-mobile','search-box-mobile',(listItemTextContent)=>{
    document.querySelector("#"+searchboxMobile.id).value =  listItemTextContent;
    searchEvent(searchboxMobile.id);
});
autocomplete('search-auto','search-box-pc',(listItemTextContent)=>{
    document.querySelector("#"+searchbox.id).value =  listItemTextContent;
    searchEvent(searchbox.id);
});




//render function
function getTime(unixTime){
    date = new Date(unixTime);
    return date.toLocaleTimeString('en-IN').toUpperCase();
}
function render(data){
    city.innerHTML = data["name"];
    currTemp.innerHTML = data["main"]["temp"].toPrecision(3)+ "&#176c";
    iconCode = data["weather"][0]["icon"];
    icon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    description.innerHTML = data["weather"][0]["description"][0].toUpperCase()+data["weather"][0]["description"].substr(1);
    maxTemp.innerHTML = data["main"]["temp_max"].toPrecision(3)+ "&#176c";
    minTemp.innerHTML = data["main"]["temp_min"].toPrecision(3)+ "&#176c";
    sunrise.innerHTML = getTime(data["sys"]["sunrise"]*1000);
    sunset.innerHTML  = getTime(data["sys"]["sunset"]*1000);
    feelsLike.innerHTML = data["main"]["feels_like"].toPrecision(3) + "&#176c";
    humidity.innerHTML = data["main"]["humidity"] + "%";
    mainDesc.innerHTML = data["weather"][0]["main"];
    setHumidityStat(data["main"]["humidity"]);
    setVaiOneCallApi(data["coord"]["lat"],data["coord"]["lon"]);

}

//circular stats
function setHumidityStat(humidity){
    let humidityStat = document.getElementById("humidity-stat");
    humidityStat.style.strokeDashoffset = Math.abs((1-(humidity/100))*565);
}
function setVaiOneCallApi(lat,lon){
    let URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${API_KEY}&units=metric`;
    fetch(URL)
    .then(res => {
        res.json()
        .then(data => {
            let uviData = data["current"]["uvi"];
            uvi.innerHTML = Math.round(uviData);
            let uviStat = document.getElementById("uvi-stat");
            uviStat.style.strokeDashoffset = Math.abs(((10-uviData)/10)*565);
            if(data.hasOwnProperty("alerts"))
                alerts.innerHTML = data["alerts"][0]["description"];
            else
                alerts.innerHTML = "No alert";
        })
    })
    .catch(error => console.log(error()))
}

//current location button
currLocationbtn.addEventListener('click',renderByCurrentlaoction);

//on load asked for geolocation
function renderByCurrentlaoction(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            fetch(url)
            .then((res)=>{
                if(res.ok){
                    res.json()
                    .then((data)=>{
                        render(data);
                    })
                }
            }).catch((error)=> console.log(error))
        })
        
    }
}

window.addEventListener('load',renderByCurrentlaoction);

//on search
searchbox.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        searchEvent(searchbox.id)
    }
});
searchboxMobile.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        searchEvent(searchboxMobile.id)
    }
});


function searchEvent(id){
    let cityName = document.querySelector("#"+id).value;
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
    
    if(cityName==undefined||cityName==null||cityName==="")
        return

    fetch(URL)
    .then((res)=>{
        if(res.ok){
            res.json()
            .then((data)=>{
                render(data);
            })
        }
        else{
            alert("Wrong city name")
        }
    })
    .catch((error)=>console.log(error));
}

//circular stats
function setHumidityStat(humidity){
    let humidityStat = document.getElementById("humidity-stat");
    humidityStat.style.strokeDashoffset = Math.abs((1-(humidity/100))*565);
}
