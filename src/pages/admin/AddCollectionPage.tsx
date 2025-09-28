import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import ProductService, { type Category, type NewCollectionData } from '../../services/product.service';
import { useForm, type SubmitHandler } from 'react-hook-form';

type FormInputs = {
    nameDe: string;
    descriptionDe: string;
    slug: string;
    categoryId: number;
};

export default function AddCollectionPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>();
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    useEffect(() => {
        ProductService.getCategories().then(setCategories).catch(err => console.error(err));
    }, []);

    
    const sortedCategories = useMemo(() => {
        return [...categories].sort((a, b) => a.nameDe.localeCompare(b.nameDe));
    }, [categories]);

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
        setMessage('');
        setIsError(false);
        try {
            const response = await ProductService.uploadImage(selectedFile);
            setUploadedImageUrl(response.imageUrl);
            setMessage(t('image_upload_success'));
        } catch {
            setMessage(t('image_upload_error'));
            setIsError(true);
        } finally {
            setIsUploading(false);
        }
    };
    
    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        if (!uploadedImageUrl) {
            setMessage(t('collection_upload_image_first'));
            setIsError(true);
            return;
        }

        const collectionData: NewCollectionData = {
            ...data,
            categoryId: Number(data.categoryId),
            imageUrl: uploadedImageUrl
        };
        
        ProductService.createCollection(collectionData).then((newCollection) => {
            setMessage(t('collection_create_success'));
            setIsError(false);
            reset();
            setPreview(null);
            setSelectedFile(null);
            setUploadedImageUrl(null);
            
            
            setTimeout(() => {
                navigate(`/admin/collection/${newCollection.id}/add-element`);
            }, 2000);
        }).catch((err) => {
            setMessage(err.response?.data?.message || t('collection_create_error'));
            setIsError(true);
        });
    };
    
    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t('admin_add_collection')}</h1>
                <Link to="/admin/dashboard" className="text-sm text-brand-blue hover:underline">
                    {t('back_to_panel')}
                </Link>
            </div>
            
            <div className="space-y-2 mb-6">
                 <label className="block text-sm font-medium text-gray-700">{t('collection_image')}</label>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-32 border border-dashed rounded-md flex items-center justify-center bg-gray-50">
                        {preview ? <img src={preview} alt={t('preview')} className="w-full h-full object-cover rounded-md"/> : <span>{t('preview')}</span>}
                    </div>
                    <div>
                        <label className="cursor-pointer">
                            <span className="inline-block text-sm font-semibold bg-blue-50 text-brand-blue hover:bg-blue-100 rounded-full py-2 px-4">
                                {t('choose_file')}
                            </span>
                            <input type="file" onChange={handleFileChange} accept="image/*" className="hidden"/>
                        </label>
                        <span className="ml-3 text-sm text-gray-500">
                            {selectedFile ? selectedFile.name : t('no_file_chosen')}
                        </span>
                        <button type="button" onClick={handleImageUpload} disabled={!selectedFile || isUploading} className="block mt-2 px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                            {isUploading ? t('product_image_uploading') : t('upload')}
                        </button>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="nameDe" className="block text-sm font-medium text-gray-700">{t('collection_name')} (DE)</label>
                    <input id="nameDe" {...register('nameDe', { required: t('field_is_required') })} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    {errors.nameDe && <p className="mt-1 text-sm text-red-600">{errors.nameDe.message}</p>}
                </div>

                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">{t('collection_slug')}</label>
                    <input id="slug" {...register('slug', { required: t('field_is_required') })} placeholder="naprimer, kabinet-graphite" className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
                </div>

                <div>
                    <label htmlFor="descriptionDe" className="block text-sm font-medium text-gray-700">{t('collection_description')} (DE)</label>
                    <textarea id="descriptionDe" {...register('descriptionDe')} className="mt-1 w-full p-2 border border-gray-300 rounded-md" rows={4}></textarea>
                </div>

                 <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">{t('product_category')}</label>
                    <select id="categoryId" {...register('categoryId', { required: t('field_is_required') })} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                        <option value="">{t('select_category')}</option>
                        {sortedCategories.map(category => (
                            <option key={category.id} value={category.id}>{category.nameDe}</option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
                </div>

                <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-brand-blue rounded-md hover:bg-blue-600">
                    {t('create_collection_and_add_elements')}
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