import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { STORAGE_KEYS } from '@/constants/apiConstants';

/**
 * Cart icon button in the header.
 * Clicking navigates directly to the /cart page.
 * Hidden when the user is not logged in.
 */
export function CartSheet() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (!isLoggedIn) return null;

    return (
        <Button
            id="header-cart-btn"
            variant="ghost"
            size="icon"
            className="relative group"
            aria-label="Go to cart"
            onClick={() => navigate('/cart')}
        >
            <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors" />
        </Button>
    );
}
