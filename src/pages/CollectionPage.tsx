import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ProductService, { type Product, type ProductCollection } from "../services/product.service";
import { useTranslation } from "react-i18next";


const getTranslatedField = (
    item: Product | ProductCollection,
    field: 'name' | 'description',
    lang: string
): string => {
    const fallback = (item[`${field}De` as keyof typeof item] || '') as string;
    
    switch (lang) {
        case 'en':
            return (item[`${field}En` as keyof typeof item] as string) || fallback;
        case 'fr':
            return (item[`${field}Fr` as keyof typeof item] as string) || fallback;
        case 'ru':
            return (item[`${field}Ru` as keyof typeof item] as string) || fallback;
        case 'uk':
            return (item[`${field}Uk` as keyof typeof item] as string) || fallback;
        default:
            return fallback;
    }
};

const ElementRow = ({ product, isSelected, onToggle }: { product: Product, isSelected: boolean, onToggle: () => void }) => {
    const { i18n } = useTranslation();
    const productName = getTranslatedField(product, "name", i18n.language);
    const productDescription = getTranslatedField(product, "description", i18n.language);

    return (
        <div 
            className={`flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-blue-50 border-brand-blue ring-2 ring-brand-blue' : 'bg-white hover:border-gray-300'}`}
            onClick={onToggle}
        >
            <img src={product.imageUrl} alt={productName} className="w-full sm:w-24 h-24 object-cover rounded-md flex-shrink-0" />
            <div className="flex-grow text-center sm:text-left">
                <h3 className="font-semibold text-lg">{productName}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{productDescription}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
                <p className="text-xl font-bold text-gray-800">{product.price.toFixed(2)} €</p>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-brand-blue border-brand-blue' : 'border-gray-300'}`}>
                    {isSelected && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
            </div>
        </div>
    );
};


export default function CollectionPage() {
    // --- ИЗМЕНЕНИЕ 1: Получаем slug вместо id ---
    const { slug } = useParams<{ slug: string }>();
    const { t, i18n } = useTranslation();
    const [collection, setCollection] = useState<ProductCollection | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // --- ИЗМЕНЕНИЕ 2: Используем slug и новый метод сервиса ---
        if (slug) {
            setLoading(true);
            ProductService.getCollectionBySlug(slug) // Используем новый метод
                .then(data => {
                    setCollection(data);
                    const allProductIds = new Set(data.products.map(p => p.id));
                    setSelectedProducts(allProductIds);
                })
                .catch(error => console.error("Error loading collection:", error))
                .finally(() => setLoading(false));
        }
    }, [slug]); // Зависимость теперь slug

    const handleToggleProduct = (productId: number) => {
        const newSelection = new Set(selectedProducts);
        if (newSelection.has(productId)) {
            newSelection.delete(productId);
        } else {
            newSelection.add(productId);
        }
        setSelectedProducts(newSelection);
    };

    const totalPrice = useMemo(() => {
        return collection?.products
            .filter(p => selectedProducts.has(p.id))
            .reduce((sum, p) => sum + p.price, 0) || 0;
    }, [collection, selectedProducts]);

    if (loading || !collection) {
        return <div className="text-center p-8">{t("loading")}</div>;
    }

    const collectionName = getTranslatedField(collection, "name", i18n.language);
    const collectionDescription = getTranslatedField(collection, "description", i18n.language);

    return (
        <div className="max-w-6xl mx-auto">
            <Link to={`/category/${collection.category.slug}`} className="mb-6 inline-flex items-center gap-2 text-sm text-brand-blue hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                {t('back_to_category')}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <img src={collection.imageUrl} alt={collectionName} className="w-full object-cover rounded-lg shadow-lg aspect-square" />
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-gray-800">{collectionName}</h1>
                        <p className="text-gray-600 mt-2">{collectionDescription}</p>
                    </div>
                     <div className="sticky top-24 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-600">{t('total_price')}</h2>
                        <p className="text-5xl font-extrabold text-brand-blue my-2">{totalPrice.toFixed(2)} €</p>
                        <button className="w-full mt-4 py-3 px-6 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300 text-lg">
                            {t('add_to_cart')} ({selectedProducts.size})
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                     <h2 className="text-2xl font-bold text-gray-800">{t('configure_your_set')}</h2>
                    {collection.products.map(product => (
                        <ElementRow 
                            key={product.id}
                            product={product}
                            isSelected={selectedProducts.has(product.id)}
                            onToggle={() => handleToggleProduct(product.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}