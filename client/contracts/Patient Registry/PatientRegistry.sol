// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRegistry {

    struct Patient {
        string name;
        string dob;
        string gender;
        mapping(address => mapping(string => bool)) permissions; // Doctor address => RecordType => Permission (view/edit)
    }

    mapping(address => Patient) private patients;

    event PatientRegistered(address indexed patientAddress, string name, string dob, string gender);
    event PermissionGranted(address indexed patientAddress, address indexed doctorAddress, string recordType);
    event PermissionRevoked(address indexed patientAddress, address indexed doctorAddress, string recordType);

    // Register a new patient
    function registerPatient(string memory _name, string memory _dob, string memory _gender) public {
        require(bytes(patients[msg.sender].name).length == 0, "Patient already registered.");

        patients[msg.sender].name = _name;
        patients[msg.sender].dob = _dob;
        patients[msg.sender].gender = _gender;

        emit PatientRegistered(msg.sender, _name, _dob, _gender);
    }

    // Retrieve patient details
    function getPatientDetails(address _patientAddress) public view returns (string memory, string memory, string memory) {
        require(bytes(patients[_patientAddress].name).length != 0, "Patient not registered.");
        Patient storage patient = patients[_patientAddress];
        return (patient.name, patient.dob, patient.gender);
    }

    // Grant permission to a doctor
    function grantPermission(address _doctorAddress, string memory _recordType) public {
        require(bytes(patients[msg.sender].name).length != 0, "Patient not registered.");
        patients[msg.sender].permissions[_doctorAddress][_recordType] = true;

        emit PermissionGranted(msg.sender, _doctorAddress, _recordType);
    }

    // Revoke permission from a doctor
    function revokePermission(address _doctorAddress, string memory _recordType) public {
        require(bytes(patients[msg.sender].name).length != 0, "Patient not registered.");
        patients[msg.sender].permissions[_doctorAddress][_recordType] = false;

        emit PermissionRevoked(msg.sender, _doctorAddress, _recordType);
    }

    // Check if a doctor has permission to view/edit a patient's records
    function checkPermission(address _patientAddress, address _doctorAddress, string memory _recordType) public view returns (bool) {
        return patients[_patientAddress].permissions[_doctorAddress][_recordType];
    }
}