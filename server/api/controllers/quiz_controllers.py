from rest_framework.response import Response
from rest_framework import status
from api.serializers import QuizSerializer
from api.models import Quiz

def get(request):
  quizzes = Quiz.objects.all()
  serializer = QuizSerializer(quizzes, many=True)
  return Response({"success": True, "message": "All quizzes retrieved successfully", "data": serializer.data})

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
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
   except Quiz.DoesNotExist:
      return Response({"success": False, "message": "quiz not found"}, status=status.HTTP_404_NOT_FOUND)
