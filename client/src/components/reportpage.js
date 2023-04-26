import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext"
import '../styles/reportpage.css'

const Report = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("")
  const { userId } = useContext(AuthContext);
  const storedId = localStorage.getItem("userId")
  const handleSubmit = (e) => {
    e.preventDefault();
    const reportObj = {
      type,
      title,
      description,
      latitude: location.split(',')[0],
      longitude: location.split(',')[1],
      image_url: image,
      status,
      user_id: storedId // add dynamic user id
    };
    // console.log("userId: ", userId);
    console.log(reportObj);
    fetch("https://zaki-dev-jiseti.onrender.com/red_flag_records", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportObj)
    })
    .then(response => {
      console.log("response:", response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log("data:", data);
      // TODO: Display success message to the user
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      // TODO: Display error message to the user
    });
  };
    const handleLocationClick = (location) => {
      const encodedLocation = encodeURIComponent(location);
      const apiKey = "a84c1d6b2b8045a7b07115047e69f8be";
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedLocation}&key=${apiKey}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const { lat, lng } = data.results[0].geometry;
          setLocation(`${lat}, ${lng}`);
        })
        .catch(error => console.log(error));
    };
  return (
    <center>
      <h2>Add a Report</h2>
      <form onSubmit={handleSubmit}>
       <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="red_flag">Red Flag</option>
            <option value="intervention">Intervention</option>
          </select>
        </label>
        <br/>
        <label>
        Title:
          <input placeholder="Add title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)} required/>
        </label>
        <br/>
        <label>
          Description:
          <textarea value={description}
          onChange={(e) => setDescription(e.target.value)} required/>
        </label>
        <br/>
        <label>
        Location:
        <input placeholder="Add location"
        type="text" value={location}
        onChange={(e) => setLocation(e.target.value)} required/>
        <button type="button" onClick={() => handleLocationClick(location)}>Geocode</button>
        </label>
        <br/>
        <label>
          Image:
          <input type="text"
          onChange={(e) => setImage(e.target.value)} />
        </label>
        <br/>
        <label>
          STATUS:
          <br />
          <input type="radio" name="status" value="under_investigation" onChange={(e) => setStatus(e.target.value)}required/> Under Investigation
          <br />
          <input type="radio" name="status" value="rejected" onChange={(e) => setStatus(e.target.value)} /> Rejected
          <br />
          <input type="radio" name="status" value="resolved" onChange={(e) => setStatus(e.target.value)} /> Resolved
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <a className='' href='/report'>My Reports</a>
    </center>
  );
};
export default Report;