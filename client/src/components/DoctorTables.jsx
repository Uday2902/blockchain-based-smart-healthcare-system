import React, { useEffect, useState } from "react";
import "./styles/TableSection.css";
import axios from "axios";

const data = [
  {
    reportName: "Report 1",
    hash: "x0fffff",
    lastUpdated: "14/06/21",
  },
];

const DoctorTables = () => {
  useEffect(async () => {
    try {
      const response = await axios.post("http://localhost:5000/get-files-doctor", { user: "Uday 7" });

      const files = response.data;

      files.forEach((file) => {
        console.log("File -> ", file.fileName);

        const byteCharacters = atob(file.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: file.fileType });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Error downloading files", error);
    }
  }, []);

  const [file, setFile] = useState(null);

  const handleUploadClick = async () => {
    if (!file) {
      return alert("Please select a file first!");
    }

    const formData = new FormData();
    formData.append("file", file); // Append the file
    formData.append("user", "Uday"); // Append additional data, such as user information

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Make sure content-type is multipart/form-data
          },
        }
      );

      alert(`File uploaded successfully. CID: ${response.data}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.response?.data || error.message}`);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file in state
  };

  return (
    <div className="table-section">
      <div style={{ textAlign: "right" }}>
        <input
          type="file"
          id="file-upload"
          //   style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          onClick={handleUploadClick}
          style={{ marginLeft: "10px" }}
          disabled={!file}
        >
          Upload New Report
        </button>
      </div>
      <h2>Patient Tables</h2>
      <table>
        <thead>
          <tr>
            <th>Report</th>
            <th>Hash</th>
            <th>Last Updated</th>
            <th>Download</th>
            <th>Manage Permissions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="author">
                <img
                  src="https://via.placeholder.com/50"
                  alt={item.reportName}
                />
                <div>
                  <h3>{item.reportName}</h3>
                </div>
              </td>
              <td>{item.hash}</td>
              <td>{item.lastUpdated}</td>
              <td>
                <button>Download</button>
              </td>
              <td>
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorTables;
