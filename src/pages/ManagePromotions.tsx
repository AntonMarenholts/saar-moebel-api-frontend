import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import AdminService, { type PromotionData } from '../services/admin.service';
import ProductService from '../services/product.service';
import type { Promotion } from '../services/promotion.service';

type FormInputs = {
    nameDe: string;
    descriptionDe: string;
    price: number;
    size: string;
    startDate: string;
    endDate: string;
};

const PROMOTIONS_PER_PAGE = 8; // 4 в ряд, 2 ряда = 8

export default function ManagePromotionsPage() {
    const { t } = useTranslation();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormInputs>();

    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
    
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    const fetchPromotions = useCallback(() => {
        AdminService.getPromotions(currentPage, PROMOTIONS_PER_PAGE)
            .then(data => {
                setPromotions(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(() => {
                setMessage(t('promotion_load_error'));
                setIsError(true);
            });
    }, [currentPage, t]);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setUploadedImageUrl(null); // Сбрасываем URL при выборе нового файла
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

    const handleEdit = (promo: Promotion) => {
        setEditingPromotion(promo);
        setValue('nameDe', promo.nameDe);
        setValue('descriptionDe', promo.descriptionDe);
        setValue('price', promo.price);
        setValue('size', promo.size || '');
        setValue('startDate', promo.startDate);
        setValue('endDate', promo.endDate);
        setUploadedImageUrl(promo.imageUrl);
        setPreview(promo.imageUrl);
        window.scrollTo(0, 0);
    };

    const handleDelete = (id: number) => {
        if (window.confirm(t('promotion_delete_confirm'))) {
            AdminService.deletePromotion(id)
                .then(() => {
                    setMessage(t('promotion_delete_success'));
                    fetchPromotions(); // Обновляем список после удаления
                })
                .catch(() => {
                    setMessage(t('promotion_delete_error'));
                    setIsError(true);
                });
        }
    };

    const clearForm = () => {
        reset();
        setEditingPromotion(null);
        setSelectedFile(null);
        setPreview(null);
        setUploadedImageUrl(null);
        setMessage('');
        setIsError(false);
    };

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        if (!uploadedImageUrl) {
            setMessage(t('product_upload_first'));
            setIsError(true);
            return;
        }

        const promotionData: PromotionData = {
            ...data,
            price: Number(data.price),
            imageUrl: uploadedImageUrl
        };

        const promise = editingPromotion
            ? AdminService.updatePromotion(editingPromotion.id, promotionData)
            : AdminService.createPromotion(promotionData);

        promise.then(() => {
            setMessage(editingPromotion ? t('promotion_update_success') : t('promotion_create_success'));
            setIsError(false);
            clearForm();
            fetchPromotions();
        }).catch(err => {
            setMessage(err.response?.data?.message || 'Error saving promotion.');
            setIsError(true);
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t('admin_manage_promotions')}</h1>
                <Link to="/admin/dashboard" className="text-sm text-brand-blue hover:underline">
                    ← {t('back_to_dashboard')}
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-lg font-semibold mb-4">{editingPromotion ? t('edit_promotion') : t('add_promotion')}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Левая колонка: тексты и цены */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="nameDe" className="block text-sm font-medium text-gray-700">{t('promotion_name')} (DE)</label>
                                <input id="nameDe" {...register("nameDe", { required: t('field_is_required') })} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                                {errors.nameDe && <p className="text-sm text-red-500 mt-1">{errors.nameDe.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="descriptionDe" className="block text-sm font-medium text-gray-700">{t('promotion_description')} (DE)</label>
                                <textarea id="descriptionDe" {...register("descriptionDe")} className="mt-1 w-full p-2 border border-gray-300 rounded-md" rows={4}></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">{t('promotion_price')} (€)</label>
                                    <input id="price" type="number" step="0.01" {...register("price", { required: t('field_is_required'), valueAsNumber: true, min: 0 })} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                                    {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">{t('promotion_size')}</label>
                                    <input id="size" {...register("size")} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                        </div>
                        {/* Правая колонка: картинка и даты */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('product_image_upload')}</label>
                                <div className="flex items-center gap-4 mt-1">
                                    <div className="w-32 h-32 border border-dashed rounded-md flex items-center justify-center bg-gray-50">
                                        {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover rounded-md"/> : <span className="text-xs text-gray-500">{t('preview')}</span>}
                                    </div>
                                    <div className="flex-grow">
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">{t('promotion_start_date')}</label>
                                    <input id="startDate" type="date" {...register("startDate", { required: t('field_is_required') })} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                                    {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">{t('promotion_end_date')}</label>
                                    <input id="endDate" type="date" {...register("endDate", { required: t('field_is_required') })} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                                    {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                        <button type="submit" className="px-4 py-2 font-bold text-white bg-brand-blue rounded-md hover:bg-blue-600">
                            {editingPromotion ? t('news_update_success') : t('add_promotion')}
                        </button>
                        {editingPromotion && (
                            <button type="button" onClick={clearForm} className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                                {t('cancel')}
                            </button>
                        )}
                    </div>
                </form>
                {message && <div className={`mt-4 p-3 text-sm rounded-md ${isError ? 'text-red-800 bg-red-100' : 'text-green-800 bg-green-100'}`}>{message}</div>}
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">{t('existing_promotions')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {promotions.map(promo => {
                        const isExpired = new Date(promo.endDate) < new Date();
                        return (
                            <div key={promo.id} className={`rounded-lg shadow-sm overflow-hidden ${isExpired ? 'bg-gray-100' : 'bg-white'}`}>
                                <img src={promo.imageUrl} alt={promo.nameDe} className="w-full h-40 object-cover"/>
                                <div className="p-4">
                                    <h3 className="font-bold">{promo.nameDe}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{promo.descriptionDe}</p>
                                    <p className="text-lg font-bold text-brand-blue mt-2">{promo.price} €</p>
                                    <div className={`mt-2 text-xs font-semibold px-2 py-1 inline-block rounded-full ${isExpired ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                        {isExpired ? t('promotion_status_expired') : `${t('promotion_status_active')} ${new Date(promo.endDate).toLocaleDateString()}`}
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={() => handleEdit(promo)} className="px-3 py-1 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600">{t('news_edit_button')}</button>
                                        <button onClick={() => handleDelete(promo.id)} className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">{t('delete')}</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0} className="px-4 py-2 text-sm font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-300">
                            {t('previous_page')}
                        </button>
                        <span>{t('page')} {currentPage + 1} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage + 1 >= totalPages} className="px-4 py-2 text-sm font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-300">
                            {t('next_page')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};