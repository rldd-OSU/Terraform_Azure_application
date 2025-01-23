from django.urls import path
from .views import ResourceListView, CreateResources

urlpatterns = [
    path('create_resources/', CreateResources.as_view(), name='create_resources'),
    path('get_all_resources/', ResourceListView.as_view(), name='get_all_resources'),
]
