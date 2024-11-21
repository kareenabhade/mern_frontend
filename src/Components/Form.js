import React, { useEffect, useState } from "react";

const Form = () => {
  const [apiInput, setApiInput] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Numbers");
  const [filteredResponse, setFilteredResponse] = useState("");

  const handleInputChange = (e) => {
    setApiInput(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const handleSubmit = () => {
    try {
      const data = JSON.parse(apiInput).data;
      let filteredData = [];

      switch (selectedFilter) {
        case "Numbers":
          filteredData = data.filter((item) => !isNaN(item));
          break;
        case "Alphabets":
          filteredData = data.filter((item) => /^[a-zA-Z]$/.test(item));
          break;
        case "HighestLowercase":
          const lowercase = data.filter((item) => /^[a-z]$/.test(item));
          if (lowercase.length > 0) {
            filteredData = [lowercase.sort().pop()];
          }
          break;
        default:
          filteredData = data;
          break;
      }

      setFilteredResponse(filteredData.join(", "));
      handlePostData(filteredData);
    } catch (error) {
      alert("Invalid JSON input");
    }
  };

  const handlePostData = async (filteredData) => {
    try {
      const response = await fetch("https://mern-backend-jvzo.onrender.com/process-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filteredData }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Data successfully sent to API:", result);
        alert("Data sent successfully!");
      } else {
        console.error("Failed to send data:", response.status);
      }
    } catch (error) {
      console.error("Error while sending data:", error);
      alert("An error occurred while sending data.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://mern-backend-jvzo.onrender.com/process-data");
        const data = await response.json();
        console.log("Processed data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <h3>API Input</h3>
      <textarea
        style={styles.textarea}
        value={apiInput}
        onChange={handleInputChange}
        placeholder='{"data":["M","1","334","4","B"]}'
      />
      <button style={styles.button} onClick={handleSubmit}>
        Submit
      </button>
      <h3>Multi Filter</h3>
      <select value={selectedFilter} onChange={handleFilterChange} style={styles.select}>
        <option value="">-- Select a Filter --</option>
        <option value="Numbers">Numbers</option>
        <option value="Alphabets">Alphabets</option>
        <option value="HighestLowercase">Highest Lowercase Alphabet</option>
      </select>
      <h3>Filtered Response</h3>
      <div style={styles.responseBox}>
        <strong>Result:</strong> {filteredResponse}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "20px auto",
    fontFamily: "Arial, sans-serif",
  },
  textarea: {
    width: "100%",
    height: "80px",
    marginBottom: "10px",
    padding: "8px",
  },
  button: {
    padding: "8px 16px",
    marginBottom: "10px",
  },
  select: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },
  responseBox: {
    padding: "8px",
    border: "1px solid #ccc",
  },
};

export default Form;
