from ..controllers.course_controllers import get, post, put, delete

def courseApi(request, id=None):
  if request.method == 'GET':
    return get(request)
  elif request.method == 'POST':
    return post(request)
  elif request.method == 'PUT':
    return put(request, id)
  elif request.method == 'DELETE':
    return delete(id)