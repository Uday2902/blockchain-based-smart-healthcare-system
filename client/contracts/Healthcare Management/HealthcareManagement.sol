// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthcareManagement {

    struct Report {
        string ipfsHash;
        uint256 timestamp;
        address doctor;
        string reportType;
        mapping(address => bool) authorizedDoctors;
    }

    struct Patient {
        string name;
        mapping(string => Report) reports;
        string[] reportHashes;
    }

    mapping(address => Patient) private patients;

    event ReportStored(address indexed patient, string ipfsHash, address indexed doctor, string reportType);
    event DoctorAuthorized(address indexed patient, address indexed doctor, string ipfsHash);
    event DoctorRevoked(address indexed patient, address indexed doctor, string ipfsHash);

    modifier onlyPatient() {
        require(bytes(patients[msg.sender].name).length > 0, "Not a registered patient");
        _;
    }

    // Function to register a patient
    function addPatientEntry(string memory _name) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(patients[msg.sender].name).length == 0, "Patient already registered");

        patients[msg.sender].name = _name;
    }

    // Function to store a patient's report
    function storeReport(string memory _ipfsHash, string memory _reportType) public onlyPatient {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");

        Report storage newReport = patients[msg.sender].reports[_ipfsHash];
        newReport.ipfsHash = _ipfsHash;
        newReport.timestamp = block.timestamp;
        newReport.doctor = msg.sender;
        newReport.reportType = _reportType;

        bool exists = false;
        for (uint256 i = 0; i < patients[msg.sender].reportHashes.length; i++) {
            if (keccak256(abi.encodePacked(patients[msg.sender].reportHashes[i])) == keccak256(abi.encodePacked(_ipfsHash))) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            patients[msg.sender].reportHashes.push(_ipfsHash);
        }

        emit ReportStored(msg.sender, _ipfsHash, msg.sender, _reportType);
    }

    // Function to authorize a doctor for a specific report
    function authorizeDoctor(string memory _ipfsHash, address _doctor) public onlyPatient {
        require(_doctor != address(0), "Invalid doctor address");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");

        patients[msg.sender].reports[_ipfsHash].authorizedDoctors[_doctor] = true;
        emit DoctorAuthorized(msg.sender, _doctor, _ipfsHash);
    }

    // Function to revoke doctor access for a specific report
    function revokeDoctor(string memory _ipfsHash, address _doctor) public onlyPatient {
        require(patients[msg.sender].reports[_ipfsHash].authorizedDoctors[_doctor], "Doctor not authorized");

        patients[msg.sender].reports[_ipfsHash].authorizedDoctors[_doctor] = false;
        emit DoctorRevoked(msg.sender, _doctor, _ipfsHash);
    }

    // Function to check if a doctor is authorized for a specific report
    function isAuthorizedDoctor(string memory _ipfsHash, address _doctor) public view returns (bool) {
        return patients[msg.sender].reports[_ipfsHash].authorizedDoctors[_doctor];
    }

    // Function to retrieve report hashes for a patient
    function getPatientReportHashes() public view onlyPatient returns (string[] memory) {
        return patients[msg.sender].reportHashes;
    }

    // Function to retrieve specific report details
    function getReportDetails(string memory _ipfsHash) public view returns (string memory, uint256, address, string memory) {
        Report storage report = patients[msg.sender].reports[_ipfsHash];
        return (report.ipfsHash, report.timestamp, report.doctor, report.reportType);
    }
}
