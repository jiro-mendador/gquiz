def response(success=True, message="No response message", data=None):
  return {
    "success": success,
    "message": message, 
    "data": data
  }