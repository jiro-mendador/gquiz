from rest_framework.response import Response
from rest_framework import status
from api.serializers import SubjectSerializer
from api.models import Subject

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
    course = request.GET.get('course')
    teacher = request.GET.get('teacher')
    year = request.GET.get('year')
  
    # === BASE QUERYSET WITH JOIN ===
    subject_qs = Subject.objects.select_related('teacher').all()

    # === FILTER BY ID ===
    if id:
      subject_qs = subject_qs.filter(id=id)
    
    if teacher:
      subject_qs = subject_qs.filter(teacher=teacher)

    if course:
      subject_qs = subject_qs.filter(course=course)
    
    if year:
      subject_qs = subject_qs.filter(year=year)
    
    # === SEARCH FILTER ===
    if search:
        subject_qs = subject_qs.filter(
            Q(subject_code__icontains=search) |
            Q(description__icontains=search) |
            Q(teacher__first_name__icontains=search) |
            Q(teacher__last_name__icontains=search) |
            Q(course__name__icontains=search) |
            Q(year__icontains=search)
        )
    
    total_subjects = 0
    if reports and reports == "admin":
      total_subjects = Subject.objects.count()
  
    # === PAGINATION ===
    paginator = Paginator(subject_qs, limit)
    current_page = paginator.get_page(page_number)
    
    # === SERIALIZATION (include teacher info manually if needed) ===
    serialized_data = []
    for subject in current_page:
        serialized_data.append({
            "id": subject.id,
            "subject_code": subject.subject_code,
            "description": subject.description,
            "course": {
                "id": subject.course.id,
                "name": subject.course.name,
            },
            "teacher": {
                "id": subject.teacher.id,
                "first_name": subject.teacher.first_name,
                "last_name": subject.teacher.last_name,
                "email": subject.teacher.email,
            },
            "year" : subject.year
        })

    # === RESPONSE ===
    return Response({
        "success": True,
        "message": "Subjects retrieved successfully",
        "data": serialized_data,
        "reports":{
          "total_subjects": total_subjects
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
  serializer = SubjectSerializer(data=request.data)
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      subject = Subject.objects.get(pk=id)
   except Subject.DoesNotExist:
      return Response({"success": False, "message": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = SubjectSerializer(subject, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      subject = Subject.objects.get(pk=id)
      subject.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_200_OK)
   except Subject.DoesNotExist:
      return Response({"success": False, "message": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)
