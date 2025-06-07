from rest_framework.response import Response
from rest_framework import status
from api.serializers import StudentCourseYearSectionSerializer
from api.models import StudentCourseYearSection
from django.db.models import Count

from django.db.models import Count
from rest_framework.response import Response

def get(request):
    student = request.GET.get('student')

    # === Filtered QuerySet with optional student filter ===
    student_course_year_section_subject = StudentCourseYearSection.objects.select_related('course').all()
    
    if student:
        student_course_year_section_subject = student_course_year_section_subject.filter(student=student)

    # === Serialize filtered data ===
    serializer = StudentCourseYearSectionSerializer(student_course_year_section_subject, many=True)

    # === Count total students per course ===
    course_student_counts = (
        StudentCourseYearSection.objects
        .values('course__id', 'course__name')
        .annotate(total_students=Count('student'))
        .order_by('course__name')
    )

    # === Format course summary ===
    course_summary = [
        {
            "courseId": entry["course__id"],
            "courseName": entry["course__name"],
            "totalStudents": entry["total_students"]
        }
        for entry in course_student_counts
    ]

    return Response({
        "success": True,
        "message": "All student course year section subject retrieved successfully",
        "data": serializer.data,
        "summary": {
            "totalStudentsPerCourse": course_summary
        }
    })

def post(request):
  serializer = StudentCourseYearSectionSerializer(data=request.data)
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      student_course_year_section_subject = StudentCourseYearSection.objects.get(pk=id)
   except StudentCourseYearSection.DoesNotExist:
      return Response({"success": False, "message": "student_course_year_section_subject not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = StudentCourseYearSectionSerializer(student_course_year_section_subject, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      student_course_year_section_subject = StudentCourseYearSection.objects.get(pk=id)
      student_course_year_section_subject.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
   except StudentCourseYearSection.DoesNotExist:
      return Response({"success": False, "message": "course not found"}, status=status.HTTP_404_NOT_FOUND)
