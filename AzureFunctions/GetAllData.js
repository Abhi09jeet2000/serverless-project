module.exports = async function (context, req, inputDocument) {
  context.log('Get All Data functions called.')
  context.res = {
    status: 200,
    body: inputDocument,
  }
}
