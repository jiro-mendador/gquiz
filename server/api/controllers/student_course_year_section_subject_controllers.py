from rest_framework.response import Response
from rest_framework import status
from api.serializers import StudentCourseYearSectionSubjectSerializer
from api.models import StudentCourseYearSectionSubject

def get(request):
  student_course_year_section_subject = StudentCourseYearSectionSubject.objects.all()
  serializer = StudentCourseYearSectionSubjectSerializer(student_course_year_section_subject, many=True)
  return Response({"success": True, "message": "All student course year section subject retrieved successfully", "data": serializer.data})

def post(request):
  serializer = StudentCourseYearSectionSubjectSerializer(data=request.data)
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      student_course_year_section_subject = StudentCourseYearSectionSubject.objects.get(pk=id)
   except StudentCourseYearSectionSubject.DoesNotExist:
      return Response({"success": False, "message": "student_course_year_section_subject not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = StudentCourseYearSectionSubjectSerializer(student_course_year_section_subject, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      student_course_year_section_subject = StudentCourseYearSectionSubject.objects.get(pk=id)
      student_course_year_section_subject.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
   except StudentCourseYearSectionSubject.DoesNotExist:
      return Response({"success": False, "message": "course not found"}, status=status.HTTP_404_NOT_FOUND)
