from django.urls import path
from .views import FieldListCreateView, FieldDetailView, FieldUpdateView, ActivityLogView, DashboardView

urlpatterns = [
    path('fields/', FieldListCreateView.as_view(), name='field-list-create'),
    path('fields/<int:pk>/', FieldDetailView.as_view(), name='field-detail'),
    path('fields/<int:field_id>/update/', FieldUpdateView.as_view(), name='field-update'),
    path('fields/<int:field_id>/activity/', ActivityLogView.as_view(), name='activity-log'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
