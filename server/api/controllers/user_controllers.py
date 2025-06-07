from rest_framework.response import Response
from rest_framework import status
from api.serializers import UserSerializer, StudentCourseYearSectionSerializer
from api.models import User, StudentCourseYearSection
from django.contrib.auth import authenticate, login

from rest_framework.response import Response
from django.core.paginator import Paginator
from django.db.models import Q

def user_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"success": False, "message": "email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, email=email, password=password)
    
    print("USER", user)
    
    if user is not None:
        login(request, user)
        return Response({
            "success": True,
            "message": "Login successful",
            "user_id": user.id,
            "last_login": user.last_login,
            "role": user.role
        })
    else:
        return Response({"success": False, "message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

def get(request):
    # === GET PARAMETERS ===
    search = request.GET.get('search')
    page_number = request.GET.get('pageNumber', 1)
    limit = int(request.GET.get('limit', 2000))
    role = request.GET.get('role')
    user_id = request.GET.get('id')
    reports = request.GET.get('reports')

    # === BASE QUERYSET ===
    users = User.objects.all()

    # === FILTER BY ID ===
    if user_id:
        users = users.filter(id=user_id)

    # === FILTER BY ROLE ===
    if role:
        users = users.filter(role=role)

    # === SEARCH FILTER === (adjust fields as needed)
    if search:
        users = users.filter(
            Q(username__icontains=search) |
            Q(email__icontains=search) |
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search)
        )

     # === Additional Data from Another Model if user_id is present ===
    course_year_section_data = None
    if user_id:
      try:
          course_year_section = StudentCourseYearSection.objects.filter(student=user_id)
          course_year_section_data = StudentCourseYearSectionSerializer(course_year_section, many=True).data
          print(course_year_section_data)
      except StudentCourseYearSection.DoesNotExist:
          course_year_section_data = []
    
    # === Generate role counts if reports=admin ===
    role_counts = {}
    if reports == 'admin':
        total_users = User.objects.count()
        total_admins = User.objects.filter(role='admin').count()
        total_students = User.objects.filter(role='student').count()
        total_teachers = User.objects.filter(role='teacher').count()

        role_counts = {
            "totalUsers": total_users,
            "totalAdmins": total_admins,
            "totalStudents": total_students,
            "totalTeachers": total_teachers,
        }
    
       # === PAGINATION ===
    paginator = Paginator(users, limit)
    current_page = paginator.get_page(page_number)
    serializer = UserSerializer(current_page, many=True)
    
    # === RESPONSE ===
    return Response({
        "success": True,
        "message": "Users retrieved successfully",
        "data": serializer.data,
        "extra": {
          "course_year_section": course_year_section_data
        } if user_id else {},
        "reports": {
         "role_counts" : role_counts,
        } if reports else {},
        "pagination": {
            "totalItems": paginator.count,
            "totalPages": paginator.num_pages,
            "currentPage": current_page.number,
            "hasNext": current_page.has_next(),
            "hasPrevious": current_page.has_previous(),
        }
    })

def post(request):
  serializer = UserSerializer(data=request.data)
  if serializer.is_valid():
      serializer.save()      
      return Response({"success": True, "message": "Information Registered Successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      user = User.objects.get(pk=id)
   except User.DoesNotExist:
      return Response({"success": False, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = UserSerializer(user, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      user = User.objects.get(pk=id)
      user.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_200_OK)
   except User.DoesNotExist:
      return Response({"success": False, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
