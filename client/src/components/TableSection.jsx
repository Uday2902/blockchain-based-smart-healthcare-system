// src/components/TableSection.js
import React from 'react';
import './styles/TableSection.css';

const data = [
  {
    img: 'https://via.placeholder.com/50',
    name: 'Esthera Jackson',
    email: 'alexa@simmmpple.com',
    function: 'Organization',
    status: 'Online',
    employed: '14/06/21'
  },
  {
    img: 'https://via.placeholder.com/50',
    name: 'Alexa Liras',
    email: 'laurent@simmmpple.com',
    function: 'Developer',
    status: 'Offline',
    employed: '12/05/21'
  },
  {
    img: 'https://via.placeholder.com/50',
    name: 'Laurent Michael',
    email: 'laurent@simmmpple.com',
    function: 'Projects',
    status: 'Online',
    employed: '07/06/21'
  },
  {
    img: 'https://via.placeholder.com/50',
    name: 'Fredurado Hill',
    email: 'fredurado@simmmpple.com',
    function: 'Organization',
    status: 'Online',
    employed: '14/11/21'
  }
];

const TableSection = () => {
  return (
    <div className="table-section">
      <h2>Authors Table</h2>
      <table>
        <thead>
          <tr>
            <th>AUTHOR</th>
            <th>FUNCTION</th>
            <th>STATUS</th>
            <th>EMPLOYED</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="author">
                <img src={item.img} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.email}</p>
                </div>
              </td>
              <td>{item.function}</td>
              <td>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </td>
              <td>{item.employed}</td>
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

export default TableSection;
