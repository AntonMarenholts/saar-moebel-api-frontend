import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import AdminService, { type NewsArticle, type NewsArticleData } from '../services/admin.service';
import ProductService from '../services/product.service'; // Используем для загрузки картинок

type FormInputs = {
    titleDe: string;
    contentDe: string;
};

export default function ManageNewsPage() {
    const { t } = useTranslation();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormInputs>();

    const [newsList, setNewsList] = useState<NewsArticle[]>([]);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Состояния для загрузки файла
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    const fetchNews = useCallback(() => {
        AdminService.getNews()
            .then(data => setNewsList(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
            .catch(() => {
                setMessage('Ошибка при загрузке новостей');
                setIsError(true);
            });
    }, []);

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
            setMessage("Изображение успешно загружено!");
            setIsError(false);
        } catch {
            setMessage("Ошибка при загрузке изображения.");
            setIsError(true);
        } finally {
            setIsUploading(false);
        }
    };

    const handleEdit = (article: NewsArticle) => {
        setEditingArticle(article);
        setValue('titleDe', article.titleDe);
        setValue('contentDe', article.contentDe);
        setUploadedImageUrl(article.imageUrl);
        setPreview(article.imageUrl);
        window.scrollTo(0, 0);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Вы уверены, что хотите удалить эту новость?")) {
            AdminService.deleteNews(id)
                .then(() => {
                    setMessage("Новость успешно удалена.");
                    setIsError(false);
                    fetchNews();
                })
                .catch(() => {
                    setMessage("Ошибка при удалении новости.");
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
    };

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        if (!uploadedImageUrl) {
            setMessage("Пожалуйста, сначала загрузите изображение.");
            setIsError(true);
            return;
        }

        const newsData: NewsArticleData = { ...data, imageUrl: uploadedImageUrl };

        try {
            if (editingArticle) {
                await AdminService.updateNews(editingArticle.id, newsData);
                setMessage("Новость успешно обновлена!");
            } else {
                await AdminService.createNews(newsData);
                setMessage("Новость успешно создана!");
            }
            setIsError(false);
            clearForm();
            fetchNews();
        } catch {
            setMessage(editingArticle ? "Ошибка при обновлении новости." : "Ошибка при создании новости.");
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
                    {editingArticle ? 'Редактирование новости' : t('add_news_article')}
                </h2>
                
                {/* Image Uploader */}
                 <div className="space-y-2 mb-6">
                    <label className="block text-sm font-medium text-gray-700">{t('product_image_upload')}</label>
                    <div className="flex items-center gap-4">
                        <div className="w-32 h-32 border border-dashed rounded-md flex items-center justify-center bg-gray-50">
                            {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover rounded-md"/> : <span className="text-xs text-gray-500">Предпросмотр</span>}
                        </div>
                        <div className="flex-grow">
                            <input type="file" onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100"/>
                            <button type="button" onClick={handleImageUpload} disabled={!selectedFile || isUploading} className="mt-2 px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                                {isUploading ? t('product_image_uploading') : "Загрузить"}
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="titleDe" className="block text-sm font-medium text-gray-700">{t('news_title_de')}</label>
                        <input id="titleDe" {...register("titleDe", { required: "Заголовок обязателен" })} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        {errors.titleDe && <p className="text-sm text-red-500 mt-1">{errors.titleDe.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="contentDe" className="block text-sm font-medium text-gray-700">{t('news_content_de')}</label>
                        <textarea id="contentDe" {...register("contentDe", { required: "Содержимое обязательно" })} className="mt-1 w-full p-2 border border-gray-300 rounded-md" rows={5}></textarea>
                        {errors.contentDe && <p className="text-sm text-red-500 mt-1">{errors.contentDe.message}</p>}
                    </div>

                    <div className="flex items-center gap-4">
                        <button type="submit" className="px-4 py-2 font-bold text-white bg-brand-blue rounded-md hover:bg-blue-600">
                            {editingArticle ? 'Обновить новость' : t('save_news')}
                        </button>
                        {editingArticle && (
                            <button type="button" onClick={clearForm} className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                                Отмена
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
                                <button onClick={() => handleEdit(article)} className="px-3 py-1 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600">Редактировать</button>
                                <button onClick={() => handleDelete(article.id)} className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">Удалить</button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500">{t('no_news_yet')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};