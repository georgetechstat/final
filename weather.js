// API from: https://openweathermap.org/
const apikey="3dcff8732e1b580c1d610669f6a3dd90";

window.addEventListener("load",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            let lon= position.coords.longitude;
            let lat= position.coords.latitude;
            const url= `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`;
            

            fetch(url).then((res)=>{
                return res.json();
            }).then((data)=>{
                weatherReport(data);
            })
        })
    }
})


function searchByCity(){
    var place= document.getElementById('input').value;
    var urlsearch= `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;

    fetch(urlsearch).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data);
        weatherReport(data);
    })
    document.getElementById('input').value='';
}

function stars() {
    let count = 300;
    let scene = document.body;
    let i = 0;
    while (i < count) {
        let star = document.createElement('i');
        let x = Math.floor(Math.random() * window.innerWidth);
        let y = Math.floor(Math.random() * window.innerHeight);
        let duration = Math.random() * 10;
        let size = Math.random() * 2;

        star.style.left = x+'px';
        star.style.top = y+'px';
        star.style.width = 1 + size + 'px';
        star.style.height = 1 + size + 'px';
        star.style.animationDuration = 1 + duration + 's';
        scene.appendChild(star);
        i++;
    }
}

function currentTime(ftime = new Date().getHours()) {
    let ctime = ftime;
    let isDayTime = (ctime > 6 && ctime < 20);
    
    let sun = document.querySelector('.sun');
    let moon = document.querySelector('.moon');
    
    if (isDayTime) {
        document.body.style.animation = "moonToSun 2s forwards";
        sun.style.animation = "to_active 1.4s forwards";
        moon.style.animation = "to_passive 1.4s forwards";
        [...document.querySelectorAll('.time')].forEach((obj) => { obj.style.color = "#3b618c" });
    }
    else {
        document.body.style.animation = "sunToMoon 2s forwards";
        sun.style.animation = "to_passive 1.4s forwards";
        moon.style.animation = "to_active 1.4s forwards";
        [...document.querySelectorAll('.time')].forEach((obj) => { obj.style.color = "#FFFFFF"} );
        stars();
    }
};

function weatherReport(data){

    var urlcast= `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;

    fetch(urlcast).then((res)=>{
        return res.json();
    }).then((forecast)=>{
        console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast)

        console.log(data);

        let ctime = new Date();
        let timezoneOffsetSeconds = data.timezone;
        let adjustedTime = new Date(ctime.getTime() + (timezoneOffsetSeconds * 1000));

        currentTime(adjustedTime.getUTCHours());
        console.log("HOURs: ", adjustedTime.getUTCHours());
        console.log("DSLKDJLSK: ", data.timezone);

        document.getElementById('city').innerText= data.name + ', '+data.sys.country;
        console.log(data.name,data.sys.country);
    
        console.log(Math.floor(data.main.temp-273));
        document.getElementById('temperature').innerText= Math.floor(data.main.temp-273)+ ' °C';
    
        document.getElementById('clouds').innerText= data.weather[0].description;
        console.log(data.weather[0].description)
        
        let icon1= data.weather[0].icon;
        let iconurl= "http://api.openweathermap.org/img/w/"+ icon1 +".png";
        document.getElementById('img').src=iconurl
    })

}

function hourForecast(forecast){
    document.querySelector('.templist').innerHTML=''
    for (let i = 0; i < 5; i++) {

        var date= new Date(forecast.list[i].dt*1000)
        console.log((date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00',''))

        let hourR=document.createElement('div');
        hourR.setAttribute('class','next');

        let div= document.createElement('div');
        let time= document.createElement('p');
        time.setAttribute('class','time')
        time.innerText= (date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00','');

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';

        div.appendChild(time)
        div.appendChild(temp)

        let desc= document.createElement('p');
        desc.setAttribute('class','desc')
        desc.innerText= forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc)
        document.querySelector('.templist').appendChild(hourR);
}
}

function dayForecast(forecast){
    document.querySelector('.weekF').innerHTML=''
    for (let i = 8; i < forecast.list.length; i+=8) {
        console.log(forecast.list[i]);
        let div= document.createElement('div');
        div.setAttribute('class','dayF');
        
        let day= document.createElement('p');
        day.setAttribute('class','date')
        day.innerText= new Date(forecast.list[i].dt*1000).toDateString(undefined,'Asia/Kolkata');
        div.appendChild(day);

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';
        div.appendChild(temp)

        let description= document.createElement('p');
        description.setAttribute('class','desc')
        description.innerText= forecast.list[i].weather[0].description;
        div.appendChild(description);

        document.querySelector('.weekF').appendChild(div)
    }
} 
