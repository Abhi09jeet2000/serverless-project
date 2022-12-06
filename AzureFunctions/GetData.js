module.exports = async function (context, req, inputDocument) {
  context.log('GetData function called.')
  if (req.query.email) {
    context.res = {
      status: 200,
      body: inputDocument,
    }
  } else {
    context.res = {
      status: 400,
      body: 'Please pass email as the query string',
    }
  }
}
