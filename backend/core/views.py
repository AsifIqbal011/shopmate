from rest_framework import viewsets
from .models import *
from .serializers import *
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to ShopMate Backend")

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()  
    serializer_class = ShopSerializer

class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = SaleItem.objects.all()
    serializer_class = SaleItemSerializer

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer