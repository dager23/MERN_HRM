import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [jobData, setJobData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [highestLowestData, setHighestLowestData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch('http://localhost:8081/jobtitle.json');
        const data1 = await response1.json();
        setJobData(data1);

        const response2 = await fetch('http://localhost:8081/department.json');
        const data2 = await response2.json();
        setDepartmentData(data2);

        const response3 = await fetch('http://localhost:8081/hourlyrate.json');
        const data3 = await response3.json();
        setHighestLowestData(data3);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', justifyContent: 'center' }}>
      <div>
        <h2>Graph 1</h2>
        <img src="http://localhost:8081/graph.png" alt="Graph 1" style={{ width: '100%' }} />
      </div>
      <div>
        <h2>Graph 2</h2>
        <img src="http://localhost:8081/graph2.png" alt="Graph 2" style={{ width: '100%' }} />
      </div>
      <div>
        <h2>Graph 3</h2>
        <img src="http://localhost:8081/graph3.png" alt="Graph 3" style={{ width: '100%' }} />
      </div>
      <div>
        <h2>Graph 4</h2>
        <img src="http://localhost:8081/graph4.png" alt="Graph 4" style={{ width: '100%' }} />
      </div>
      <div>
        <h2>Graph 5</h2>
        <img src="http://localhost:8081/graph5.png" alt="Graph 5" style={{ width: '100%' }} />
      </div>
      <div>
        <h2>Data Table 1</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '10px' }}>Job Title</th>
              <th style={{ border: '1px solid black', padding: '10px' }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {jobData.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '10px' }}>{item._id}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Data Table 2</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '10px' }}>Department</th>
              <th style={{ border: '1px solid black', padding: '10px' }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {departmentData.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '10px' }}>{item._id}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Data Table 3</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '10px' }}>Type</th>
              <th style={{ border: '1px solid black', padding: '10px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {highestLowestData.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '10px' }}>{Object.keys(item)[0]}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{item[Object.keys(item)[0]]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Graph 6</h2>
        <img src="http://localhost:8081/graph6.png" alt="Graph 5" style={{ width: '200%' }} />
      </div>
    </div>
  );
};

export default Profile;
