import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import AdminService, { type NewsArticle, type NewsArticleData } from '../services/admin.service';
import ProductService from '../services/product.service';

type FormInputs = {
    titleDe: string;
    contentDe: string;
    titleEn: string;
    contentEn: string;
    titleFr: string;
    contentFr: string;
    titleRu: string;
    contentRu: string;
    titleUk: string;
    contentUk: string;
};

const NEWS_PER_PAGE = 6;

export default function ManageNewsPage() {
    const { t } = useTranslation();
    const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<FormInputs>();

    const [newsList, setNewsList] = useState<NewsArticle[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isTranslated, setIsTranslated] = useState(false);

    const fetchNews = useCallback(() => {
        AdminService.getNews(currentPage, NEWS_PER_PAGE)
            .then(data => {
                setNewsList(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(() => {
                setMessage(t('news_load_error'));
                setIsError(true);
            });
    }, [t, currentPage]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

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

    const handleEdit = (article: NewsArticle) => {
        setEditingArticle(article);
        setValue('titleDe', article.titleDe);
        setValue('contentDe', article.contentDe);
        setValue('titleEn', article.titleEn || '');
        setValue('contentEn', article.contentEn || '');
        setValue('titleFr', article.titleFr || '');
        setValue('contentFr', article.contentFr || '');
        setValue('titleRu', article.titleRu || '');
        setValue('contentRu', article.contentRu || '');
        setValue('titleUk', article.titleUk || '');
        setValue('contentUk', article.contentUk || '');
        setUploadedImageUrl(article.imageUrl);
        setPreview(article.imageUrl);
        setIsTranslated(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = (id: number) => {
        if (window.confirm(t('news_delete_confirm'))) {
            AdminService.deleteNews(id)
                .then(() => {
                    setMessage(t('news_delete_success'));
                    setIsError(false);
                    fetchNews();
                })
                .catch(() => {
                    setMessage(t('news_delete_error'));
                    setIsError(true);
                });
        }
    };

    const clearForm = () => {
        reset();
        setEditingArticle(null);
        setSelectedFile(null);
        setPreview(null);
        setUploadedImageUrl(null);
        setMessage('');
        setIsTranslated(false);
    };
    
    const handleTranslate = async () => {
        setIsTranslating(true);
        setMessage('');
        setIsError(false);
        const titleDe = getValues("titleDe");
        const contentDe = getValues("contentDe");

        if (!titleDe || !contentDe) {
            setMessage(t('news_add_error_german'));
            setIsError(true);
            setIsTranslating(false);
            return;
        }

        try {
            const translations = await AdminService.translateNewsContent(titleDe, contentDe);
            setValue("titleEn", translations.titleEn);
            setValue("contentEn", translations.contentEn);
            setValue("titleFr", translations.titleFr);
            setValue("contentFr", translations.contentFr);
            setValue("titleRu", translations.titleRu);
            setValue("contentRu", translations.contentRu);
            setValue("titleUk", translations.titleUk);
            setValue("contentUk", translations.contentUk);
            setMessage(t('news_translate_success'));
            setIsTranslated(true);
        } catch (error) {
            console.error("Translation error:", error);
            setMessage(t('news_translate_error'));
            setIsError(true);
        } finally {
            setIsTranslating(false);
        }
    };


    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        if (!uploadedImageUrl) {
            setMessage(t('product_upload_first'));
            setIsError(true);
            return;
        }

        if (!isTranslated && !editingArticle) {
            setMessage("Пожалуйста, сначала выполните перевод.");
            setIsError(true);
            return;
        }

        const newsData: NewsArticleData = { ...data, imageUrl: uploadedImageUrl };

        try {
            if (editingArticle) {
                await AdminService.updateNews(editingArticle.id, newsData);
                setMessage(t('news_update_success'));
            } else {
                await AdminService.createNews(newsData);
                setMessage(t('news_create_success'));
            }
            setIsError(false);
            clearForm();
            fetchNews();
        } catch {
            setMessage(t('news_update_error_generic'));
            setIsError(true);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t('admin_manage_news')}</h1>
                <Link to="/admin/dashboard" className="text-sm text-brand-blue hover:underline">
                    ← {t('back_to_dashboard')}
                </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                 <h2 className="text-lg font-semibold mb-4">
                     {editingArticle ? t('news_edit') : t('add_news_article')}
                 </h2>
                 <div className="space-y-2 mb-6">
                    <label className="block text-sm font-medium text-gray-700">{t('product_image_upload')}</label>
                    <div className="flex items-center gap-4">
                        <div className="w-32 h-32 border border-dashed rounded-md flex items-center justify-center bg-gray-50">
                            {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover rounded-md"/> : <span className="text-xs text-gray-500">{t('preview')}</span>}
                        </div>
                        <div>
                            <label className="cursor-pointer">
                                <span className="inline-block text-sm font-semibold bg-blue-50 text-brand-blue hover:bg-blue-100 rounded-full py-2 px-4">
                                    {t('choose_file')}
                                </span>
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    className="hidden"
                                />
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 divide-y divide-gray-200">
                    <div className="pt-4">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-md font-semibold text-gray-700">Deutsch (Original)</h3>
                             <button 
                                type="button" 
                                onClick={handleTranslate} 
                                disabled={isTranslating}
                                className="px-4 py-1 text-sm font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                             >
                                {isTranslating ? t('news_translating') : t('translate')}
                             </button>
                        </div>
                        <div>
                            <label htmlFor="titleDe" className="block text-sm font-medium text-gray-700">{t('news_title_de')}</label>
                            <input id="titleDe" {...register("titleDe", { required: t('field_is_required') })} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                            {errors.titleDe && <p className="mt-1 text-sm text-red-600">{errors.titleDe.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="contentDe" className="block text-sm font-medium text-gray-700">{t('news_content_de')}</label>
                            <textarea id="contentDe" {...register("contentDe", { required: t('field_is_required') })} className="mt-1 w-full p-2 border border-gray-300 rounded-md" rows={5}></textarea>
                            {errors.contentDe && <p className="mt-1 text-sm text-red-600">{errors.contentDe.message}</p>}
                        </div>
                    </div>
                    <div className="hidden">
                        <input {...register("titleEn")} />
                        <textarea {...register("contentEn")} />
                        <input {...register("titleFr")} />
                        <textarea {...register("contentFr")} />
                        <input {...register("titleRu")} />
                        <textarea {...register("contentRu")} />
                        <input {...register("titleUk")} />
                        <textarea {...register("contentUk")} />
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                        <button type="submit" disabled={!isTranslated && !editingArticle} className="px-4 py-2 font-bold text-white bg-brand-blue rounded-md hover:bg-blue-600 disabled:bg-gray-400">
                            {editingArticle ? t('news_edit_button') : t('save_news')}
                        </button>
                        {editingArticle && (
                            <button type="button" onClick={clearForm} className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                                {t('cancel')}
                            </button>
                        )}
                    </div>
                </form>
                 {message && (
                    <div className={`mt-4 p-3 text-sm rounded-md ${isError ? 'text-red-800 bg-red-100' : 'text-green-800 bg-green-100'}`}>
                        {message}
                    </div>
                )}
            </div>
            
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">{t('existing_news')}</h2>
                <div className="space-y-4">
                    {newsList.length > 0 ? newsList.map(article => (
                        <div key={article.id} className="bg-white p-4 rounded-lg shadow-sm flex items-start gap-4">
                            <img src={article.imageUrl} alt={article.titleDe} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                            <div className="flex-grow">
                                <h3 className="font-bold">{article.titleDe}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{article.contentDe}</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date(article.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                                <button onClick={() => handleEdit(article)} className="px-3 py-1 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600">{t('news_edit_button')}</button>
                                <button onClick={() => handleDelete(article.id)} className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">{t('delete')}</button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500">{t('no_news_yet')}</p>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={currentPage === 0}
                            className="px-4 py-2 text-sm font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
                        >
                            {t('previous_page')}
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                            {t('page')} {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={currentPage + 1 >= totalPages}
                            className="px-4 py-2 text-sm font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
                        >
                            {t('next_page')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};