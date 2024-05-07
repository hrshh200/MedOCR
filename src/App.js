import React, { useState } from "react";
import './App.css';
import axios from "axios";
import { supabase } from "./config/supabaseconnect";

function MedFunction() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState([]);
  const [sumresult, setSumresult] = useState([]);
  const sumdataArray = [];

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('k1', image);

      const response = await axios.post('http://localhost:5000/processimage', formData);
      console.log(response.data)
      const dataArray = Object.values(response.data);
      setResult(dataArray)
    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };
  const handleSummary = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('MedDataSummary')
      .select('*');

    if (error) {
      console.error('error fetching data:', error);
    } else if (!data) {
      console.log('No data found in MedDataSummary table');
    } else {
      data.forEach(obj => {
        sumdataArray.push([obj.Name, obj.Summary]);
      });
      console.log(sumdataArray)
      setSumresult(sumdataArray);
    }
  };

  return (
    <div className="main-background">
      <div className="content">
        <h1>Summary of medicines</h1>
        <div className="input-container">
          <input
            type="file"
            onChange={handleImageChange}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <table className="table-container">
          <thead>
            <tr>
              <th>Medicines found</th>
            </tr>
          </thead>
          <tbody>
            {result.map((result, index) => (
              <tr key={index}>
                <td>{result}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleSummary} className="sum-button">View Summary</button>
        <table className="table-container">
          <thead>
            <tr>
              <th>Medicine Name</th>  {/* Column header for the first parameter */}
              <th>Summary</th>  {/* Column header for the second parameter */}
            </tr>
          </thead>
          <tbody>
            {sumresult.map((row, index) => (
              <tr key={index}>
                <td>{row[0]}</td>  {/* Access first element of the inner array */}
                <td>{row[1]}</td>  {/* Access second element of the inner array */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MedFunction;
