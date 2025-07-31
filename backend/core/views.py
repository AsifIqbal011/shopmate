from rest_framework import viewsets
from core.models import Product
from core.serializers import ProductSerializer
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to ShopMate Backend")

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()  # ✅ this is required
    serializer_class = ProductSerializer
