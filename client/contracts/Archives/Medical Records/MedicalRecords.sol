// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecords {

    struct Report {
        string ipfsHash;
        address uploadedBy;
        address owner;
        mapping(address => bool) accessList;  // Access control list for doctors
    }

    // Mapping from IPFS hash to Report struct
    mapping(string => Report) public reports;

    // Mapping from patient to their report IPFS hashes
    mapping(address => string[]) public patientReports;
    
    // Mapping from doctor to specific report access (IPFS hash => access)
    mapping(address => mapping(string => bool)) public doctorReports;

    mapping(address => string[]) public doctorsReportsList;

    // Modifier to ensure only report owner (patient) can manage access
    modifier onlyOwner(string memory ipfsHash) {
        require(reports[ipfsHash].owner == msg.sender, "Not the report owner");
        _;
    }

    // Modifier to ensure only users with access can view the report
    modifier onlyWithAccess(string memory ipfsHash) {
        require(reports[ipfsHash].accessList[msg.sender], "Access denied");
        _;
    }

    // Event emitted when a report is uploaded
    event ReportUploaded(string ipfsHash, address indexed owner, address indexed uploadedBy);
    // Event emitted when a doctor is granted access
    event AccessGranted(string ipfsHash, address indexed doctor);
    // Event emitted when a doctor's access is revoked
    event AccessRevoked(string ipfsHash, address indexed doctor);

    // Upload a report by patient or doctor
    function uploadReport(address patientAddress, string memory ipfsHash) public {
        require(bytes(reports[ipfsHash].ipfsHash).length == 0, "Report already exists");

        Report storage newReport = reports[ipfsHash];
        newReport.ipfsHash = ipfsHash;
        newReport.uploadedBy = msg.sender;
        newReport.owner = patientAddress;
        newReport.accessList[patientAddress] = true;

        // If doctor uploads the report, grant doctor access
        if (msg.sender != patientAddress) {
            newReport.accessList[msg.sender] = true;
            doctorReports[msg.sender][ipfsHash] = true;  // Doctor gets access
            doctorsReportsList[msg.sender].push(ipfsHash);
        }

        // Add report to patient's list
        patientReports[patientAddress].push(ipfsHash);

        emit ReportUploaded(ipfsHash, patientAddress, msg.sender);
    }

    // Grant access to a doctor by the patient
    function grantAccess(string memory ipfsHash, address doctorAddress) public onlyOwner(ipfsHash) {
        reports[ipfsHash].accessList[doctorAddress] = true;
        doctorReports[doctorAddress][ipfsHash] = true;  // Add doctor access

        doctorsReportsList[doctorAddress].push(ipfsHash);

        emit AccessGranted(ipfsHash, doctorAddress);
    }

    // Revoke access from a doctor by the patient
    function revokeAccess(string memory ipfsHash, address doctorAddress) public onlyOwner(ipfsHash) {
        reports[ipfsHash].accessList[doctorAddress] = false;
        doctorReports[doctorAddress][ipfsHash] = false;  // Remove doctor access

        emit AccessRevoked(ipfsHash, doctorAddress);
    }

    // Get reports accessible to doctor
    function getDoctorReports(address doctorAddress) public view returns (string[] memory) {
        return doctorsReportsList[doctorAddress];
    }

    // Check if doctor has access to a specific report (on-chain, efficient lookup)
    function hasAccess(address doctorAddress, string memory ipfsHash) public view returns (bool) {
        return doctorReports[doctorAddress][ipfsHash];
    }
}
