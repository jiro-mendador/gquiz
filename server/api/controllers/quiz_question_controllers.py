from rest_framework.response import Response
from rest_framework import status
from api.serializers import QuizQuestionSerializer
from api.models import QuizQuestion

def get(request):
  # * FILTER
  quiz = request.GET.get('quiz')
  if quiz:
    quizQuestions = QuizQuestion.objects.filter(quiz=quiz)
  else:
    quizQuestions = QuizQuestion.objects.all()
  
  serializer = QuizQuestionSerializer(quizQuestions, many=True)
  return Response({"success": True, "message": "All quiz questions retrieved successfully", "data": serializer.data})

def post(request):
  is_many = isinstance(request.data, list)  # Check if the request contains a list
  
  serializer = QuizQuestionSerializer(data=request.data, many=is_many)
  
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      quizQuestion = QuizQuestion.objects.get(pk=id)
   except QuizQuestion.DoesNotExist:
      return Response({"success": False, "message": "Quiz Question not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = QuizQuestionSerializer(quizQuestion, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      quizQuestion = QuizQuestion.objects.get(pk=id)
      quizQuestion.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
   except QuizQuestion.DoesNotExist:
      return Response({"success": False, "message": "Quiz question not found"}, status=status.HTTP_404_NOT_FOUND)
