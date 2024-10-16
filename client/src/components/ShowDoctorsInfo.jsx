import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ShowDoctorsInfo = ({doctorsDetails, selectedFile}) => {

  const MRcontract = useSelector((state) => { return state.user.MRcontract });
  const signer = useSelector((state) => {return state.user.signer});

    console.log("Inner doctorsDetails -> ", doctorsDetails);
    console.log("Selected file -> ", selectedFile);

    const handleAssignClick = async (item) => {
      try{
        console.log("Item -> ", item)
        console.log("MRCONTRACT -> ",MRcontract)
        // await MRcontract.uploadReport(signer, selectedFile.fileHash)
        // await MRcontract.grantAccess(selectedFile.fileHash, item[3])
        const isAlreadyHasAccess = await MRcontract.hasAccess(item[3], selectedFile.fileHash);
        if(isAlreadyHasAccess){
          
        }
      }catch(err){
        console.log("Error while assiging value -> ", err);
      }
    }

    const handleRevokeClick = (item) => {

    }

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
