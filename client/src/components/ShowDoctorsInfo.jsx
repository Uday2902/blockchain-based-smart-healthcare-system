import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const ShowDoctorsInfo = ({doctorsDetails}) => {

    console.log("Inner doctorsDetails -> ", doctorsDetails);

  return (
    <>
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
            {doctorsDetails.map((item, index) => (
              <tr key={index}>
                <td className="author">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="image not found"
                  />
                  <div>
                    <h3>{item[0]}</h3>
                  </div>
                </td>
                <td>
                  {/* {item[1].slice(0, 12)}...{" "} */}
                  {item[1]}
                </td>
                <td>
                  {item[1]}
                </td>
                <td>
                    <button onClick={() => handleRevokeClick(item)} style={{backgroundColor: "red", color: "white"}}>
                        Revoke
                    </button>
                </td>
                <td>
                  <button onClick={() => handleAssignClick(item)} style={{backgroundColor: "green", color: "white"}} >
                    Assign
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

export default ShowDoctorsInfo;
