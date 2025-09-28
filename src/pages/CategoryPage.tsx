import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ProductService, { type ProductCollection } from "../services/product.service";
import AuthService from "../services/auth.service"; 
import { useTranslation } from "react-i18next";

const getTranslated = (
    item: ProductCollection, 
    field: 'name' | 'description',
    lang: string
) => {
    const key = `${field}${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof ProductCollection;
    const fallbackKey = `${field}De` as keyof ProductCollection;
    if (key in item && item[key]) {
        return item[key] as string;
    }
    return item[fallbackKey] as string;
}

const CollectionCard = ({ collection, onDelete }: { collection: ProductCollection, onDelete: (id: number) => void }) => {
    const { t, i18n } = useTranslation();
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser?.roles.includes('ROLE_ADMIN');
    const navigate = useNavigate();

    const collectionName = getTranslated(collection, 'name', i18n.language);
    const collectionDescription = getTranslated(collection, 'description', i18n.language);
    const startingPrice = collection.products.reduce((min, p) => p.price < min ? p.price : min, collection.products[0]?.price || 0);
    
    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault(); 
        if (window.confirm(`${t('confirm_delete_collection')} "${collectionName}"?`)) {
            ProductService.deleteCollection(collection.id)
                .then(() => onDelete(collection.id))
                .catch(err => console.error("Ошибка удаления коллекции", err));
        }
    };

    return (
        <Link 
            to={`/collection/${collection.slug}`}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 block"
        >
            <div className="aspect-video overflow-hidden">
                <img src={collection.imageUrl} alt={collectionName} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            </div>
            
            
            {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
                    <button 
                        onClick={(e) => { e.preventDefault(); navigate(`/admin/collection/${collection.id}/edit`); }} 
                        className="p-2 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={handleDelete} className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            )}
            

            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 truncate">{collectionName}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2 h-10">{collectionDescription}</p>
                <div className="mt-4 flex justify-between items-center">
                    {startingPrice > 0 && (
                        <div className="text-lg font-semibold text-gray-700">
                            {t('price_from')} 
                            <span className="text-2xl font-bold text-brand-blue ml-1">{startingPrice.toFixed(2)} €</span>
                            <span className="text-sm text-gray-500"> /{t('price_per_item')}</span>
                        </div>
                    )}
                    <span className="px-4 py-2 text-sm font-bold text-white bg-brand-blue rounded-full group-hover:bg-blue-700 transition-colors">
                        {t('view_collection')}
                    </span>
                </div>
            </div>
        </Link>
    );
};


const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(); 
  
  const fetchCollections = () => {
      if (slug) {
        setLoading(true);
        ProductService.getCollectionsByCategory(slug)
            .then(setCollections)
            .catch((error) => console.error("Error loading collection:", error))
            .finally(() => setLoading(false));
      }
  };

  useEffect(() => {
    fetchCollections();
  }, [slug]);
  
  const handleCollectionDelete = (deletedId: number) => {
      setCollections(prev => prev.filter(c => c.id !== deletedId));
  };

  if (loading) {
    return <div className="text-center p-8">{t("loading")}</div>; 
  }

  return (
    <div>
        
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-brand-blue hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            {t('back_to_all_categories')}
        </Link>
        
      <h1 className="text-3xl font-bold capitalize mb-8">
        {t(slug || "", { defaultValue: slug?.replace(/_/g, " ") })}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.length > 0 ? (
          collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} onDelete={handleCollectionDelete} />
          ))
        ) : (
          <p>{t("no_collections_in_category")}</p> 
        )}
      </div>
    </div>
  );
};

export default CategoryPage;