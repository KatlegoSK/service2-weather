const express = require('express');
const app = express();
const bodyParser = require('body-parser')


var port = process.env.PORT || 4400;

//A module for allowing endpoints to be exposed on public
const cors = require('cors');

//AccuWeather API key
const apiKey = "sAmjfYQeb9Pa9zWlChBXsiJ30AMNELn8";

//Axios module for initiating GET and POST requests
const axios = require('axios');

app.use(bodyParser.json());
app.use(cors());

//An enpoint that requests Weather conditions to the Accuweather API
app.post('/service2',  (req, res) => {
	
	 console.log("Service2 running");
	 
	 //Extract the name of the place that needs to be checked for weather conditions
	 let queryLocation = req.body.locationName;
	 console.log(queryLocation);
	 
	 //A request to search for a place
	 axios.get("http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey="+apiKey+"&q="+queryLocation+"&language=en-us")
      .then(response => {
			
			let locationDetails = response.data[0];
			
			//A request get Current conditions
			let locationKey = response.data[0].Key;
			axios.get("http://dataservice.accuweather.com/currentconditions/v1/"+locationKey+"?apikey="+apiKey+"&language=en-us")
			 .then(response =>{
				 
				 console.log(response.data);
				 
				 let placeConditions = {
					 locationDetails: locationDetails,
					 locationCondition: response.data[0]
					 
				 }
				 
				 res.send(placeConditions);
				 
			 }).catch(error =>{
				 
				   if(error.data)
					{
						
						res.send(error.data.Message);
						
					}else{
						
						res.send("An unexpected error occured. Please try again later.");
					}
				 
				 
			 })
 
      }).catch(error => {
		  
		if(error.data)
		{
			
			res.send(error.data.Message);
			
		}else{
			
			res.send("An unexpected error occured. Please try again later.");
		}
        

      })

})

app.listen(port, () => console.log(`Listening on port ${port}`))