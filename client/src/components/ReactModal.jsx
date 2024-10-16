import axios from "axios";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import ShowDoctorsInfo from "./ShowDoctorsInfo";

function ReactModal({ show, onClose, selectedFile }) {
  console.log("Selected file -> ", selectedFile);
  const [doctorsDetails, setDoctorsDetails] = useState([]);
  const DRcontract = useSelector((state) => state.user.DRcontract);
  const isMetaMaskConnected = useSelector(
    (state) => state.metamask.isMetaMaskConnected
  );

  useEffect(() => {
    const fetchDoctors = async () => {
      if (DRcontract) {
        try {
          const response = await axios.get(
            "http://localhost:5000/doctors-list"
          );
          const doctors = response.data;
          let doctorsDetails = [];

          for (let doctor of doctors) {
            if (ethers.isAddress(doctor.hash)) {
              try {
                const normalizedAddress = ethers.getAddress(doctor.hash);
                const doctorDetails = await DRcontract.getDoctorDetails(
                  normalizedAddress
                );
                let newDoctorDetails = Object.assign({}, doctorDetails);
                newDoctorDetails[3] = normalizedAddress;

                console.log(newDoctorDetails);            

                doctorsDetails.push(newDoctorDetails);
              } catch (error) {
                console.error("Error while fetching doctor details:", error);
              }
            } else {
              console.error("Invalid Ethereum address:", doctor.hash);
            }
          }
          setDoctorsDetails(doctorsDetails);
        } catch (error) {
          console.error("Error while fetching doctor details:", error);
        }
      }
    };

    fetchDoctors();
  }, [DRcontract]);

  if (!show) return null;

  return (
    <div
      className="modal-background"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "50vw",
          height: "70vh",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          position: "relative",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            padding: "5px 10px",
          }}
        >
          X
        </button>

        <div style={{ marginBottom: "20px" }}>
          <h2>Edit Report: {selectedFile.fileName}</h2>
        </div>

        <ShowDoctorsInfo
          doctorsDetails={doctorsDetails}
          selectedFile={selectedFile}
        />

        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "gray",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              padding: "10px 20px",
              marginRight: "10px",
            }}
          >
            Close
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              padding: "10px 20px",
            }}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReactModal;
