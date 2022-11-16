import React, { useState, useEffect } from 'react'
import './App.css'
import api from './Api'

import { Table, Button } from 'react-bootstrap'

const AllData = (props) => {
  const [allUserData, setAllUserData] = useState([])

  // useEffect(() => {}, [])

  const getAllUserData = () => {
    api({
      method: 'get',
      url: '/GetAllData',
    })
      .then((response) => {
        setAllUserData(response.data)
        props.setStatusMessage('Data about all users received successfully')
      })
      .catch((error) => {
        props.setStatusMessage('Error getting data about logged in user.')
      })
  }
  return (
    <div className="box boxGap">
      <div className="buttonContainer">
        <Button variant="success" onClick={() => getAllUserData()}>
          Get All Data, here
        </Button>
      </div>
      {console.log(allUserData.length)}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User</th>
            <th>Interests</th>
          </tr>
        </thead>
        <tbody>
          {allUserData.map((listValue, index) => (
            <tr key={index}>
              <td>{listValue.email}</td>
              <td>{listValue.interests}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default AllData
