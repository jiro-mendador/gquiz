from rest_framework.response import Response
from rest_framework import status
from api.serializers import QuizChoiceSerializer
from api.models import QuizChoice

def get(request):
  # * FILTER
  question = request.GET.get('question')
  if question:
    quizChoices = QuizChoice.objects.filter(question=question)
  else:
    quizChoices = QuizChoice.objects.all()
  
  serializer = QuizChoiceSerializer(quizChoices, many=True)
  return Response({"success": True, "message": "All quiz questions choices retrieved successfully", "data": serializer.data})

def post(request):
  is_many = isinstance(request.data, list)  # Check if the request contains a list
  
  serializer = QuizChoiceSerializer(data=request.data, many=is_many)
  
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      quizChoice = QuizChoice.objects.get(pk=id)
   except QuizChoice.DoesNotExist:
      return Response({"success": False, "message": "Quiz Question Choice not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = QuizChoiceSerializer(quizChoice, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      quizChoice = QuizChoice.objects.get(pk=id)
      quizChoice.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
   except QuizChoice.DoesNotExist:
      return Response({"success": False, "message": "Quiz question Choice not found"}, status=status.HTTP_404_NOT_FOUND)
