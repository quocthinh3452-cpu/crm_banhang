'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { TextInput } from '@/shared/components/form/TextInput';
import { SelectBox } from '@/shared/components/form/SelectBox';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatCurrency, formatDateTime } from '@/shared/utils/formatters';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { productApi } from '../../../modules/product/api/product.api';
import { productTypeApi } from '../../../modules/product/api/productType.api';
import { getProductsUseCase } from '../../../modules/product/useCases/getProductsUseCase';
import { Product, ProductFilters } from '../../../modules/product/types/product.type';
import { ProductTypeResponse } from '../../../modules/product/types/productType.type';

// 1. Schema
const productSchema = z.object({
    productCode: z.string().min(1, 'Mã sản phẩm không được để trống'),
    name: z.string().min(2, 'Tên sản phẩm phải có ít nhất 2 ký tự'),
    description: z.string().optional(),
    typeId: z.coerce.number().min(1, 'Vui lòng chọn loại sản phẩm'),
    price: z.coerce.number().min(0, 'Giá tiền không hợp lệ (phải >= 0)'),
    image: z.any().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [types, setTypes] = useState<ProductTypeResponse[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<ProductFilters>({
        page: 1,
        size: 5,
        keyword: '',
        typeId: undefined,
        sortField: 'createdAt',
        sortDir: 'desc'
    });

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
    resolver: zodResolver(productSchema),
});

    useEffect(() => {
        if (successMsg || errorMsg) {
            const timer = setTimeout(() => {
                setSuccessMsg(null);
                setErrorMsg(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMsg, errorMsg]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [productData, typesData] = await Promise.all([
                getProductsUseCase(filters),
                productTypeApi.getAll()
            ]);
            setProducts(productData.items || []);
            setTotalPages(productData.totalPages || 1);
            setCurrentPage(productData.currentPage || 1);
            setTypes(typesData || []);
        } catch (err) {
            console.error('Lỗi fetch data:', err);
            setErrorMsg("Không thể tải dữ liệu sản phẩm.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    const handleOpenAdd = () => {
        setEditingProduct(null);
        reset({
            productCode: '',
            name: '',
            description: '',
            price: 0,
            typeId: 0
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setEditingProduct(product);
        reset({
            productCode: product.productCode || '',
            name: product.name || '',
            description: product.description || '',
            price: product.price || 0,
            typeId: product.typeId || 0
        });
        setIsModalOpen(true);
    };

    const onSubmit = async (data: ProductFormValues) => {
        setIsSaving(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            const formData = new FormData();

            const requestData = {
                productCode: data.productCode,
                name: data.name,
                description: data.description || '',
                typeId: data.typeId,
                price: data.price,
            };

            // BỔ SUNG: Thêm 'data.json' làm tên file giả lập để Tomcat parse mượt mà hơn
            formData.append('data', new Blob([JSON.stringify(requestData)], { type: 'application/json' }), 'data.json');

            if (data.image && data.image.length > 0) {
                formData.append('file', data.image[0]);
            }

            if (editingProduct) {
                await productApi.updateProduct(editingProduct.id, formData);
                setSuccessMsg("Cập nhật sản phẩm thành công!");
            } else {
                await productApi.createProduct(formData);
                setSuccessMsg("Thêm sản phẩm mới thành công!");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error: any) {
            const backendError = error.response?.data;
            let msg = 'Có lỗi xảy ra khi lưu dữ liệu!';
            if (typeof backendError === 'string') {
                msg = backendError;
            } else if (backendError && typeof backendError.message === 'string') {
                msg = backendError.message;
            } else if (error.message) {
                msg = error.message;
            }

            // Hiển thị lỗi trực tiếp tại ô nhập liệu nếu trùng mã
            const lowerMsg = msg.toLowerCase();
            if (
                lowerMsg.includes("đã tồn tại") || 
                lowerMsg.includes("duplicate") || 
                lowerMsg.includes("already exists") || 
                lowerMsg.includes("trùng")
            ) {
                setError("productCode", {
                    type: "manual",
                    message: "Mã đã tồn tại vui lòng chọn mã khác"
                });
            } else {
                setErrorMsg(msg);
            }
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            setErrorMsg(null);
            setSuccessMsg(null);
            try {
                await productApi.deleteProduct(id);
                setSuccessMsg("Xóa sản phẩm thành công!");
                fetchData();
            } catch (error: any) {
                const backendError = error.response?.data;
                setErrorMsg(typeof backendError === 'string' ? backendError : 'Lỗi khi xóa sản phẩm.');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
                    <p className="text-sm text-gray-500">Quản lý kho hàng, phân loại và giá bán</p>
                </div>
                <Button onClick={handleOpenAdd}>
                    + Thêm sản phẩm
                </Button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Box */}
                <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm theo mã hoặc tên sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setFilters({ ...filters, keyword: searchTerm, page: 1 });
                            }
                        }}
                        className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 text-sm rounded-lg outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-gray-700 placeholder-gray-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilters({ ...filters, keyword: '', page: 1 });
                            }}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Sort and Category Filters */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                    <select
                        value={filters.typeId || ''}
                        onChange={(e) => setFilters({ ...filters, typeId: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-40 cursor-pointer transition-colors"
                    >
                        <option value="">Tất cả danh mục</option>
                        {types.map(t => (
                            <option key={t.id} value={t.id}>{t.typeName}</option>
                        ))}
                    </select>

                    {/* Sắp xếp theo Giá */}
                    <select
                        value={filters.sortField === 'price' ? filters.sortDir : ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                                setFilters({ ...filters, sortField: 'price', sortDir: val, page: 1 });
                            } else {
                                setFilters({ ...filters, sortField: 'createdAt', sortDir: 'desc', page: 1 });
                            }
                        }}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-36 cursor-pointer transition-colors"
                    >
                        <option value="">Sắp xếp: Giá</option>
                        <option value="asc">Giá: Thấp đến Cao</option>
                        <option value="desc">Giá: Cao đến Thấp</option>
                    </select>

                    {/* Sắp xếp theo Ngày tạo */}
                    <select
                        value={filters.sortField === 'createdAt' ? filters.sortDir : ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                                setFilters({ ...filters, sortField: 'createdAt', sortDir: val, page: 1 });
                            } else {
                                setFilters({ ...filters, sortField: 'createdAt', sortDir: 'desc', page: 1 });
                            }
                        }}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-40 cursor-pointer transition-colors"
                    >
                        <option value="">Sắp xếp: Ngày tạo</option>
                        <option value="desc">Ngày tạo: Mới nhất</option>
                        <option value="asc">Ngày tạo: Cũ nhất</option>
                    </select>

                    {/* Sắp xếp theo Ngày cập nhật */}
                    <select
                        value={filters.sortField === 'updatedAt' ? filters.sortDir : ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                                setFilters({ ...filters, sortField: 'updatedAt', sortDir: val, page: 1 });
                            } else {
                                setFilters({ ...filters, sortField: 'createdAt', sortDir: 'desc', page: 1 });
                            }
                        }}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-44 cursor-pointer transition-colors"
                    >
                        <option value="">Sắp xếp: Ngày cập nhật</option>
                        <option value="desc">Cập nhật: Mới nhất</option>
                        <option value="asc">Cập nhật: Cũ nhất</option>
                    </select>
                </div>
            </div>

            {successMsg && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-center transition-all duration-300">
                    <span className="font-medium">{successMsg}</span>
                </div>
            )}

            {errorMsg && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center transition-all duration-300">
                    <span className="font-medium">{errorMsg}</span>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Hình ảnh</th>
                                <th className="p-4 font-semibold text-gray-600">Mã SP</th>
                                <th className="p-4 font-semibold text-gray-600">Tên sản phẩm</th>
                                <th className="p-4 font-semibold text-gray-600">Mô tả</th>
                                <th className="p-4 font-semibold text-gray-600">Loại sản phẩm</th>
                                <th className="p-4 font-semibold text-gray-600">Giá bán</th>
                                <th className="p-4 font-semibold text-gray-600">Ngày tạo</th>
                                <th className="p-4 font-semibold text-gray-600">Ngày cập nhật</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="border-b">
                                        <td className="p-4"><Skeleton className="h-12 w-12 rounded" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                                        <td className="p-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                                        <td className="p-4"><Skeleton className="h-8 w-24 mx-auto" /></td>
                                    </tr>
                                ))
                            ) : products.length > 0 ? (
                                products.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            {item.imageUrl ? (
                                                <img
                                                    src={`http://localhost:8080${item.imageUrl}`}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded border border-gray-200 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-gray-400 text-xs">
                                                    Trống
                                                </div>
                                            )}
                                        </td>

                                        <td className="p-4 font-mono text-sm text-gray-600">{item.productCode}</td>
                                        <td className="p-4 font-medium text-gray-900">{item.name}</td>

                                        <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate">
                                            {item.description || <span className="text-gray-400 italic">Không có mô tả</span>}
                                        </td>

                                        <td className="p-4">
                                            <span className="px-3 py-1 text-xs bg-sky-50 text-sky-700 border border-sky-100 rounded-full font-medium">
                                                {item.typeName || 'Chưa phân loại'}
                                            </span>
                                        </td>

                                        <td className="p-4 text-emerald-600 font-semibold">
                                            {formatCurrency(item.price)}
                                        </td>

                                        <td className="p-4 text-sm text-gray-500">
                                            {item.createdAt ? formatDateTime(item.createdAt) : '---'}
                                        </td>

                                        <td className="p-4 text-sm text-gray-500">
                                            {item.updatedAt ? formatDateTime(item.updatedAt) : '---'}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <Button variant="outline" className="text-xs px-3 h-8" onClick={() => handleOpenEdit(item)}>Sửa</Button>
                                                <Button variant="outline" className="text-xs px-3 h-8 text-red-600 hover:bg-red-50 hover:border-red-200" onClick={() => handleDelete(item.id)}>Xóa</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="p-10 text-center text-gray-500">
                                        Không tìm thấy sản phẩm nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!isLoading && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(p) => setFilters({ ...filters, page: p })}
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                            label="Mã sản phẩm"
                            placeholder="VD: SP001"
                            {...register('productCode')}
                            error={errors.productCode?.message}
                        />

                        <TextInput
                            label="Tên sản phẩm"
                            placeholder="Nhập tên..."
                            {...register('name')}
                            error={errors.name?.message}
                        />

                        <SelectBox
                            label="Loại sản phẩm"
                            options={[
                                { label: '-- Chọn loại SP --', value: '' },
                                ...types
                                    .filter(t => t.isActive === 1 || t.id === editingProduct?.typeId)
                                    .map(t => ({ label: t.typeName, value: String(t.id) }))
                            ]}
                            {...register('typeId')}
                            error={errors.typeId?.message}
                        />

                        <TextInput
                            label="Giá bán (VND)"
                            type="number"
                            placeholder="0"
                            {...register('price')}
                            error={errors.price?.message}
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <TextInput
                            label="Mô tả"
                            placeholder="Mô tả ngắn gọn về sản phẩm..."
                            {...register('description')}
                            error={errors.description?.message}
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình ảnh sản phẩm (Tùy chọn)
                        </label>
                        <input
                            // BỔ SUNG: Ép React reset input file khi đóng mở form
                            key={isModalOpen ? 'open' : 'closed'}
                            type="file"
                            accept="image/*"
                            {...register('image')}
                            className="block w-full text-sm text-gray-500 
                                       file:mr-4 file:py-2 file:px-4 
                                       file:rounded-md file:border-0 
                                       file:text-sm file:font-semibold 
                                       file:bg-sky-100 file:text-sky-700 
                                       hover:file:bg-sky-200 cursor-pointer"
                        />
                        <p className="text-xs text-gray-400 mt-2">Định dạng hỗ trợ: JPG, PNG, GIF. Kích thước tối đa 5MB.</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Đang xử lý...' : (editingProduct ? 'Cập nhật' : 'Lưu sản phẩm')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}