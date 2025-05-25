from rest_framework.response import Response
from rest_framework import status
from api.serializers import QuizSubmissionSerializer
from api.models import QuizSubmission

def get(request):
  quizSubmissions = QuizSubmission.objects.all()
  serializer = QuizSubmissionSerializer(quizSubmissions, many=True)
  return Response({"success": True, "message": "All quiz submissions retrieved successfully", "data": serializer.data})

def post(request):
  serializer = QuizSubmissionSerializer(data=request.data)
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
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
   except QuizSubmission.DoesNotExist:
      return Response({"success": False, "message": "quiz Submission not found"}, status=status.HTTP_404_NOT_FOUND)
