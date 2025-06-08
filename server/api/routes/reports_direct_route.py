from django.db.models import Count, Avg, Q, F
from django.utils.timezone import make_aware
from rest_framework.decorators import api_view
from rest_framework.response import Response
from collections import defaultdict
from datetime import datetime

from api.models import Quiz, QuizSubmission, QuizAttempt, QuizChoice, QuizQuestion, User

from django.db.models import Count, Avg, Q, F
from django.utils.timezone import make_aware
from rest_framework.decorators import api_view
from rest_framework.response import Response
from collections import defaultdict
from datetime import datetime

from api.models import Quiz, QuizSubmission, QuizAttempt, QuizChoice, QuizQuestion, User

def get_quiz_report(request):
    role = request.query_params.get('reports')  # 'admin' or 'teacher'
    user_id = request.query_params.get('user')
    quiz_id = request.query_params.get('quiz')  # <-- new filter

    # Get user object if user_id given
    user = None
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

    # Base submissions queryset
    submissions = QuizSubmission.objects.all()

    # Filter by teacher role and user
    if role == 'teacher' and user:
        submissions = submissions.filter(quiz__subject__teacher=user)
        if quiz_id:
            submissions = submissions.filter(quiz_id=quiz_id)

    # 1. Average time spent by student on quizzes
    avg_time_data = defaultdict(list)
    for submission in submissions:
        quiz_start = submission.quiz.quiz_start_date
        submitted_at = submission.submitted_at

        if quiz_start and submitted_at:
            duration = (submitted_at - quiz_start).total_seconds() / 60  # minutes
            avg_time_data[submission.quiz.id].append(duration)

    if role == 'admin':
        avg_time_val = (sum([sum(times) for times in avg_time_data.values()]) / sum([len(times) for times in avg_time_data.values()])) if avg_time_data else 0
        avg_time = {
            "overall_average_minutes": round(avg_time_val, 2)
        }
    else:
        # Include quiz id and title for clarity
        avg_time = {
            k: {
                "quiz_title": Quiz.objects.get(id=k).title,
                "average_minutes": round(sum(v)/len(v), 2)
            }
            for k, v in avg_time_data.items() if v
        }

    # 2. Pass vs Fail stats per month per quiz
    target_year = datetime.now().year

    # Initialize all months with 0 pass/fail counts
    monthly_results = {
        f"{target_year}-{str(month).zfill(2)}": {'pass': 0, 'fail': 0}
        for month in range(1, 13)
    }

    passing_score = 0.5

    # Filter submissions again for monthly results (reuse filters above)
    monthly_submissions = QuizSubmission.objects.all()
    if role == 'teacher' and user:
        monthly_submissions = monthly_submissions.filter(quiz__subject__teacher=user)
        if quiz_id:
            monthly_submissions = monthly_submissions.filter(quiz_id=quiz_id)

    # Track pass/fail counts per month + quiz id/title for extra info
    monthly_results_detailed = defaultdict(lambda: defaultdict(lambda: {'pass': 0, 'fail': 0}))

    for sub in monthly_submissions:
        if not sub.submitted_at or sub.submitted_at.year != target_year:
            continue
        attempts = QuizAttempt.objects.filter(submission=sub)
        total = attempts.count()
        if total == 0:
            continue
        correct = attempts.filter(answer__is_correct=True).count()
        month_key = sub.submitted_at.strftime('%Y-%m')
        result = 'pass' if correct / total >= passing_score else 'fail'

        # Update simple aggregate
        monthly_results[month_key][result] += 1

        # Update detailed by quiz
        monthly_results_detailed[month_key][sub.quiz.id][result] += 1

    # Format detailed monthly results by quiz for response
    monthly_results_with_quiz = {}
    for month, quizzes in monthly_results_detailed.items():
        monthly_results_with_quiz[month] = {}
        for qid, results in quizzes.items():
            quiz_title = Quiz.objects.get(id=qid).title
            monthly_results_with_quiz[month][qid] = {
                "quiz_title": quiz_title,
                "pass": results['pass'],
                "fail": results['fail']
            }

    # 3. Common mistakes
    wrong_answers = QuizAttempt.objects.exclude(answer__is_correct=True)
    if role == 'teacher' and user:
        wrong_answers = wrong_answers.filter(quiz__subject__teacher=user)
        if quiz_id:
            wrong_answers = wrong_answers.filter(quiz_id=quiz_id)

    common_mistakes = {}
    for question in QuizQuestion.objects.all():
        attempts = wrong_answers.filter(question=question)
        total_attempts = QuizAttempt.objects.filter(question=question).count()
        if total_attempts == 0:
            continue

        wrong_count = attempts.values('answer__choice').annotate(count=Count('id')).order_by('-count')
        if wrong_count:
            most_common = wrong_count[0]
            correct_choice = QuizChoice.objects.filter(question=question, is_correct=True).first()
            misconception = most_common['answer__choice'] if most_common['answer__choice'] else 'N/A'
            common_mistakes[question.id] = {
                'question_text': question.question,
                'correct_answer': correct_choice.choice if correct_choice else 'N/A',
                'common_wrong_answer': misconception,
                '%wrong': round((sum([x['count'] for x in wrong_count]) / total_attempts) * 100, 2),
                'misconception': misconception
            }

    return Response({
        'success': True,
        'message': 'Teacher Reports Successfully Generated!',
        'reports': role,
        'average_time_minutes': avg_time,
        'monthly_results_summary': monthly_results,
        'monthly_results_by_quiz': monthly_results_with_quiz,
        'common_mistakes': common_mistakes
    })

# def get_quiz_report(request):
#     role = request.query_params.get('reports')  # 'admin' or 'teacher'
#     user_id = request.query_params.get('user')
#     quiz_id = request.query_params.get('quiz')  # <-- new filter

#     # Get user object if user_id given
#     user = None
#     if user_id:
#         try:
#             user = User.objects.get(id=user_id)
#         except User.DoesNotExist:
#             return Response({"error": "User not found"}, status=404)

#     # Base submissions queryset
#     submissions = QuizSubmission.objects.all()

#     # Filter by teacher role and user
#     if role == 'teacher' and user:
#         submissions = submissions.filter(quiz__subject__teacher=user)
#         if quiz_id:
#             submissions = submissions.filter(quiz_id=quiz_id)

#     # 1. Average time spent by student on quizzes
#     avg_time_data = defaultdict(list)
#     for submission in submissions:
#         quiz_start = submission.quiz.quiz_start_date
#         submitted_at = submission.submitted_at

#         if quiz_start and submitted_at:
#             duration = (submitted_at - quiz_start).total_seconds() / 60  # minutes
#             avg_time_data[submission.quiz.id].append(duration)

#     if role == 'admin':
#         avg_time = (sum([sum(times) for times in avg_time_data.values()]) / sum([len(times) for times in avg_time_data.values()])) if avg_time_data else 0
#     else:
#         avg_time = {str(Quiz.objects.get(id=k).title): round(sum(v)/len(v), 2) for k, v in avg_time_data.items() if v}

#     # 2. Pass vs Fail stats per month per quiz
#     target_year = datetime.now().year

#     # Initialize all months with 0 pass/fail counts
#     monthly_results = {
#         f"{target_year}-{str(month).zfill(2)}": {'pass': 0, 'fail': 0}
#         for month in range(1, 13)
#     }

#     passing_score = 0.5

#     # Filter submissions again for monthly results (reuse filters above)
#     monthly_submissions = QuizSubmission.objects.all()
#     if role == 'teacher' and user:
#         monthly_submissions = monthly_submissions.filter(quiz__subject__teacher=user)
#         if quiz_id:
#             monthly_submissions = monthly_submissions.filter(quiz_id=quiz_id)

#     for sub in monthly_submissions:
#         if not sub.submitted_at or sub.submitted_at.year != target_year:
#             continue
#         attempts = QuizAttempt.objects.filter(submission=sub)
#         total = attempts.count()
#         if total == 0:
#             continue
#         correct = attempts.filter(answer__is_correct=True).count()
#         month_key = sub.submitted_at.strftime('%Y-%m')
#         result = 'pass' if correct / total >= passing_score else 'fail'
#         monthly_results[month_key][result] += 1

#     # 3. Common mistakes
#     wrong_answers = QuizAttempt.objects.exclude(answer__is_correct=True)
#     if role == 'teacher' and user:
#         wrong_answers = wrong_answers.filter(quiz__subject__teacher=user)
#         if quiz_id:
#             wrong_answers = wrong_answers.filter(quiz_id=quiz_id)

#     common_mistakes = {}
#     for question in QuizQuestion.objects.all():
#         attempts = wrong_answers.filter(question=question)
#         total_attempts = QuizAttempt.objects.filter(question=question).count()
#         if total_attempts == 0:
#             continue

#         wrong_count = attempts.values('answer__choice').annotate(count=Count('id')).order_by('-count')
#         if wrong_count:
#             most_common = wrong_count[0]
#             correct_choice = QuizChoice.objects.filter(question=question, is_correct=True).first()
#             misconception = most_common['answer__choice'] if most_common['answer__choice'] else 'N/A'
#             common_mistakes[question.question] = {
#                 'Correct Answer': correct_choice.choice if correct_choice else 'N/A',
#                 'Common Wrong Answer': misconception,
#                 '%Wrong': round((sum([x['count'] for x in wrong_count]) / total_attempts) * 100, 2),
#                 'Misconception': misconception
#             }

#     return Response({
#         'success': True,
#         'message': 'Teacher Reports Successfully Generated!',
#         'reports': role,
#         'average_time_minutes': avg_time,
#         'monthly_results': monthly_results,
#         'common_mistakes': common_mistakes
#     })