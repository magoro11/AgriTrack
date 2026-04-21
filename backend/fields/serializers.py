from rest_framework import serializers
from .models import Field
from updates.serializers import FieldUpdateSerializer, ActivityLogSerializer
from users.models import User


class FieldSerializer(serializers.ModelSerializer):
    assigned_agent = serializers.StringRelatedField(read_only=True)
    assigned_agent_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.ROLE_AGENT),
        source='assigned_agent',
        write_only=True,
        required=False,
    )
    status = serializers.CharField(source='status', read_only=True)
    days_since_planting = serializers.IntegerField(source='days_since_planting', read_only=True)
    yield_efficiency = serializers.FloatField(source='yield_efficiency', read_only=True)
    cost_per_hectare = serializers.FloatField(source='cost_per_hectare', read_only=True)
    recent_updates = FieldUpdateSerializer(source='updates', many=True, read_only=True)
    activity_logs = ActivityLogSerializer(source='activity_logs', many=True, read_only=True)

    class Meta:
        model = Field
        fields = [
            'id', 'name', 'crop_type', 'planting_date', 'expected_harvest_date', 'current_stage',
            'assigned_agent', 'assigned_agent_id', 'status', 'area_hectares', 'location',
            'soil_pH', 'soil_nitrogen_ppm', 'soil_phosphorus_ppm', 'soil_potassium_ppm',
            'avg_rainfall_mm', 'avg_temperature_celsius', 'total_input_cost', 'expected_yield_kg',
            'actual_yield_kg', 'days_since_planting', 'yield_efficiency', 'cost_per_hectare',
            'recent_updates', 'activity_logs', 'created_at', 'updated_at'
        ]
