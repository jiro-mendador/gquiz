from rest_framework.response import Response
from rest_framework import status
from api.serializers import QuizAttemptSerializer
from api.models import QuizAttempt

def get(request):
  quizAttempt = QuizAttempt.objects.all()
  serializer = QuizAttemptSerializer(quizAttempt, many=True)
  return Response({"success": True, "message": "All quizzes Attempt retrieved successfully", "data": serializer.data})

def post(request):
  serializer = QuizAttemptSerializer(data=request.data)
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
