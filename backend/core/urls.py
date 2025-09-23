from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    home,
    ProfileViewSet,
    ShopViewSet,
    ShopMembershipViewSet,
    BranchViewSet,
    CustomerViewSet,
    CategoryViewSet,
    ProductViewSet,
    SaleViewSet,
    SaleItemViewSet,
    InvoiceViewSet,
    ExpenseViewSet,
    ReportSummary,
    shop_search,
    join_shop,
    PendingJoinRequestsView,
    HandleJoinRequestView,
    EmployeeListView,
    check_membership_status,
    my_shop
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)
router.register(r'shops', ShopViewSet, basename='shop')
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'customers', CustomerViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'sales', SaleViewSet)
router.register(r'sale-items', SaleItemViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'expenses', ExpenseViewSet, basename='expense') 
router.register(r'shopmembership', ShopMembershipViewSet,basename='shopmembership')

urlpatterns = [
    path('', home,name='home'), 
    path('api/', include(router.urls)),
    path('api/reports/summary/', ReportSummary.as_view(), name="report-summary"),
    path("api/my-shop/", my_shop, name="my-shop"),
    path("api/shop_search/", shop_search, name="shop-search"),
    path("api/join_shop/", join_shop, name="join-shop"),
    path("api/join-requests/", PendingJoinRequestsView.as_view(), name="join-requests"),
    path("api/join-requests/<uuid:request_id>/handle/", HandleJoinRequestView.as_view(), name="handle-join-request"),
    path("api/employees/", EmployeeListView.as_view(), name="employees"),
    path("api/employees/<uuid:id>/", EmployeeListView.as_view(), name="employee-detail"),
    path("api/check-membership/",check_membership_status,name="check-membership-status"
),
]
