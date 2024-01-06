import React, { useState, useEffect } from 'react';

function DigitalClock() {
  const [utcDatetime, setUtcDatetime] = useState("2024-01-02T05:30:17.315899+00:00");
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(null);
  const [country,setCountry] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('');
  // const [countryTimes, setCountryTimes] = useState({});

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value)
    console.log("selectedCountry",selectedCountry);
    let timeZone  = event.target.value
    const [country,state,city] = timeZone.split('/')
    if(timeZone){
        let api = 'http://worldtimeapi.org/api/timezone'
        if(country)
        api+='/'+country
        if(state)
        api+='/'+state
        if(city)
        api+='/'+city
        fetch(api).then((res)=>res.json()).then((time)=>{
            setUtcDatetime(time.datetime)
        })
    }
  };


  
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isPaused) {
        setUtcDatetime(new Date().toISOString());
      } else {
        if (pausedTime !== null) {
          setUtcDatetime(pausedTime);
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isPaused, pausedTime]);

  useEffect(()=>{
    fetch('http://worldtimeapi.org/api/timezone').then((res)=>res.json()).then((data)=>{
        setCountry(data)
    })

    fetch('http://worldtimeapi.org/api/timezone/Africa/Abidjan').then((res)=>res.json()).then((data)=>{
        setUtcDatetime(data.datetime)
    })

    
  },[])

  const formatTime = (value) => (value < 10 ? `0${value}` : value);

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      setPausedTime(new Date().toISOString());
    }
  };

  const datetime = new Date(utcDatetime);


  const hours = formatTime(datetime.getHours());
  const minutes = formatTime(datetime.getMinutes());
  const seconds = formatTime(datetime.getSeconds());

  
  return (
    <div >
     

<div style={{ display: 'flex', alignItems: 'center' }}>
  <select
    value={selectedCountry}
    onChange={handleCountryChange}
    style={{
      padding: '8px',
      fontSize: '16px',
      marginRight: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      cursor: 'pointer',
    }}
  >
    <option value="" disabled>
      Country Dropdown
    </option>
    {country.map((countryData) => (
      <option key={countryData} value={countryData}>
        {countryData}
      </option>
    ))}
  </select>
  <span style={{ margin: '0 10px', fontSize: '18px' }}>{hours}</span>
  <span>:</span>
  <span style={{ margin: '0 5px', fontSize: '18px' }}>{minutes}</span>
  <span>:</span>
  <span style={{ margin: '0 5px', fontSize: '18px' }}>{seconds}</span>
  <button
    onClick={togglePlayPause}
    style={{
      padding: '8px',
      fontSize: '16px',
      marginLeft: '10px',
      borderRadius: '5px',
      backgroundColor: '#61dafb', // You can change the color
      color: 'white',
      cursor: 'pointer',
    }}
  >
    {isPaused ? 'Start' : 'Pause'}
  </button>
</div>

       
    </div>
  );
}

export default DigitalClock;


