from rest_framework import viewsets, permissions, status,generics
from .models import *
from .serializers import *
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .utils import get_user_shop_and_branch
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
                "image": getattr(r.user.profile, "image_url", ""),
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
        branch_id = request.data.get("branch_id")

        try:
            membership = ShopMembership.objects.get(id=request_id, status="pending")
        except ShopMembership.DoesNotExist:
            return Response({"error": "Request not found"}, status=404)

        if membership.shop.owner != request.user:
            return Response({"error": "Not authorized"}, status=403)

        if action == "approve":
            if not branch_id:
                return Response({"error": "Branch ID required to approve"}, status=400)

            try:
                branch = Branch.objects.get(id=branch_id, shop=membership.shop)
            except Branch.DoesNotExist:
                return Response({"error": "Invalid branch for this shop"}, status=400)

            membership.status = "approved"
            membership.branch = branch
            membership.save()
            return Response({"success": f"Request approved. Employee assigned to {branch.branch_name}."})

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
        # If the user is an owner → show all employees of their shop(s)
        owner_shops = Shop.objects.filter(owner=request.user)

        if owner_shops.exists():
            employees = ShopMembership.objects.filter(
                shop__in=owner_shops, status="approved"
            ).select_related("user", "shop", "branch")
        else:
            # If the user is an employee → restrict to their branch only
            membership = ShopMembership.objects.filter(
                user=request.user, status="approved"
            ).select_related("branch", "shop").first()

            if not membership:
                return Response({"detail": "Not authorized"}, status=403)

            if membership.branch:
                employees = ShopMembership.objects.filter(
                    branch=membership.branch, status="approved"
                ).select_related("user", "shop", "branch")
            else:
                # fallback: no branch assigned → see nobody
                employees = ShopMembership.objects.none()

        # Optional filter by branch_id from query params
        branch_id = request.GET.get("branch")
        if branch_id:
            employees = employees.filter(branch_id=branch_id)

        data = [
            {
                "id": emp.id,
                "name": emp.user.username,
                "email": emp.user.email,
                "role": emp.role,
                "status": "Active" if emp.status == "approved" else "Pending",
                "branch": emp.branch.branch_name if emp.branch else "Unassigned",
                "branch_id": str(emp.branch.id) if emp.branch else None,
                "shop": emp.shop.name,
                "joinDate": emp.created_at.strftime("%d %B %Y"),
                "image": emp.user.profile.profile_pic.url if getattr(emp.user.profile, "profile_pic", None) else "",
                "sales": 0,  # placeholder for now
            }
            for emp in employees
        ]
        return Response(data)


    def delete(self, request, id):
        try:
            owner_shops = Shop.objects.filter(owner=request.user)
            membership = ShopMembership.objects.get(id=id, shop__in=owner_shops)
            membership.delete()
            return Response({"detail": "Employee removed successfully."}, status=204)
        except ShopMembership.DoesNotExist:
            return Response({"detail": "Employee not found or not authorized."}, status=404)

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
    
    def get_queryset(self):
        # only return branches of the user's shop
        user = self.request.user
        return Branch.objects.filter(shop__owner=user)

    def perform_create(self, serializer):
        shop = self.request.user.shop_set.first()  # assuming 1 shop per owner
        serializer.save(shop=shop)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def shop_branches(request):
    shop_id = request.GET.get("shop_id")
    if not shop_id:
        return Response({"error": "Shop ID is required"}, status=400)
    branches = Branch.objects.filter(shop__id=shop_id)
    data = [{"id": str(b.id), "name": b.branch_name} for b in branches]
    return Response(data)

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop, branch = get_user_shop_and_branch(self.request.user)
        if not shop:
            return Customer.objects.none()

        qs = Customer.objects.filter(shop=shop)
        if branch:
            qs = qs.filter(branch=branch)
        return qs

    def perform_create(self, serializer):
        shop, branch = get_user_shop_and_branch(self.request.user)
        serializer.save(shop=shop, branch=branch)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop, branch = get_user_shop_and_branch(self.request.user)
        if not shop:
            return Category.objects.none()

        qs = Category.objects.filter(shop=shop)
        if branch:
            qs = qs.filter(branch=branch)
        return qs

    def perform_create(self, serializer):
        shop, branch = get_user_shop_and_branch(self.request.user)
        serializer.save(shop=shop, branch=branch)

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop, branch = get_user_shop_and_branch(self.request.user)
        if not shop:
            return Product.objects.none()

        qs = Product.objects.filter(shop=shop)

        if branch:
            qs = qs.filter(branch=branch)

        return qs

    def perform_create(self, serializer):
        shop, branch = get_user_shop_and_branch(self.request.user)
        serializer.save(shop=shop, branch=branch)


class SaleViewSet(viewsets.ModelViewSet):
    serializer_class = SaleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop, branch = get_user_shop_and_branch(self.request.user)
        if not shop:
            return Sale.objects.none()

        qs = Sale.objects.filter(shop=shop)
        if branch:
            qs = qs.filter(branch=branch)
        
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param.lower())
        return qs

    def perform_create(self, serializer):
        shop, branch = get_user_shop_and_branch(self.request.user)

        with transaction.atomic():
            sale = serializer.save(shop=shop, branch=branch, employee=self.request.user)

            for item in sale.sale_items.all():
                product = item.product
                if product.quantity < item.quantity:
                     raise serializers.ValidationError(
                       {"error": f"Not enough stock for {product.name}. Available: {product.quantity}"}
                    )
                product.quantity -= item.quantity
                product.save() 
                
    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        sale = self.get_object()
        sale.status = "complete"
        sale.save()
        return Response({"status": "success", "message": "Sale confirmed"})

class SaleItemViewSet(viewsets.ModelViewSet):
    serializer_class = SaleItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop, branch = get_user_shop_and_branch(self.request.user)
        if not shop:
            return SaleItem.objects.none()

        qs = SaleItem.objects.filter(shop=shop)
        if branch:
            qs = qs.filter(branch=branch)
        return qs

    def perform_create(self, serializer):
        shop, branch = get_user_shop_and_branch(self.request.user)
        serializer.save(shop=shop, branch=branch)

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop, branch = get_user_shop_and_branch(self.request.user)
        if not shop:
            return Expense.objects.none()

        qs = Expense.objects.filter(shop=shop).order_by('-date', '-created_at')
        if branch:
            qs = qs.filter(branch=branch)
        return qs

    def perform_create(self, serializer):
        shop, branch = get_user_shop_and_branch(self.request.user)
        serializer.save(shop=shop, branch=branch)

class ReportSummary(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        shop, branch = get_user_shop_and_branch(request.user)
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

        if branch:
            sales = sales.filter(branch=branch)
            expenses = expenses.filter(branch=branch)

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
