import React, { useState, useEffect } from 'react'

import {
  Container,
  Navbar,
  Button,
  Form,
  Table,
  Col,
  Row,
  Alert,
} from 'react-bootstrap'
import AllData from './AllData'

import api from './Api'

import './App.css'

function App() {
  const [statusMessage, setStatusMessage] = useState('')
  const [userLocation, setUserLocation] = useState('')
  const [userInterests, setUserInterests] = useState('')
  const [allUserData, setAllUserData] = useState([])
  const [currentUser, setCurrentUser] = useState('user1@gmail.com')

  const getUserData = () => {
    api({
      method: 'get',
      url: '/GetData?email=' + currentUser,
    })
      .then((response) => {
        if (response.data[0]) {
          setUserLocation(response.data[0].location)
          setUserInterests(response.data[0].interests)
          setStatusMessage(
            'Data about the logged in user recevied successfully',
          )
        }
      })
      .catch((error) => {
        setStatusMessage('Error getting data about logged in user.')
      })
  }

  const saveUserData = () => {
    api({
      method: 'put',
      url: '/SaveData?email=' + currentUser,
      data: {
        location: userLocation,
        interests: userInterests,
      },
    })
      .then((resonse) => {
        setStatusMessage('Data saved successfully')
      })
      .catch((error) => {
        setStatusMessage('Error saving data about the user.')
      })
  }

  const deleteUserData = () => {
    api({
      method: 'delete',
      url: '/Delete?email=' + currentUser,
    })
      .then((response) => {
        setUserLocation('')
        setUserInterests('')
        setStatusMessage('Data about the user deleted successfully')
      })
      .catch((error) => {
        setStatusMessage('Error deleting data about user.')
      })
  }

  // const getAllUserData = () => {
  //   api({
  //     method: 'get',
  //     url: '/GetAllData',
  //   })
  //     .then((response) => {
  //       setAllUserData([response.data])
  //       setStatusMessage('Data about all users received successfully')
  //       // console.log(allUserData)
  //     })
  //     .catch((error) => {
  //       setStatusMessage('Error getting data about logged in user.')
  //     })
  // }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <Container>
      <Navbar bg="primary" variant="dark" className="justify-content-between">
        <Navbar.Brand>My Profile</Navbar.Brand>
        <Navbar.Text>Signed in as: {currentUser}</Navbar.Text>
      </Navbar>

      <Form className="box">
        <Form.Group as={Row} controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Email
          </Form.Label>
          <Col sm="10">
            <Form.Control readOnly defaultValue={currentUser} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Location
          </Form.Label>
          <Col sm="10">
            <Form.Control
              placeholder="Enter your location"
              value={userLocation || ''}
              onChange={(event) => setUserLocation(event.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Interests
          </Form.Label>
          <Col sm="10">
            <Form.Control
              placeholder="Enter your interests"
              value={userInterests || ''}
              onChange={(event) => setUserInterests(event.target.value)}
            />
          </Col>
        </Form.Group>
        <div className="buttonContainer">
          <Button
            variant="primary"
            className="buttonGap"
            onClick={() => {
              saveUserData()
            }}
          >
            Save Data
          </Button>
          <Button
            variant="danger"
            className="buttonGap"
            onClick={() => {
              deleteUserData()
            }}
          >
            Delete My Data
          </Button>
          <Button variant="info">Sign out</Button>
        </div>
      </Form>
      <Alert variant="info">Status:{statusMessage}</Alert>
      <AllData setStatusMessage={setStatusMessage} />
      {/* <div className="box boxGap">
        <div className="buttonContainer">
          <Button variant="success" onClick={() => getAllUserData()}>
            Get All Data
          </Button>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User</th>
              <th>Interests</th>
            </tr>
          </thead>
          <tbody>
            {allUserData.map((listValue, index) => {
              ;<tr key={index}>
                <td>{listValue.email}</td>
                <td>{listValue.interests}</td>
              </tr>
              // console.log(listValue)
            })}
          </tbody>
        </Table>
      </div> */}
    </Container>
  )
}

export default App
