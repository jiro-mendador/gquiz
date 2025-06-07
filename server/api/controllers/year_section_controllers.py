from rest_framework.response import Response
from rest_framework import status
from api.serializers import YearSectionSerializer
from api.models import YearSection

from rest_framework.response import Response
from django.core.paginator import Paginator
from django.db.models import Q

def get(request):
    # === GET PARAMETERS ===
    section = request.GET.get('section')
    year = request.GET.get('year')
    search = request.GET.get('search')
    page_number = request.GET.get('pageNumber', 1)
    limit = int(request.GET.get('limit', 2000))
    id = request.GET.get('id')

    # === BASE QUERYSET ===
    year_section = YearSection.objects.all()

    # === FILTER BY ID ===
    if id:
        year_section = year_section.filter(id=id)

    # === FILTER BY SECTION AND/OR YEAR ===
    if section:
        year_section = year_section.filter(section__icontains=section)
    if year:
        year_section = year_section.filter(year__icontains=year)

    # === SEARCH FILTER ===
    if search:
        year_section = year_section.filter(
            Q(section__icontains=search) |
            Q(year__icontains=search)
        )

    # === PAGINATION ===
    paginator = Paginator(year_section, limit)
    current_page = paginator.get_page(page_number)
    serializer = YearSectionSerializer(current_page, many=True)

    # === RESPONSE ===
    return Response({
        "success": True,
        "message": "Year and section retrieved successfully",
        "data": serializer.data,
        "pagination": {
            "totalItems": paginator.count,
            "totalPages": paginator.num_pages,
            "currentPage": current_page.number,
            "hasNext": current_page.has_next(),
            "hasPrevious": current_page.has_previous(),
        }
    })

    
def post(request):
  serializer = YearSectionSerializer(data=request.data)
  print(serializer)
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      year_section = YearSection.objects.get(pk=id)
   except YearSection.DoesNotExist:
      return Response({"success": False, "message": "year and section not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = YearSectionSerializer(year_section, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      year_section = YearSection.objects.get(pk=id)
      year_section.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_200_OK)
   except YearSection.DoesNotExist:
      return Response({"success": False, "message": "year and section not found"}, status=status.HTTP_404_NOT_FOUND)
