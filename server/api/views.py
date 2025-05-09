from rest_framework.decorators import api_view
from .routes.user_routes import userApi, loginApi
from .routes.course_routes import courseApi
from .routes.year_section_routes import yearSectionApi
from .routes.subject_routes import subjectApi

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def user(request, id=None):
  return userApi(request, id)

@api_view(['POST'])
def user_login(request):
  return loginApi(request)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def course(request, id=None):
  return courseApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def year_section(request, id=None):
  return yearSectionApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def subject(request, id=None):
  return subjectApi(request, id)