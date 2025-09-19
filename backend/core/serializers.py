from django.db import transaction
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import *

User = get_user_model()

class CustomUserCreateSerializer(UserCreateSerializer):
    full_name = serializers.CharField(required=True, write_only=True)
    phone = serializers.CharField(required=True, write_only=True)
    profile_pic = serializers.ImageField(required=False, write_only=True)

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'password', 'email', 'full_name', 'phone', 'profile_pic')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        # Store profile data temporarily
        self.profile_data = {
            'full_name': attrs.pop('full_name'),
            'phone': attrs.pop('phone'),
            'profile_pic': attrs.pop('profile_pic', None)
        }
        return super().validate(attrs)

    @transaction.atomic
    def create(self, validated_data):
        # Create the user
        user = super().create(validated_data)
        # Create profile
        Profile.objects.create(user=user, **self.profile_data)
        return user


class CustomUserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source='profile.phone', read_only=True)
    full_name = serializers.CharField(source='profile.full_name', read_only=True)
    profile_pic = serializers.ImageField(source='profile.profile_pic', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'phone', 'profile_pic')
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class ShopSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')  # read-only, automatically set

    class Meta:
        model = Shop
        fields = ['id', 'name', 'address', 'phone', 'shop_logo', 'email', 'owner']
        read_only_fields = ['id', 'owner']   

class ShopMembershipSerializer(serializers.ModelSerializer):
    shop = ShopSerializer(read_only=True)

    class Meta:
        model = ShopMembership
        fields = '__all__'
        read_only_fields = ['user', 'shop']

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    category = CategorySerializer(read_only=True)   # Show full category details
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['shop'] 

class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = '__all__'

class SaleSerializer(serializers.ModelSerializer):
    sale_items = SaleItemSerializer(many=True, read_only=True)

    class Meta:
        model = Sale
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['id', 'shop', 'created_at'] 
