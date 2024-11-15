import React, { useEffect, useState } from "react";
import "./styles/TableSection.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactModal from "./ReactModal";

const DoctorTables = () => {
  const [file, setFile] = useState(null);
  const [dataToShow, setDataToShow] = useState([]); // Store the files to show in table
  const [load, setLoad] = useState(true);
  const [copiedHash, setCopiedHash] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedFile, setSelectedFile] = useState(null); // Store the selected file for editing

  const navigate = useNavigate();
  const isMetaMaskConnected = useSelector(
    (state) => state.metamask.isMetaMaskConnected
  );
  const signer = useSelector((state) => state.user.signer);
  const MRcontract = useSelector((state) => state.user.MRcontract);
  const PRcontract = useSelector((state) => state.user.PRcontract);

  useEffect(() => {
    if (!isMetaMaskConnected || signer === undefined || signer === null) {
      navigate("/signin");
    }
  }, []);

  // Fetch files on load
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log("Signer -> ",signer);
        const doctorReports = await MRcontract.getDoctorReports(signer);
        console.log("Doctor reports -> ", doctorReports);
        const response = await axios.post("http://localhost:5000/get-files-doctor", {
          doctorAddress: `${signer}`,
          fileHashes: doctorReports
        });

        let files = response.data;
        console.log(files)
        try {
          for(let file of files){
            console.log(file.patientAddress)
            let patientDetails = ["Patient", "DOB", "Gender"];
            file.patientDetails = patientDetails;
            try {
              patientDetails = await PRcontract.getPatientDetails(file.patientAddress)
              file.patientDetails = {
                name: patientDetails ? patientDetails[0] : "Patient",
                dateOfBirth: patientDetails ? patientDetails[1] : "dob",
                gender: patientDetails ? patientDetails[2] : "NA"
              };  
            } catch (error) {
              console.log("Patient info not found");
            }
                    
          console.log("Patient Details -> ", file)
          }
          console.log(files)
        } catch (error) {
          
        }
        setDataToShow(files);
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
            "Content-Type": "multipart/form-data",
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
      const blob = new Blob([byteArray], { type: file.fileType });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.fileName); 
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCopyToClipboard = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleEditClick = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  return (
    <>
      {showModal && (
        <ReactModal
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="table-section">
        
        <h2>Reports</h2>
        <table>
          <thead>
            <tr>
              <th>Report</th>
              <th>Hash</th>
              <th>Patient</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {dataToShow.map((file, index) => (
              <tr key={index}>
                <td className="author">
                  <img
                    src="https://via.placeholder.com/50"
                    alt={file.fileName}
                  />
                  <div>
                    <h3>{file.fileName}</h3>
                  </div>
                </td>
                <td
                  onClick={() => handleCopyToClipboard(file.fileHash)}
                  title="Copy IPFS hash"
                  style={{
                    cursor: "pointer",
                    color: copiedHash === file.fileHash ? "green" : "black",
                    fontWeight:
                      copiedHash === file.fileHash ? "bold" : "normal",
                    transition: "color 0.3s ease",
                  }}
                >
                  {file.fileHash.slice(0, 12)}...{" "}
                </td>
                <td>{file.patientDetails.name || "Patient"}</td>
                <td>
                  <button onClick={() => handleDownloadClick(file)}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DoctorTables;
