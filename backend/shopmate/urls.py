from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('auth/', include('djoser.urls')),  # user management endpoints
    path('auth/', include('djoser.urls.authtoken')),  # token login/logout

]
