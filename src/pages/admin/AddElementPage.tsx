import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import ProductService, { type ProductCollection, type NewElementData, type Product } from '../../services/product.service';
import { useForm, type SubmitHandler } from 'react-hook-form';

type FormInputs = {
    nameDe: string;
    descriptionDe: string;
    price: number;
};

const ElementCard = ({ element }: { element: Product }) => {
    return (
        <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-md border">
            <img src={element.imageUrl} alt={element.nameDe} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
            <div className="flex-grow">
                <p className="font-semibold">{element.nameDe}</p>
                <p className="text-sm text-brand-blue font-bold">{element.price} €</p>
            </div>
            {/* Здесь в будущем можно добавить кнопки "Редактировать" / "Удалить" */}
        </div>
        
    );
};


export default function AddElementPage() {
    const { collectionId } = useParams<{ collectionId: string }>();
    
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>();

    const [collection, setCollection] = useState<ProductCollection | null>(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    const fetchCollection = useCallback(() => {
        if (collectionId) {
            ProductService.getCollectionById(Number(collectionId))
                .then(setCollection)
                .catch(err => {
                    console.error(err);
                    setMessage(t('collection_load_error'));
                    setIsError(true);
                });
        }
    }, [collectionId, t]);

    useEffect(() => {
        fetchCollection();
    }, [fetchCollection]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setUploadedImageUrl(null);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleImageUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        try {
            const response = await ProductService.uploadImage(selectedFile);
            setUploadedImageUrl(response.imageUrl);
            setMessage(t('image_upload_success'));
            setIsError(false);
        } catch {
            setMessage(t('image_upload_error'));
            setIsError(true);
        } finally {
            setIsUploading(false);
        }
    };
    
    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        if (!uploadedImageUrl || !collectionId) {
            setMessage(t('element_upload_image_first'));
            setIsError(true);
            return;
        }

        const elementData: NewElementData = {
            ...data,
            price: Number(data.price),
            imageUrl: uploadedImageUrl,
            collectionId: Number(collectionId)
        };
        
        ProductService.addElementToCollection(elementData).then(() => {
            setMessage(t('element_add_success'));
            setIsError(false);
            reset();
            setPreview(null);
            setSelectedFile(null);
            setUploadedImageUrl(null);
            fetchCollection(); 
        }).catch((err) => {
            setMessage(err.response?.data?.message || t('element_add_error'));
            setIsError(true);
        });
    };
    
    if (!collection) {
        return <div>{t('loading')}</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{t('admin_manage_collection_elements')}</h1>
                <Link to="/admin/add-collection" className="text-sm text-brand-blue hover:underline">
                    {t('back_to_collections')}
                </Link>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg mb-8 flex items-center gap-4">
                <img src={collection.imageUrl} alt={collection.nameDe} className="w-20 h-20 object-cover rounded-md"/>
                <div>
                    <h2 className="text-lg font-semibold">{t('editing_collection')}: "{collection.nameDe}"</h2>
                    <p className="text-sm text-gray-600">Slug: {collection.slug}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Левая колонка: форма добавления */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">{t('add_new_element')}</h3>
                    <div className="space-y-2 mb-6">
                        <label className="block text-sm font-medium text-gray-700">{t('element_image')}</label>
                        <div className="flex items-center gap-4">
                             <div className="w-24 h-24 border border-dashed rounded-md flex items-center justify-center bg-gray-50">
                                {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover rounded-md"/> : <span className="text-xs text-gray-500">{t('preview')}</span>}
                            </div>
                            <div>
                                <label className="cursor-pointer">
                                    <span className="inline-block text-sm font-semibold bg-blue-50 text-brand-blue hover:bg-blue-100 rounded-full py-2 px-4">{t('choose_file')}</span>
                                    <input type="file" onChange={handleFileChange} accept="image/*" className="hidden"/>
                                </label>
                                <button type="button" onClick={handleImageUpload} disabled={!selectedFile || isUploading} className="block mt-2 px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                                    {isUploading ? t('product_image_uploading') : t('upload')}
                                </button>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        
                         <div>
                            <label htmlFor="nameDe" className="block text-sm font-medium text-gray-700">{t('element_name')} (DE)</label>
                            <input id="nameDe" {...register('nameDe', { required: t('field_is_required') })} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                            {errors.nameDe && <p className="mt-1 text-sm text-red-600">{errors.nameDe.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="descriptionDe" className="block text-sm font-medium text-gray-700">{t('element_description')} (DE)</label>
                            <textarea id="descriptionDe" {...register('descriptionDe')} className="mt-1 w-full p-2 border border-gray-300 rounded-md" rows={3}></textarea>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">{t('element_price')} (€)</label>
                            <input id="price" type="number" step="0.01" {...register('price', { required: t('field_is_required'), valueAsNumber: true })} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                        </div>
                        
                        <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-brand-blue rounded-md hover:bg-blue-600">{t('add_element_to_collection')}</button>
                    </form>
                    {message && (
                        <div className={`mt-4 p-3 text-sm rounded-md ${isError ? 'text-red-800 bg-red-100' : 'text-green-800 bg-green-100'}`}>{message}</div>
                    )}
                </div>

                {/* Правая колонка: список уже добавленных элементов */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-lg font-semibold mb-4">{t('elements_in_collection')}</h3>
                     <div className="space-y-3">
                        {collection.products && collection.products.length > 0 ? (
                            collection.products.map(prod => <ElementCard key={prod.id} element={prod} />)
                        ) : (
                            <p className="text-sm text-gray-500">{t('no_elements_yet')}</p>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
}