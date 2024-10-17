import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ShowDoctorsInfo = ({ doctorsDetails, selectedFile }) => {
  const MRcontract = useSelector((state) => state.user.MRcontract);
  const signer = useSelector((state) => state.user.signer);

  const [doctorsAccess, setDoctorsAccess] = useState([]);

  useEffect(() => {
    const checkAccessForDoctors = async () => {
      try {
        const accessArray = await Promise.all(
          doctorsDetails.map(async (item) => {
            const hasAccess = await MRcontract.hasAccess(item[3], selectedFile.fileHash);
            return { doctor: item, hasAccess };
          })
        );
        setDoctorsAccess(accessArray);
      } catch (err) {
        console.log("Error while checking access for doctors ->", err);
      }
    };

    if (doctorsDetails.length && selectedFile) {
      checkAccessForDoctors();
    }
  }, [doctorsDetails, selectedFile, MRcontract]);

  const handleAssignClick = async (item) => {
    try {
      const isAlreadyHasAccess = await MRcontract.hasAccess(item[3], selectedFile.fileHash);
      if (isAlreadyHasAccess) {
        alert("Doctor already has access to this report.");
      } else {
        const accessGrant = await MRcontract.grantAccess(selectedFile.fileHash, item[3]);
        console.log("accessgrant -> ", accessGrant);
        alert("Access granted to doctor.");
        // Update UI after access is granted
        setDoctorsAccess((prevState) =>
          prevState.map((doctor) =>
            doctor.doctor[3] === item[3] ? { ...doctor, hasAccess: true } : doctor
          )
        );
      }
    } catch (err) {
      console.log("Error while granting access to doctor -> ", err);
      alert("Error while granting access to doctor!");
    }
  };

  const handleRevokeClick = async (item) => {
    try {
      const accessRevoke = await MRcontract.revokeAccess(selectedFile.fileHash, item[3]);
      console.log("accessRevoke -> ", accessRevoke);
      alert("Access revoked from doctor.");
      // Update UI after access is revoked
      setDoctorsAccess((prevState) =>
        prevState.map((doctor) =>
          doctor.doctor[3] === item[3] ? { ...doctor, hasAccess: false } : doctor
        )
      );
    } catch (err) {
      console.log("Error while revoking access to doctor -> ", err);
      alert("Error while revoking access to doctor!");
    }
  };

  return (
    <div className="table-section">
      <h2>Handle Doctors Permissions</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Speciality</th>
            <th>Revoke Permission</th>
            <th>Assign Permission</th>
          </tr>
        </thead>
        <tbody>
          {doctorsAccess.map(({ doctor, hasAccess }, index) => (
            <tr key={index}>
              <td className="author">
                <img
                  src="https://via.placeholder.com/50"
                  alt="image not found"
                />
                <div>
                  <h3>{doctor[0]}</h3>
                </div>
              </td>
              <td>{doctor[1]}</td>
              <td>{doctor[2]}</td>
              <td>
                <button
                  onClick={() => handleRevokeClick(doctor)}
                  style={{
                    backgroundColor: hasAccess ? "red" : "gray",
                    color: "white",
                    cursor: hasAccess ? "pointer" : "not-allowed",
                  }}
                  disabled={!hasAccess}
                >
                  Revoke
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleAssignClick(doctor)}
                  style={{
                    backgroundColor: hasAccess ? "gray" : "green",
                    color: "white",
                    cursor: hasAccess ? "not-allowed" : "pointer",
                  }}
                  disabled={hasAccess}
                >
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowDoctorsInfo;
