from ..controllers.user_controllers import get, post, put, delete, user_login

def userApi(request, id=None):
  if request.method == 'GET':
    return get(request)
  elif request.method == 'POST':
    return post(request)
  elif request.method == 'PUT':
    return put(request, id)
  elif request.method == 'DELETE':
    return delete(id)
  
def loginApi(request):
  if request.method == 'POST':
    return user_login(request)