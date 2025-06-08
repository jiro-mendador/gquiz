from rest_framework.response import Response
from rest_framework import status
from api.serializers import QuizSerializer
from api.models import Quiz, StudentCourseYearSection, QuizSubmission, YearSection

from rest_framework.response import Response
from django.core.paginator import Paginator
from django.db.models import Q
from django.utils.timezone import now
from datetime import timedelta
import re

def get(request):
    # === GET PARAMETERS ===
    search = request.GET.get('search')
    page_number = request.GET.get('pageNumber', 1)
    limit = int(request.GET.get('limit', 2000))
    quiz_id = request.GET.get('id')
    subject_id = request.GET.get('subject')
    student_id = request.GET.get('student_id')
    reports = request.GET.get('reports')
    today = request.GET.get('today')
    upcoming = request.GET.get('upcoming')
    teacher = request.GET.get('teacher')

    # === BASE QUERYSET WITH SELECT_RELATED FOR JOINING SUBJECT, TEACHER, COURSE ===
    quiz_qs = Quiz.objects.select_related('subject__teacher', 'subject__course').all()

    if today:
      start_of_day = now().replace(hour=0, minute=0, second=0, microsecond=0)
      end_of_day = start_of_day + timedelta(days=1)
      quiz_qs = quiz_qs.filter(quiz_start_date__gte=start_of_day, quiz_start_date__lt=end_of_day)

    elif upcoming:
        start_of_tomorrow = now().replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
        quiz_qs = quiz_qs.filter(quiz_start_date__gte=start_of_tomorrow)

    # === FILTER BY QUIZ ID ===
    if quiz_id:
        quiz_qs = quiz_qs.filter(id=quiz_id)

    # === FILTER BY STUDENT'S ENROLLED COURSE (if student_id is provided) ===
    if student_id:
        try:
            enrollment = StudentCourseYearSection.objects.select_related('course','year_section').get(student_id=student_id)
            student_course = enrollment.course
            student_year_section = enrollment.year_section
            
            print("\n\n\n\n\n\n")
            print(student_year_section.year)
            print("\n\n\n\n\n\n")
            
            # Filter subjects in that course
            subject_filter = Q(subject__course=student_course, subject__year=student_year_section.year)

            if subject_id:
                subject_filter &= Q(subject_id=subject_id)

            quiz_qs = quiz_qs.filter(subject_filter)

            # Optional: exclude already submitted quizzes
            submitted_quiz_ids = QuizSubmission.objects.filter(student_id=student_id).values_list('quiz_id', flat=True)
            quiz_qs = quiz_qs.exclude(id__in=submitted_quiz_ids)

        except StudentCourseYearSection.DoesNotExist:
            return Response({
                "success": False,
                "message": "Student not enrolled in any course"
            }, status=status.HTTP_404_NOT_FOUND)

    elif subject_id:
        quiz_qs = quiz_qs.filter(subject=subject_id)

    if teacher:
      quiz_qs = quiz_qs.filter(subject__teacher_id=teacher)
    
    # === SEARCH FILTER ===
    if search:
        quiz_qs = quiz_qs.filter(
            Q(title__icontains=search) |
            Q(subject__subject_code__icontains=search) |
            Q(subject__description__icontains=search) |
            Q(subject__teacher__first_name__icontains=search) |
            Q(subject__teacher__last_name__icontains=search) |
            Q(subject__course__name__icontains=search)
        )

    total_quizzes = 0
    if reports == "admin":
        total_quizzes = Quiz.objects.count()

    quiz_qs = quiz_qs.order_by('quiz_start_date')
    
    # === PAGINATION ===
    paginator = Paginator(quiz_qs, limit)
    current_page = paginator.get_page(page_number)

    # === SERIALIZATION MANUALLY ===
    serialized_data = []
    for quiz in current_page:
        serialized_data.append({
            "id": quiz.id,
            "title": quiz.title,
            "instructions": quiz.instructions,
            "quiz_start_date": quiz.quiz_start_date,
            "quiz_end_date": quiz.quiz_end_date,
            "subject": {
                "id": quiz.subject.id,
                "subject_code": quiz.subject.subject_code,
                "description": quiz.subject.description,
                "year": quiz.subject.year,
                "course": {
                    "id": quiz.subject.course.id,
                    "name": quiz.subject.course.name,
                },
                "teacher": {
                    "id": quiz.subject.teacher.id,
                    "first_name": quiz.subject.teacher.first_name,
                    "last_name": quiz.subject.teacher.last_name,
                    "email": quiz.subject.teacher.email,
                }
            }
        })

    # === RESPONSE ===
    return Response({
        "success": True,
        "message": "Quizzes retrieved successfully",
        "data": serialized_data,
        "reports": {
            "total_quizzes": total_quizzes
        } if reports else {},
        "pagination": {
            "totalItems": paginator.count,
            "totalPages": paginator.num_pages,
            "currentPage": current_page.number,
            "hasNext": current_page.has_next(),
            "hasPrevious": current_page.has_previous(),
        }
    })

