from rest_framework import viewsets, permissions, status,generics
from .models import *
from .serializers import *
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from .utils import get_user_shop
from rest_framework.decorators import api_view,action


def home(request):
    return HttpResponse("Welcome to ShopMate Backend")

@api_view(['GET'])
def my_shop(request):
    # Get the first shop for the logged-in user
    shop = Shop.objects.filter(owner=request.user).first()
    if shop:
        serializer = ShopSerializer(shop)
        return Response(serializer.data)
    return Response(None, status=status.HTTP_200_OK)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class ShopViewSet(viewsets.ModelViewSet):
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show shops owned by the logged-in user
        return Shop.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Create shop and link it to the logged-in user
        shop = serializer.save(owner=self.request.user)
        # Create membership for this user automatically
        ShopMembership.objects.create(user=self.request.user, shop=shop, role="owner")

    @action(detail=False, methods=["get"])
    def me(self, request):
        """Custom route: GET /shops/me/ → returns the user's shop"""
        shop = Shop.objects.filter(owner=request.user).first()
        if shop:
            return Response(ShopSerializer(shop).data, status=200)
        return Response({"detail": "No shop found"}, status=404)

class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        return Product.objects.filter(shop=shop)

    def perform_create(self, serializer):
        shop = get_user_shop(self.request.user)
        serializer.save(shop=shop)

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = SaleItem.objects.all()
    serializer_class = SaleItemSerializer

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer