from rest_framework.decorators import api_view
from .routes.user_routes import userApi, loginApi
from .routes.course_routes import courseApi
from .routes.year_section_routes import yearSectionApi
from .routes.subject_routes import subjectApi
from .routes.student_course_year_section_routes import studentCourseYearSectionApi
from .routes.quiz_routes import quizApi
from .routes.quiz_question_routes import quizQuestionApi
from .routes.quiz_question_choice_routes import quizQuestionChoiceApi 
from .routes.quiz_attempt_routes import quizAttemptApi
from .routes.quiz_submission_routes import quizSubmissionApi
# from django.views.decorators.csrf import csrf_exempt

# * FOR AI GENERATED QUESTIONS!
from openai import OpenAI
from rest_framework.response import Response
import json
import re

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def user(request, id=None):
  return userApi(request, id)

@api_view(['POST'])
# @csrf_exempt
def user_login(request):
  return loginApi(request)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def course(request, id=None):
  return courseApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def year_section(request, id=None):
  return yearSectionApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def subject(request, id=None):
  return subjectApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def studentCourseYearSection(request, id=None):
  return studentCourseYearSectionApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def quiz(request, id=None):
  return quizApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def quizQuestion(request, id=None):
  return quizQuestionApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def quizQuestionChoice(request, id=None):
  return quizQuestionChoiceApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def quizAttempt(request, id=None):
  return quizAttemptApi(request, id)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @csrf_exempt
def quizSubmission(request, id=None):
  return quizSubmissionApi(request, id)

# * FOR AI GENERATED QUESTIOSN!
# ! NOT WORKING API KEY
client = OpenAI(
    api_key="AIzaSyBp3jJOG0rj2KI-Z3tE5F4y-U-sXov7zj8",
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

@api_view(['POST'])
def generate_question(request):
    prompt = request.data.get("prompt", "Explain how AI works.")

    try:
        response = client.chat.completions.create(
            model="gemini-2.0-flash",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for making quizzes."},
                {"role": "user", "content": prompt}
            ]
        )
        # answer = response.choices[0].message.content
        
        raw_text = response.choices[0].message.content.strip()

        cleaned_text = re.sub(r"^```json|^```|```$", "", raw_text.strip(), flags=re.MULTILINE).strip()

        try:
            question_data = json.loads(cleaned_text)
            return Response({"success" : True, "message": "Generation Succeed!", "generated_answer": question_data})
        except json.JSONDecodeError as e:
            return Response({"error": "Still invalid JSON", "raw": cleaned_text, "details": str(e)}, status=400)

        
        # return Response({"success" : True, "message": "Generation Succeed!", "generated_answer": answer})
    except Exception as e:
        return Response({"error": str(e)}, status=500)