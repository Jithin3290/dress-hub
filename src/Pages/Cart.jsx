import { useContext } from 'react';
import CartContext from '../Context/CartContext';
import ShopContext from '../Context/ShopContext';

function Cart() {
  const data = useContext(ShopContext);
  const { cartItems, setCartItems } = useContext(CartContext);

  

  const cart = data.filter(product => cartItems[product.id]);
console.log(cartItems);
  const increment = (id) => {
    setCartItems(prev => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decrement = (id) => {
    setCartItems(prev => {
      if (prev[id] <= 1) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return {
        ...prev,
        [id]: prev[id] - 1,
      };
    });
  };

  const removeItem = (id) => {
    setCartItems(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const total = cart.reduce((sum, item) => {
    return sum + item.new_price * cartItems[item.id];
  }, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border p-4 mb-4 rounded">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-green-600">${item.new_price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => decrement(item.id)} className="px-2 py-1 border">-</button>
                <span>{cartItems[item.id]}</span>
                <button onClick={() => increment(item.id)} className="px-2 py-1 border">+</button>
                <button onClick={() => removeItem(item.id)} className="ml-3 text-red-500">Remove</button>
              </div>
            </div>
          ))}
          <div className="text-right mt-6 border-t pt-4">
            <h2 className="text-xl font-semibold">Total: ${total}</h2>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">Buy Now</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
