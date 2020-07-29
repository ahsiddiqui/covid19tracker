import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import logo from './logo.svg';
import './App.css';
import myphoto from './adil.png';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  // https://disease.sh/v3/covid-19/countries
  // useEffect runs a piece of code based on a given condition
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])
  useEffect(() => {
    // this code runs only once when the component loads
    // or if the data in a variable inside here changes
    // async -> send request, wait for info, then do something with that info
      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
          .then((response) => response.json())
          .then((data) => {
            const countries = data.map((country) => ({
              name: country.country, // United States, United Kingdom, etc.
              value: country.countryInfo.iso2 // USA, UK, etc
            }));
            const sortedData = sortData(data);
            setTableData(sortedData);
            setMapCountries(data);
            setCountries(countries);
          });
      };
      getCountriesData()
  }, []);
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        if(countryCode === 'worldwide'){
          setMapCenter(mapCenter);
          setMapZoom(mapZoom);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        };
      });
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <div className="app__TitleCenter">
          <img src={myphoto} alt="Adil Siddiqui" className="my__img"/>
          <h3>Adil Siddiqui</h3>
          </div>
          <div className="app__TitleCenter">
          <h1>COVID-19 Tracker</h1>
          <p className="app__SubTitleCenter">(Inspired By Clever Programmer)</p>
          </div>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={e => setCasesType('cases')}
            title="New cases Today"
            cases={(countryInfo.todayCases)}
            subtitle="Total cases"
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={e => setCasesType('recovered')}
            title="Recovered cases Today"
            cases={(countryInfo.todayRecovered)}
            subtitle="Total recovery"
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={e => setCasesType('deaths')}
            title="Deaths cases Today"
            cases={(countryInfo.todayDeaths)}
            subtitle="Total deaths"
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        {<Map 
          casesType={casesType}
          countries={mapCountries} 
          center={mapCenter} 
          zoom={mapZoom} 
        /> }
      </div>
      <Card className="app__right">
        <CardContent>
          <h3 className="app__rightTableTitle">Total Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__rightGraphTitle">New Daily {casesType} Worldwide (till yesterday)</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>   
      </Card>
    </div>
  );
}

export default App;