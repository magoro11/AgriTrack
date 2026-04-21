from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Field
from .serializers import FieldSerializer
from updates.models import FieldUpdate, ActivityLog
from updates.serializers import FieldUpdateSerializer, ActivityLogSerializer


class FieldListCreateView(generics.ListCreateAPIView):
    serializer_class = FieldSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Field.objects.all().order_by('-id')
        return Field.objects.filter(assigned_agent=user).order_by('-id')

    def perform_create(self, serializer):
        if not self.request.user.is_admin:
            raise PermissionError('Only admins may create fields')
        serializer.save()

    def post(self, request, *args, **kwargs):
        if not request.user.is_admin:
            return Response({'detail': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        return super().post(request, *args, **kwargs)


class FieldDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FieldSerializer
    permission_classes = [IsAuthenticated]
    queryset = Field.objects.all()

    def get(self, request, *args, **kwargs):
        field = self.get_object()
        if request.user.is_admin or field.assigned_agent == request.user:
            return super().get(request, *args, **kwargs)
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    def patch(self, request, *args, **kwargs):
        if not request.user.is_admin:
            return Response({'detail': 'Admin access required for field changes'}, status=status.HTTP_403_FORBIDDEN)
        return super().patch(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_admin:
            return Response({'detail': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        return super().delete(request, *args, **kwargs)


class FieldUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, field_id):
        field = get_object_or_404(Field, pk=field_id)
        user = request.user
        if not (user.is_admin or field.assigned_agent == user):
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        serializer = FieldUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(field=field, updated_by=user)

        field.current_stage = serializer.validated_data['stage']
        field.save(update_fields=['current_stage'])

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ActivityLogView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, field_id):
        field = get_object_or_404(Field, pk=field_id)
        user = request.user
        if not (user.is_admin or field.assigned_agent == user):
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ActivityLogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        activity_log = serializer.save(field=field, logged_by=user)
        
        # Update field's total input cost
        if activity_log.cost:
            field.total_input_cost += activity_log.cost
            field.save(update_fields=['total_input_cost'])

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_admin:
            fields = Field.objects.all()
            updates = FieldUpdate.objects.select_related('field', 'updated_by').order_by('-created_at')[:5]
            activities = ActivityLog.objects.select_related('field', 'logged_by').order_by('-activity_date')[:10]
        else:
            fields = Field.objects.filter(assigned_agent=user)
            updates = FieldUpdate.objects.filter(field__assigned_agent=user).select_related('field', 'updated_by').order_by('-created_at')[:5]
            activities = ActivityLog.objects.filter(field__assigned_agent=user).select_related('field', 'logged_by').order_by('-activity_date')[:10]

        status_counts = {
            'Active': sum(1 for field in fields if field.status == 'Active'),
            'At Risk': sum(1 for field in fields if field.status == 'At Risk'),
            'Completed': sum(1 for field in fields if field.status == 'Completed'),
        }
        
        # Calculate aggregate metrics
        total_area = sum(float(f.area_hectares) for f in fields)
        total_expected_yield = sum(f.expected_yield_kg or 0 for f in fields)
        total_actual_yield = sum(f.actual_yield_kg or 0 for f in fields)
        total_costs = sum(float(f.total_input_cost) for f in fields)

        return Response({
            'total_fields': fields.count(),
            'status_counts': status_counts,
            'total_area_hectares': total_area,
            'total_expected_yield_kg': total_expected_yield,
            'total_actual_yield_kg': total_actual_yield,
            'total_costs': total_costs,
            'recent_updates': FieldUpdateSerializer(updates, many=True).data,
            'recent_activities': ActivityLogSerializer(activities, many=True).data,
        })

