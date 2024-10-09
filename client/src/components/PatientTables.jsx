import React, { useEffect, useState } from "react";
import "./styles/TableSection.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { redirect, useNavigate } from "react-router-dom";

const PatientTables = () => {
  const [file, setFile] = useState(null);
  const [dataToShow, setDataToShow] = useState([]); // Store the files to show in table
  const [load, setLoad] = useState(true);
  const [copiedHash, setCopiedHash] = useState(null); 
  const navigate = useNavigate();
  const isMetaMaskConnected = useSelector(state => state.metamask.isMetaMaskConnected);
  const signer = useSelector(state => state.user.signer);
  useEffect(() => {

    if(!isMetaMaskConnected || signer===undefined || signer===null){
      navigate('/signin');
    }
  },[])

  // Fetch files on load
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.post("http://localhost:5000/get-files", {
          user: `${signer}`,
        });
        const files = response.data;
        setDataToShow(files); // Set files to state to be rendered in the table

        console.log("Files received -> ", files);
      } catch (error) {
        console.error("Error downloading files", error);
      }
    };

    fetchFiles();
  }, [load]);

  // Handle file upload logic
  const handleUploadClick = async () => {
    if (!file) {
      return alert("Please select a file first!");
    }

    let formData = new FormData();
    formData.append("file", file); // Append the file
    formData.append("user", `${signer}`); // Append additional data, such as user information

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
      setLoad((prev) => !prev); // Reload the file list after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.response?.data || error.message}`);
    }
  };

  // Handle file download logic
  const handleDownloadClick = (file) => {
    try {
      const byteCharacters = atob(file.data); // Decode base64
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.fileType }); // Create a Blob of the file

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.fileName); // Set download file name
      document.body.appendChild(link);
      link.click();

      // // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file", error);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file in state
  };

  const handleCopyToClipboard = (hash) => {
    navigator.clipboard.writeText(hash); // Copy the full hash to the clipboard
    setCopiedHash(hash); // Set the copied hash to trigger the animation
    setTimeout(() => setCopiedHash(null), 2000); // Reset the copied hash after 2 seconds
  };

  return (
    <div className="table-section">
      <div style={{ textAlign: "right" }}>
        <input type="file" id="file-upload" onChange={handleFileChange} />
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
          {dataToShow.map((file, index) => (
            <tr key={index}>
              <td className="author">
                <img src="https://via.placeholder.com/50" alt={file.fileName} />
                <div>
                  <h3>{file.fileName}</h3>
                </div>
              </td>
              <td
                onClick={() => handleCopyToClipboard(file.fileHash)}
                title="Copy IPFS hash"
                style={{
                  cursor: "pointer",
                  color: copiedHash === file.fileHash ? "green" : "black", // Change color when copied
                  fontWeight: copiedHash === file.fileHash ? "bold" : "normal", // Change weight when copied
                  transition: "color 0.3s ease", // Transition effect
                }}
              >
                {file.fileHash.slice(0, 12)}...{" "}
                {/* Display only first 12 characters */}
              </td>

              <td>{file.lastUpdated || "N/A"}</td>
              <td>
                <button onClick={() => handleDownloadClick(file)}>
                  Download
                </button>
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

export default PatientTables;
