from rest_framework import viewsets, permissions, status,generics
from .models import *
from .serializers import *
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .utils import get_user_shop
from rest_framework.decorators import api_view,action,permission_classes
from django.db.models import Q

from collections import defaultdict
from datetime import timedelta
from django.utils.timezone import now
from django.db.models import Sum


def home(request):
    return HttpResponse("Welcome to ShopMate Backend")

@api_view(['GET'])
def my_shop(request):
    # Get the first shop for the logged-in user
    shop = Shop.objects.filter(owner=request.user).first()

    # If not owner, check if employee of any approved shop
    if not shop:
        membership = ShopMembership.objects.filter(
            user=request.user,
            status="approved"
        ).first()
        if membership:
            shop = membership.shop

    if not shop:
        return Response({"detail": "No shop found"}, status=404)

    serializer = ShopSerializer(shop)
    return Response(serializer.data)

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

class ShopMembershipViewSet(viewsets.ModelViewSet):
    serializer_class = ShopMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users only see memberships where they are the user
        return ShopMembership.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Auto-assign the current user
        serializer.save(user=self.request.user)

class PendingJoinRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        owner_shops = Shop.objects.filter(owner=request.user)
        requests = ShopMembership.objects.filter(shop__in=owner_shops, status="pending")

        data = [
            {
                "id": r.id,
                "user_name": r.user.username,
                "user_email": r.user.email,
                "full_name": getattr(r.user.profile, "full_name", ""),
                "shop": r.shop.name,
                "status": r.status,
                "created_at": r.created_at,
            }
            for r in requests
        ]
        return Response(data)


class HandleJoinRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        action = request.data.get("action")  # "approve" or "reject"

        try:
            membership = ShopMembership.objects.get(id=request_id, status="pending")
        except ShopMembership.DoesNotExist:
            return Response({"error": "Request not found"}, status=404)

        # Ensure only shop owner can act
        if membership.shop.owner != request.user:
            return Response({"error": "Not authorized"}, status=403)

        if action == "approve":
            membership.status = "approved"
            membership.save()
            return Response({"success": "Request approved and employee added."})

        elif action == "reject":
            membership.status = "rejected"
            membership.save()
            return Response({"success": "Request rejected."})

        return Response({"error": "Invalid action"}, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def shop_search(request):
    query = request.GET.get("q", "")
    shops = Shop.objects.filter(Q(name__icontains=query))[:10]  # limit results
    serializer = ShopSerializer(shops, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_shop(request):
    shop_id = request.data.get("shop")
    if not shop_id:
        return Response({"error": "Shop ID required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        shop = Shop.objects.get(id=shop_id)
    except Shop.DoesNotExist:
        return Response({"error": "Shop not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if already member
    if ShopMembership.objects.filter(user=request.user, shop=shop).exists():
        return Response(
            {"error": "You already requested or are a member of this shop"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    membership = ShopMembership.objects.create(
        user=request.user,
        shop=shop,
        role="employee",
        status="pending",
    )

    serializer = ShopMembershipSerializer(membership)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


class EmployeeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # get shops owned by this user
        owner_shops = Shop.objects.filter(owner=request.user)
        employees = ShopMembership.objects.filter(
            shop__in=owner_shops, status="approved"
        )

        data = [
            {
                "id": emp.id,
                "name": emp.user.username,
                "email": emp.user.email,
                "role": emp.role,
                "status": "Active" if emp.status == "approved" else "Pending",
                "branch": getattr(emp.shop, "name", ""),  # or your branch field
                "joinDate": getattr(emp, "created_at", ""),
                "image": getattr(emp.user.profile, "image_url", ""),
                "sales": 0,  # calculate later if needed
            }
            for emp in employees
        ]
        return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_membership_status(request):
    """
    Returns if the user is already an owner or approved employee of a shop.
    """
    # Owner check
    is_owner = Shop.objects.filter(owner=request.user).exists()

    # Approved employee check
    is_employee = ShopMembership.objects.filter(user=request.user, status="approved").exists()

    return Response({
        "can_join_shop": not (is_owner or is_employee)
    })


class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by("-created_at")
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        return Customer.objects.filter(shop=shop)

    def perform_create(self, serializer):
        shop = get_user_shop(self.request.user)
        serializer.save(shop=shop)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        return Category.objects.filter(shop=shop)

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
    queryset = Sale.objects.all().order_by("-created_at") 
    serializer_class = SaleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        return Sale.objects.filter(shop=shop)

    def perform_create(self, serializer):
        shop = get_user_shop(self.request.user)
        serializer.save(shop=shop, employee=self.request.user)


class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = SaleItem.objects.all()
    serializer_class = SaleItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop = get_user_shop(self.request.user)
        return SaleItem.objects.filter(shop=shop)

    def perform_create(self, serializer):
        shop = get_user_shop(self.request.user)
        serializer.save(shop=shop)

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

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

        sales = Sale.objects.filter(shop=shop, created_at_date_gte=start_date)
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
            chart_list.append({"month": m, "revenue": d["revenue"], "expense": d["expense"]})

        data = {
            "total_revenue": total_revenue,
            "total_expense": total_expense,
            "total_profit": total_profit,
            "chart_data": chart_list,
        }
        return Response(data, status=status.HTTP_200_OK)
