import axios from 'axios'

const constants = {
  api: {
    baseURL: 'https://apimserverless.azure-api.net/appserverless', //Base url of api management
  },
}

export default axios.create({
  baseURL: constants.api.baseURL,
  headers: { 'Ocp-Apim-Subscription-Key': '269922ebb73f4d568e1c57a27554dba1' }, //subscription key
})
