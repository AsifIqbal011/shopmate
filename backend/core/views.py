from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from django.db import transaction
from datetime import timedelta
from collections import defaultdict
from django.db.models import Sum
from django.utils.timezone import now
from .models import *
from .serializers import *
from .utils import get_user_shop

# ---------------- Home ----------------
def home(request):
    return HttpResponse("Welcome to ShopMate Backend")

# ---------------- Profile ----------------
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

# ---------------- Shop ----------------
class ShopViewSet(viewsets.ModelViewSet):
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Shop.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        shop = serializer.save(owner=self.request.user)
        ShopMembership.objects.create(user=self.request.user, shop=shop, role="owner")

# ---------------- Branch ----------------
class BranchViewSet(viewsets.ModelViewSet):
    serializer_class = BranchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        return Branch.objects.filter(shop=shop)

# ---------------- Customer ----------------
class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        return Customer.objects.filter(shop=shop)

# ---------------- Category ----------------
class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        return Category.objects.filter(shop=shop).order_by("name")

# ---------------- Product ----------------
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        return Product.objects.filter(shop=shop).order_by("-created_at")

    def perform_create(self, serializer):
        shop = get_user_shop(self.request.user)
        serializer.save(shop=shop)

# ---------------- Sale ----------------
# views.py
class SaleViewSet(viewsets.ModelViewSet):
    serializer_class = SaleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        return Sale.objects.filter(shop=shop).order_by("-created_at")

    def perform_create(self, serializer):
        shop = get_user_shop(self.request.user)
        serializer.save(shop=shop)


# ---------------- SaleItem ----------------
class SaleItemViewSet(viewsets.ModelViewSet):
    serializer_class = SaleItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        return SaleItem.objects.filter(sale__shop=shop)

# ---------------- Invoice ----------------
class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        return Invoice.objects.filter(sale__shop=shop)

# ---------------- Expense ----------------
class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        if not shop:
            return Expense.objects.none()
        return Expense.objects.filter(shop=shop).order_by('-date', '-created_at')

    def perform_create(self, serializer):
        shop = get_user_shop(self.request.user)
        serializer.save(shop=shop)

# ---------------- Report Summary ----------------
class ReportSummary(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        shop = get_user_shop(request.user)
        if not shop:
            return Response({"detail": "No shop found"}, status=status.HTTP_404_NOT_FOUND)

        timeframe = request.query_params.get("timeframe", "30days")
        if timeframe == "7days":
            start_date = now().date() - timedelta(days=7)
        elif timeframe == "3months":
            start_date = now().date() - timedelta(days=90)
        elif timeframe == "12months":
            start_date = now().date() - timedelta(days=365)
        else:
            start_date = now().date() - timedelta(days=30)

        sales = Sale.objects.filter(shop=shop, created_at__date__gte=start_date)
        expenses = Expense.objects.filter(shop=shop, date__gte=start_date)

        total_revenue = sales.aggregate(total=Sum("total_amount"))["total"] or 0
        total_profit = sales.aggregate(total=Sum("profit_amount"))["total"] or 0
        total_expense = expenses.aggregate(total=Sum("amount"))["total"] or 0

        chart_map = defaultdict(lambda: {"revenue": 0, "expense": 0})
        month_order = []

        for s in sales:
            m = s.created_at.strftime("%b")
            if m not in chart_map:
                month_order.append(m)
            chart_map[m]["revenue"] += float(s.total_amount)

        for e in expenses:
            m = e.date.strftime("%b")
            if m not in chart_map:
                month_order.append(m)
            chart_map[m]["expense"] += float(e.amount)

        chart_list = []
        seen = set()
        for m in month_order:
            if m in seen:
                continue
            seen.add(m)
            d = chart_map[m]
            chart_list.append({
                "month": m,
                "revenue": d["revenue"],
                "expense": d["expense"]
            })

        data = {
            "total_revenue": total_revenue,
            "total_expense": total_expense,
            "total_profit": total_profit,
            "chart_data": chart_list,
        }
        return Response(data, status=status.HTTP_200_OK)
