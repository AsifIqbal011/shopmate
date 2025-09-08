from .models import ShopMembership

def get_user_shop(user):
    try:
        membership = ShopMembership.objects.get(user=user)
        return membership.shop
    except ShopMembership.DoesNotExist:
        return None
