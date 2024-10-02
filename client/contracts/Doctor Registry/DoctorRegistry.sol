// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DoctorRegistry {

    struct Doctor {
        string name;
        string specialty;
        string licenseNumber;
        string gender;
    }

    mapping(address => Doctor) private doctors;

    event DoctorRegistered(address indexed doctorAddress, string name, string specialty, string licenseNumber, string gender);

    // Register a new doctor
    function registerDoctor(string memory _name, string memory _specialty, string memory _licenseNumber, string memory _gender) public {
        require(bytes(doctors[msg.sender].name).length == 0, "Doctor already registered.");

        doctors[msg.sender].name = _name;
        doctors[msg.sender].specialty = _specialty;
        doctors[msg.sender].licenseNumber = _licenseNumber;
        doctors[msg.sender].gender = _gender;

        emit DoctorRegistered(msg.sender, _name, _specialty, _licenseNumber, _gender);
    }

    // Retrieve doctor details
    function getDoctorDetails(address _doctorAddress) public view returns (string memory, string memory, string memory) {
        require(bytes(doctors[_doctorAddress].name).length != 0, "Doctor not registered.");
        Doctor storage doctor = doctors[_doctorAddress];
        return (doctor.name, doctor.specialty, doctor.licenseNumber);
    }
}