# def get(request):
#     # === GET PARAMETERS ===
#     search = request.GET.get('search')
#     page_number = request.GET.get('pageNumber', 1)
#     limit = int(request.GET.get('limit', 2000))
#     quiz_id = request.GET.get('id')
#     subject = request.GET.get('subject')
#     reports = request.GET.get('reports')

#     # === BASE QUERYSET WITH SELECT_RELATED FOR JOINING SUBJECT, TEACHER, COURSE ===
#     quiz_qs = Quiz.objects.select_related('subject__teacher', 'subject__course').all()

#     # === FILTER BY QUIZ ID ===
#     if quiz_id:
#         quiz_qs = quiz_qs.filter(id=quiz_id)

#     if subject:
#         quiz_qs = quiz_qs.filter(subject=subject)
    
    
#     # === SEARCH FILTER ===
#     if search:
#         quiz_qs = quiz_qs.filter(
#             Q(title__icontains=search) |
#             Q(subject__subject_code__icontains=search) |
#             Q(subject__description__icontains=search) |
#             Q(subject__teacher__first_name__icontains=search) |
#             Q(subject__teacher__last_name__icontains=search) |
#             Q(subject__course__name__icontains=search)
#         )

#     total_quizzes = 0
#     if reports and reports == "admin":
#       total_quizzes = Quiz.objects.count()
    
#     # === PAGINATION ===
#     paginator = Paginator(quiz_qs, limit)
#     current_page = paginator.get_page(page_number)

#     # === SERIALIZATION MANUALLY ===
#     serialized_data = []
#     for quiz in current_page:
#         serialized_data.append({
#             "id": quiz.id,
#             "title": quiz.title,
#             "instructions": quiz.instructions,
#             "quiz_start_date": quiz.quiz_start_date,
#             "quiz_end_date": quiz.quiz_end_date,
#             "subject": {
#                 "id": quiz.subject.id,
#                 "subject_code": quiz.subject.subject_code,
#                 "description": quiz.subject.description,
#                 "year": quiz.subject.year,
#                 "course": {
#                     "id": quiz.subject.course.id,
#                     "name": quiz.subject.course.name,
#                 },
#                 "teacher": {
#                     "id": quiz.subject.teacher.id,
#                     "first_name": quiz.subject.teacher.first_name,
#                     "last_name": quiz.subject.teacher.last_name,
#                     "email": quiz.subject.teacher.email,
#                 }
#             }
#         })

#     # === RESPONSE ===
#     return Response({
#         "success": True,
#         "message": "Quizzes retrieved successfully",
#         "data": serialized_data,
#         "reports":{
#           "total_quizzes": total_quizzes
#         } if reports else{},
#         "pagination": {
#             "totalItems": paginator.count,
#             "totalPages": paginator.num_pages,
#             "currentPage": current_page.number,
#             "hasNext": current_page.has_next(),
#             "hasPrevious": current_page.has_previous(),
#         }
#     })

def post(request):
  serializer = QuizSerializer(data=request.data)
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      quiz = Quiz.objects.get(pk=id)
   except Quiz.DoesNotExist:
      return Response({"success": False, "message": "quiz not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = QuizSerializer(quiz, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      quiz = Quiz.objects.get(pk=id)
      quiz.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_200_OK)
   except Quiz.DoesNotExist:
      return Response({"success": False, "message": "quiz not found"}, status=status.HTTP_404_NOT_FOUND)
