from rest_framework import serializers
from .models import FieldUpdate, ActivityLog


class FieldUpdateSerializer(serializers.ModelSerializer):
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = FieldUpdate
        fields = ['id', 'field', 'updated_by', 'stage', 'notes', 'created_at']
        read_only_fields = ['updated_by', 'created_at']


class ActivityLogSerializer(serializers.ModelSerializer):
    logged_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ActivityLog
        fields = ['id', 'field', 'activity_type', 'description', 'quantity', 'cost', 'logged_by', 'logged_at', 'activity_date']
        read_only_fields = ['logged_by', 'logged_at']
