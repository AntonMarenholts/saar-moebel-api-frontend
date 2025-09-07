import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { Category } from '../services/product.service';
import ProductService from '../services/product.service';
import AuthService from '../services/auth.service'; // <-- 1. Импортируем AuthService
import { useForm, type SubmitHandler } from 'react-hook-form';

type FormInputs = {
    name: string;
    description: string;
    price: number;
    categoryId: number;
};

export default function AddProductPage() {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Состояния для загрузки файла
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    // <-- 2. Проверяем, является ли пользователь админом
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser?.roles.includes('ROLE_ADMIN');

    // Загружаем категории
    useEffect(() => {
        ProductService.getCategories().then(setCategories).catch(err => console.error(err));
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setUploadedImageUrl(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setMessage('');
        setIsError(false);

        try {
            // <-- 3. Убедимся, что токен администратора передается
            const response = await ProductService.uploadImage(selectedFile);
            setUploadedImageUrl(response.imageUrl);
            setMessage("Изображение успешно загружено!");
        } catch {
            setMessage("Ошибка при загрузке изображения.");
            setIsError(true);
        } finally {
            setIsUploading(false);
        }
    };
    
    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        if (!uploadedImageUrl) {
            setMessage(t('product_upload_first'));
            setIsError(true);
            return;
        }

        const productData = {
            ...data,
            price: parseFloat(String(data.price)),
            categoryId: parseInt(String(data.categoryId), 10),
            imageUrl: uploadedImageUrl
        };
        
        ProductService.createProduct(productData).then(() => {
            setMessage(t('product_add_success'));
            setIsError(false);
        }).catch(() => {
            setMessage(t('product_add_error'));
            setIsError(true);
        });
    };
    
    // <-- 4. Если пользователь не админ, не рендерим страницу
    if (!isAdmin) {
        return (
            <div className="text-red-500 text-center p-8">
                <p>{t('unauthorized_access')}</p>
                <Link to="/" className="text-brand-blue hover:underline mt-4 inline-block">
                    {t('back_to_home')}
                </Link>
            </div>
        );
    }


    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t('admin_add_product')}</h1>
                <Link to="/admin/dashboard" className="text-sm text-brand-blue hover:underline">
                    ← Назад в панель
                </Link>
            </div>
            
            <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-gray-700">{t('product_image_upload')}</label>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-32 border border-dashed rounded-md flex items-center justify-center">
                        {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover rounded-md"/> : <span>Предпросмотр</span>}
                    </div>
                    <div className="flex-grow">
                        <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100"/>
                        <button type="button" onClick={handleImageUpload} disabled={!selectedFile || isUploading} className="mt-2 px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                            {isUploading ? t('product_image_uploading') : "Загрузить"}
                        </button>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('product_name')}</label>
                    <input type="text" id="name" {...register('name', { required: t('field_is_required') })} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('product_description')}</label>
                    <textarea id="description" {...register('description')} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">{t('product_price')} (€)</label>
                    <input type="number" step="0.01" id="price" {...register('price', { required: t('field_is_required'), valueAsNumber: true })} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">{t('product_category')}</label>
                    <select id="categoryId" {...register('categoryId', { required: t('field_is_required') })} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                        <option value="">{t('select_category')}</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
                </div>

                <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-brand-blue rounded-md hover:bg-blue-600">
                    {t('admin_add_product')}
                </button>
            </form>

            {message && (
                <div className={`mt-4 p-3 text-sm rounded-md ${isError ? 'text-red-800 bg-red-100' : 'text-green-800 bg-green-100'}`}>
                    {message}
                </div>
            )}
        </div>
    );
}