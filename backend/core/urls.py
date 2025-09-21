# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    home,
    ProfileViewSet,
    ShopViewSet,
    BranchViewSet,
    CustomerViewSet,
    CategoryViewSet,
    ProductViewSet,
    SaleViewSet,
    SaleItemViewSet,
    InvoiceViewSet,
    ExpenseViewSet,
    ReportSummary
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'shops', ShopViewSet, basename='shop')
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'sales', SaleViewSet, basename='sale')
router.register(r'sale-items', SaleItemViewSet, basename='saleitem')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'expenses', ExpenseViewSet, basename='expense')

urlpatterns = [
    path('', home, name='home'),
    path('api/', include(router.urls)),
    path('reports/summary/', ReportSummary.as_view(), name="report-summary"),
]
