import './App.css';
import React, { Fragment, useEffect, useState } from 'react';

import { CssBaseline, Grid } from '@material-ui/core';

import Header from './components/Header/header.component';
import List from './components/List/list.component';
import Map from './components/Map/map.component';

import { getPlacesData } from './services';

function App() {
  const [places, setPlaces] = useState([]);
  
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState();
  const [childClicked, setChildClicked] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');
  const [range, setRange] = useState(5);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      },
      (error) => {
        alert(
          'Please turn on your location access and refresh the page to continue.'
        );
      }
    );
  }, []);

  useEffect(() => {
    if (bounds?.sw && bounds?.ne) {
      setIsLoading(true);
      
      getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
        setIsLoading(false);
      });
    }
  }, [type, bounds]);

  useEffect(() => {
    const filteredPlaces = places?.filter((place) => place.rating > rating);

    setFilteredPlaces(filteredPlaces);
  }, [rating]);

  useEffect(() => {
    console.log(range)
    const filteredPlaces = places?.filter((place) => place.distance < range);

    setFilteredPlaces(filteredPlaces);
  }, [range]);

  return (
    <Fragment>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
            range={range}
            setRange={setRange}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default App;
