from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)
router.register(r'shops', ShopViewSet, basename='shop')
router.register(r'branches', BranchViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'sales', SaleViewSet)
router.register(r'sale-items', SaleItemViewSet)
router.register(r'invoices', InvoiceViewSet)

urlpatterns = [
    path('', home), 
    path('', include(router.urls)),
]
