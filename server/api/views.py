from rest_framework.decorators import api_view
from .routes.user_routes import userApi, loginApi
from .routes.course_routes import courseApi
from .routes.year_section_routes import yearSectionApi
from .routes.subject_routes import subjectApi
from .routes.student_course_year_section_subject_routes import studentCourseYearSectionSubjectApi
from .routes.quiz_routes import quizApi
# from django.views.decorators.csrf import csrf_exempt

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def user(request, id=None):
  return userApi(request, id)

@api_view(['POST'])
# @csrf_exempt
def user_login(request):
  return loginApi(request)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def course(request, id=None):
  return courseApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def year_section(request, id=None):
  return yearSectionApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def subject(request, id=None):
  return subjectApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def studentCourseYearSectionSubject(request, id=None):
  return studentCourseYearSectionSubjectApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def quiz(request, id=None):
  return quizApi(request, id)