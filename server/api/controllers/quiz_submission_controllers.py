from rest_framework.response import Response
from rest_framework import status
from api.serializers import QuizSubmissionSerializer
from api.models import QuizSubmission

from rest_framework.response import Response
from django.core.paginator import Paginator
from django.db.models import Q

from datetime import datetime
from dateutil.relativedelta import relativedelta

from django.db.models import Min, Max

def get(request):
      # === GET PARAMETERS ===
    search = request.GET.get('search')
    page_number = request.GET.get('pageNumber', 1)
    limit = int(request.GET.get('limit', 2000))
    quiz_id = request.GET.get('quiz')
    student_id = request.GET.get('student')
    reports = request.GET.get('reports')
    subject_id = request.GET.get('subject')
    teacher = request.GET.get('teacher')

    # === BASE QUERYSET ===
    qs = QuizSubmission.objects.select_related(
        'quiz__subject__course',
        'quiz__subject__teacher',
        'student'
    ).all().order_by('id')

    # === FILTERING ===
    if quiz_id:
        qs = qs.filter(quiz__id=quiz_id)
    if student_id:
        qs = qs.filter(student__id=student_id)

    if subject_id:
      qs = qs.filter(quiz__subject__id=subject_id)
      
    if teacher:
      qs = qs.filter(quiz__subject__teacher__id=teacher)
    
    if search:
        qs = qs.filter(
            Q(quiz__title__icontains=search) |
            Q(quiz__subject__subject_code__icontains=search) |
            Q(student__first_name__icontains=search) |
            Q(student__last_name__icontains=search) |
            Q(student__email__icontains=search)
        )
    
    total_submissions = 0
    if reports and reports == "admin":
      total_submissions = QuizSubmission.objects.count()

      # Instead of using min_date and max_date from data,
      # get current year and generate all months in that year
      current_year = datetime.now().year
      start_date = datetime(current_year, 1, 1)
      end_date = datetime(current_year, 12, 31)

      # Generate all months of the current year
      month_list = []
      current = start_date
      while current <= end_date:
          month_list.append(current.strftime('%Y-%m'))
          current += relativedelta(months=1)

      # Initialize monthly results with 0s for 'pass' and 'fail'
      monthly_results = {month: {'pass': 0, 'fail': 0} for month in month_list}

      # Get all submissions in the current year only
      submissions = qs.filter(submitted_at__year=current_year).prefetch_related('attempts__answer')

      for submission in submissions:
          total_attempts = submission.attempts.count()
          correct_answers = submission.attempts.filter(answer__is_correct=True).count()
          percentage = (correct_answers / total_attempts) * 100 if total_attempts > 0 else 0

          result = 'pass' if percentage >= 50 else 'fail'
          month_key = submission.submitted_at.strftime('%Y-%m') if submission.submitted_at else 'Unknown'

          if month_key in monthly_results:
              monthly_results[month_key][result] += 1
      
    # === PAGINATION ===
    paginator = Paginator(qs, limit)
    current_page = paginator.get_page(page_number)

    # === MANUAL SERIALIZATION ===
    serialized_data = []
    for submission in current_page:
        quiz = submission.quiz
        subject = quiz.subject
        course = subject.course
        teacher = subject.teacher
        student = submission.student

        serialized_data.append({
            "id": submission.id,
            "submitted_at": submission.submitted_at,
            "quiz": {
                "id": quiz.id,
                "title": quiz.title,
                "instructions": quiz.instructions,
                "quiz_start_date": quiz.quiz_start_date,
                "quiz_end_date": quiz.quiz_end_date,
                "subject": {
                    "id": subject.id,
                    "subject_code": subject.subject_code,
                    "description": subject.description,
                    "year": subject.year,
                    "course": {
                        "id": course.id,
                        "name": course.name
                    },
                    "teacher": {
                        "id": teacher.id,
                        "first_name": teacher.first_name,
                        "last_name": teacher.last_name,
                        "email": teacher.email
                    }
                }
            },
            "student": {
                "id": student.id,
                "first_name": student.first_name,
                "last_name": student.last_name,
                "email": student.email,
            }
        })

    # === RESPONSE ===
    return Response({
        "success": True,
        "message": "Quiz submissions retrieved successfully",
        "data": serialized_data,
        "reports":{
          "total_submissions": total_submissions,
          "monthly_results": monthly_results
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
  is_many = isinstance(request.data, list)
  serializer = QuizSubmissionSerializer(data=request.data, many=is_many)
  
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      quizSubmission = QuizSubmission.objects.get(pk=id)
   except QuizSubmission.DoesNotExist:
      return Response({"success": False, "message": "quiz submission not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = QuizSubmissionSerializer(quizSubmission, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      quizSubmission = QuizSubmission.objects.get(pk=id)
      quizSubmission.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_200_OK)
   except QuizSubmission.DoesNotExist:
      return Response({"success": False, "message": "quiz Submission not found"}, status=status.HTTP_404_NOT_FOUND)
