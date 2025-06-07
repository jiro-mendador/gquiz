from rest_framework.response import Response
from rest_framework import status
from api.serializers import QuizAttemptSerializer
from api.models import QuizAttempt, QuizChoice

from rest_framework.response import Response
from django.core.paginator import Paginator
from django.db.models import Q


def get(request):
  # === GET PARAMETERS ===
    search = request.GET.get('search')
    page_number = request.GET.get('pageNumber', 1)
    limit = int(request.GET.get('limit', 2000))
    quiz_id = request.GET.get('quiz')
    student_id = request.GET.get('student')
    question_id = request.GET.get('question')
    score_student_id = request.GET.get('score')
  
    # === BASE QUERYSET WITH SELECT_RELATED FOR JOINING RELATED MODELS ===
    attempt_qs = QuizAttempt.objects.select_related(
        'quiz', 'quiz__subject__course', 'quiz__subject__teacher',
        'question', 'student', 'answer'
    ).all()

    # === FILTERING ===
    if quiz_id:
        attempt_qs = attempt_qs.filter(quiz=quiz_id)
    
    if question_id:
        attempt_qs = attempt_qs.filter(question=question_id)

    if student_id:
        attempt_qs = attempt_qs.filter(student=student_id)

    # === SEARCH ===
    if search:
        attempt_qs = attempt_qs.filter(
            Q(quiz__title__icontains=search) |
            Q(student__first_name__icontains=search) |
            Q(student__last_name__icontains=search) |
            Q(question__question__icontains=search)
        )

    if score_student_id and quiz_id:
        score_qs = QuizAttempt.objects.select_related('answer').filter(
            student=score_student_id,
            quiz=quiz_id
        )
        score = 0
        total = score_qs.count()

        for attempt in score_qs:
          question_type = attempt.question.question_type

          if question_type == 'identification':
              correct_choices = QuizChoice.objects.filter(question=attempt.question, is_correct=True).values_list('choice', flat=True)

              # Normalize answers: strip and lowercase
              normalized_input = (attempt.input_answer or "").strip().lower()
              normalized_choices = [choice.strip().lower() for choice in correct_choices]

              if normalized_input in normalized_choices:
                  score += 1

          elif attempt.answer and attempt.answer.is_correct:
              score += 1

        return Response({
            "success": True,
            "message": "Score computed successfully",
            "data": {
                "student_id": int(score_student_id),
                "quiz_id": int(quiz_id),
                "score": score,
                "total": total,
                "percentage": round((score / total) * 100, 2) if total > 0 else 0.0
            }
        })
  
    # === PAGINATION ===
    paginator = Paginator(attempt_qs, limit)
    current_page = paginator.get_page(page_number)

    # === SERIALIZATION ===
    serialized_data = []
    for attempt in current_page:
        serialized_data.append({
            "id": attempt.id,
            "attempt_date": attempt.attempt_date,
            "quiz": {
                "id": attempt.quiz.id,
                "title": attempt.quiz.title,
                "subject": {
                    "id": attempt.quiz.subject.id,
                    "subject_code": attempt.quiz.subject.subject_code,
                    "description": attempt.quiz.subject.description,
                    "course": {
                        "id": attempt.quiz.subject.course.id,
                        "name": attempt.quiz.subject.course.name
                    },
                    "teacher": {
                        "id": attempt.quiz.subject.teacher.id,
                        "first_name": attempt.quiz.subject.teacher.first_name,
                        "last_name": attempt.quiz.subject.teacher.last_name,
                        "email": attempt.quiz.subject.teacher.email
                    }
                }
            },
            "question": {
                "id": attempt.question.id,
                "question": attempt.question.question,
                "question_type": attempt.question.question_type
            },
            "student": {
                "id": attempt.student.id,
                "first_name": attempt.student.first_name,
                "last_name": attempt.student.last_name,
                "email": attempt.student.email
            },
            "answer": {
                "id": attempt.answer.id if attempt.answer else None,
                "choice": attempt.answer.choice if attempt.answer else None,
                "is_correct": attempt.answer.is_correct if attempt.answer else None
            },
            "input_answer": {
                "choice": attempt.input_answer if attempt.answer else None
            }
        })

    # === RESPONSE ===
    return Response({
        "success": True,
        "message": "Quiz attempts retrieved successfully",
        "data": serialized_data,
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
  serializer = QuizAttemptSerializer(data=request.data, many=is_many)
  
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      quizAttempt = QuizAttempt.objects.get(pk=id)
   except QuizAttempt.DoesNotExist:
      return Response({"success": False, "message": "quiz Attempt not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = QuizAttemptSerializer(quizAttempt, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      quizAttempt = QuizAttempt.objects.get(pk=id)
      quizAttempt.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
   except QuizAttempt.DoesNotExist:
      return Response({"success": False, "message": "quiz Attempt not found"}, status=status.HTTP_404_NOT_FOUND)
