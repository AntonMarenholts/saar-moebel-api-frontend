import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { Category } from "../services/product.service";
import ProductService from "../services/product.service";
import { useForm, type SubmitHandler } from "react-hook-form";

type FormInputs = {
  name: string;
  slug: string;
};

// Компонент для управления одной категорией в списке
const CategoryListItem = ({
  category,
  onUpdate,
}: {
  category: Category;
  onUpdate: (updatedCategory: Category) => void; // <-- ИЗМЕНЕНИЕ: Теперь передаем обновленную категорию
}) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleFileChangeAndUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setIsUploading(true);
      setMessage("");
      setIsError(false);

      try {
        const uploadResponse = await ProductService.uploadImage(file);
        const imageUrl = uploadResponse.imageUrl;
        // Обновляем картинку на сервере
        const updatedCategory = await ProductService.updateCategoryImage(category.id, imageUrl);

        setMessage(t("category_image_update_success"));
        onUpdate(updatedCategory); // <-- ИЗМЕНЕНИЕ: Передаем обновленные данные родительскому компоненту

      } catch (error) {
        setMessage(t("category_image_update_error"));
        setIsError(true);
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  // Функция удаления остается без изменений
    const handleDelete = () => {
        if (window.confirm(`${t("confirm_delete_category")} "${category.name}"?`)) {
            ProductService.deleteCategory(category.id)
                .then(() => onUpdate(category)) // Передаем категорию для удаления из списка
                .catch(() => {
                    setMessage(t("category_delete_error"));
                    setIsError(true);
                });
        }
    };


  return (
    <li className="p-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-grow">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-20 h-20 rounded-md object-cover bg-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
              <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm16.5-1.5-3-3" />
              </svg>
            </div>
          )}
          {/* ++ ИЗМЕНЕНИЕ: Добавили отображение имени и slug ++ */}
          <div className="flex-grow">
            <p className="font-bold text-gray-800">{category.name}</p>
            <p className="text-sm text-gray-500">/{category.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <label className="cursor-pointer px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 text-center">
            {t("category_change_image")}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChangeAndUpload}
              disabled={isUploading}
            />
          </label>
           <button
                        onClick={handleDelete}
                        className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        {t("delete")}
                    </button>
        </div>
      </div>
      {isUploading && <p className="text-sm text-blue-600 mt-2">{t("product_image_uploading")}</p>}
      {message && (
        <div className={`mt-2 p-2 text-sm rounded-md ${isError ? "text-red-800 bg-red-100" : "text-green-800 bg-green-100"}`}>
          {message}
        </div>
      )}
    </li>
  );
};

export default function ManageCategoriesPage() {
    const { t } = useTranslation();
    const { register, handleSubmit, reset } = useForm<FormInputs>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const fetchCategories = () => {
        ProductService.getCategories()
            .then(setCategories)
            .catch(() => {
                setMessage(t("category_load_error"));
                setIsError(true);
            });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        setMessage("");
        setIsError(false);
        ProductService.createCategory(data.name, data.slug)
            .then((newCategory) => { // <-- ИЗМЕНЕНИЕ: Получаем новую категорию
                setMessage(t("category_create_success"));
                reset();
                setCategories(prev => [...prev, newCategory]); // <-- Добавляем в конец списка без перезагрузки
            })
            .catch(() => {
                setMessage(t("category_create_error"));
                setIsError(true);
            });
    };

    // ++ НОВАЯ ФУНКЦИЯ: Обработчик для обновления и удаления категорий в списке ++
    const handleCategoryUpdate = (updatedCategory: Category) => {
        setCategories(prevCategories => 
            prevCategories.map(cat => 
                cat.id === updatedCategory.id ? updatedCategory : cat
            )
        );
    };

    const handleCategoryDelete = (deletedCategory: Category) => {
        setCategories(prevCategories =>
            prevCategories.filter(cat => cat.id !== deletedCategory.id)
        );
    };


    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t("admin_manage_categories")}</h1>
                <Link to="/admin/dashboard" className="text-sm text-brand-blue hover:underline">
                    ← {t("back_to_dashboard")}
                </Link>
            </div>

            <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">{t("category_add_new")}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <input {...register("name", { required: true })} placeholder={t("category_name")} className="p-2 border border-gray-300 rounded-md" />
                    <input {...register("slug", { required: true })} placeholder={t("category_slug")} className="p-2 border border-gray-300 rounded-md" />
                    <button type="submit" className="px-4 py-2 font-bold text-white bg-brand-blue rounded-md hover:bg-blue-600">
                        {t("category_add_new")}
                    </button>
                </form>
                {message && (
                    <div className={`mt-4 p-2 text-sm rounded-md ${isError ? "text-red-800 bg-red-100" : "text-green-800 bg-green-100"}`}>
                        {message}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">{t("existing_categories")}</h2>
                <ul className="space-y-3">
                    {categories.map((cat) => (
                        <CategoryListItem
                            key={cat.id}
                            category={cat}
                            // -- ИЗМЕНЕНИЕ: Передаем новый обработчик --
                            onUpdate={(updatedCategory) => {
                                if (updatedCategory.id === cat.id) {
                                    handleCategoryUpdate(updatedCategory);
                                } else {
                                    handleCategoryDelete(cat);
                                }
                            }}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}