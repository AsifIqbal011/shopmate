from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect

urlpatterns = [
    path('', lambda request: HttpResponseRedirect('/api/products/')),  # 👈 optional redirect
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),  # ✅ now this file exists
]
