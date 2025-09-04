import type { Product } from "../../types";
import { Link } from "react-router-dom";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  // Форматируем цену в европейском стиле (например, 1.250,00 €)
  const formattedPrice = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  return (
    <div className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 bg-white">
          <h3 className="font-semibold text-gray-800 truncate">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-brand-blue mt-1">
            {formattedPrice}
          </p>
        </div>
      </Link>
    </div>
  );
}

