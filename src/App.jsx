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

import { MsalProvider, useMsal } from '@azure/msal-react'
import { EventType } from '@azure/msal-browser'

import { Route, Routes } from 'react-router-dom'

import { b2cPolicies, protectedResources } from './authConfig'

const Pages = () => {
  /**
   * useMsal is hook that returns the PublicClientApplication instance,
   * an array of all accounts currently signed in and an inProgress value
   * that tells you what msal is currently doing. For more, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
   */
  const { instance } = useMsal()
  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (
        (event.eventType === EventType.LOGIN_SUCCESS ||
          event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
        event.payload.account
      ) {
        /**
         * For the purpose of setting an active account for UI update, we want to consider only the auth
         * response resulting from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy
         * policies may use "acr" instead of "tfp"). To learn more about B2C tokens, visit:
         * https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
         */
        if (
          event.payload.idTokenClaims['tfp'] === b2cPolicies.names.editProfile
        ) {
          // retrieve the account from initial sing-in to the app
          const originalSignInAccount = instance
            .getAllAccounts()
            .find(
              (account) =>
                account.idTokenClaims.oid === event.payload.idTokenClaims.oid &&
                account.idTokenClaims.sub === event.payload.idTokenClaims.sub &&
                account.idTokenClaims['tfp'] === b2cPolicies.names.signUpSignIn,
            )

          let signUpSignInFlowRequest = {
            authority: b2cPolicies.authorities.signUpSignIn.authority,
            account: originalSignInAccount,
          }

          // silently login again with the signUpSignIn policy
          instance.ssoSilent(signUpSignInFlowRequest)
        }
      }

      if (event.eventType === EventType.LOGIN_FAILURE) {
        // Check for forgot password error
        // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
        if (event.error && event.error.errorMessage.includes('AADB2C90118')) {
          const resetPasswordRequest = {
            authority: b2cPolicies.authorities.forgotPassword.authority,
            scopes: [],
          }
          instance.loginRedirect(resetPasswordRequest)
        }
      }
    })

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId)
      }
    }
    // eslint-disable-next-line
  }, [instance])

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

const App = ({ instance }) => {
  return (
    <MsalProvider instance={instance}>
      <Pages />
    </MsalProvider>
  )
}

export default App
