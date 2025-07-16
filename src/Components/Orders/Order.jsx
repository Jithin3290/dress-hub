import React, { useContext } from 'react';
import OrderContext from '../../Context/OrderContext';
import ShopContext from '../../Context/ShopContext';
import CartContext from '../../Context/CartContext';

function Order() {
  const data = useContext(ShopContext);
  const { order } = useContext(OrderContext);
  const { cartItems } = useContext(CartContext);

  const cartOrderedItems = data.filter(item => cartItems[item.id]);

  const buyNowItems = data.filter(item => order.includes(item.id));

  const total = [
    ...cartOrderedItems.map(item => item.new_price * cartItems[item.id]),
    ...buyNowItems.map(item => item.new_price),
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>

      {cartOrderedItems.length === 0 && buyNowItems.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <>
          {cartOrderedItems.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
              {cartOrderedItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-4 mb-4 flex gap-6 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-gray-600 mt-1">Price: ₹{item.new_price}</p>
                    <p className="text-gray-600">Quantity: {cartItems[item.id]}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Total: ₹{item.new_price * cartItems[item.id]}
                    </p>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {buyNowItems.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Buy Now Items</h2>
              {buyNowItems.map(item => (
                <div
                  key={`buy-${item.id}`}
                  className="bg-white rounded-xl shadow-md p-4 mb-4 flex gap-6 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-gray-600 mt-1">Price: ₹{item.new_price}</p>
                    <p className="text-sm text-gray-500 mt-1">Quantity: 1</p>
                    <p className="text-sm text-gray-500 mt-1">Total: ₹{item.new_price}</p>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-right mt-6 border-t pt-4">
            <h2 className="text-xl font-semibold">Total Price: ₹{total}</h2>
          </div>
        </>
      )}
    </div>
  );
}

export default Order;
