async function handleRouteNotFound(req, res) {
return  res.status(404).json({
    status: "Failed",
    message:"Route not found"
  })
}

module.exports = handleRouteNotFound;
