from rest_framework.response import Response
from rest_framework import status
from api.serializers import CourseSerializer
from api.models import Course

def get(request):
  courses = Course.objects.all()
  serializer = CourseSerializer(courses, many=True)
  return Response({"success": True, "message": "All courses retrieved successfully", "data": serializer.data})

def post(request):
  serializer = CourseSerializer(data=request.data)
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      course = Course.objects.get(pk=id)
   except Course.DoesNotExist:
      return Response({"success": False, "message": "course not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = CourseSerializer(course, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      course = Course.objects.get(pk=id)
      course.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
   except Course.DoesNotExist:
      return Response({"success": False, "message": "course not found"}, status=status.HTTP_404_NOT_FOUND)
