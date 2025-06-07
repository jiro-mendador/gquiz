from rest_framework.response import Response
from rest_framework import status
from api.serializers import CourseSerializer
from api.models import Course

from rest_framework.response import Response
from django.core.paginator import Paginator
from django.db.models import Q

def get(request):
    # === GET PARAMETERS ===
    search = request.GET.get('search')
    page_number = request.GET.get('pageNumber', 1)
    limit = int(request.GET.get('limit', 2000))
    id = request.GET.get('id')
    reports = request.GET.get('reports')

    # === BASE QUERYSET ===
    courses = Course.objects.all()

    # === FILTER BY ID ===
    if id:
        courses = courses.filter(id=id)

    # === SEARCH FILTER ===
    if search:
        courses = courses.filter(
            Q(name__icontains=search)
        )

    total_courses = 0
    if reports and reports == "admin":
      total_courses = Course.objects.count()
  
    # === PAGINATION ===
    paginator = Paginator(courses, limit)
    current_page = paginator.get_page(page_number)
    serializer = CourseSerializer(current_page, many=True)

    # === RESPONSE ===
    return Response({
        "success": True,
        "message": "Courses retrieved successfully",
        "data": serializer.data,
        "reports":{
          "total_courses": total_courses
        } if reports else{},
        "pagination": {
            "totalItems": paginator.count,
            "totalPages": paginator.num_pages,
            "currentPage": current_page.number,
            "hasNext": current_page.has_next(),
            "hasPrevious": current_page.has_previous(),
        }
    })

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
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_200_OK)
   except Course.DoesNotExist:
      return Response({"success": False, "message": "course not found"}, status=status.HTTP_404_NOT_FOUND)
