// app/crm/product-types/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { productTypeApi } from '@/modules/product/api/productType.api';
import { ProductTypeResponse } from '@/modules/product/types/productType.type';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { TextInput } from '@/shared/components/form/TextInput';
import { SelectBox } from '@/shared/components/form/SelectBox';
import { Skeleton } from '@/shared/components/ui/Skeleton';

export default function ProductTypesPage() {
    const [productTypes, setProductTypes] = useState<ProductTypeResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Thông báo lỗi/thành công toàn cục
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Bộ lọc & Tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // State cho Modal Thêm mới
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');

    // State cho Modal Chỉnh sửa
    const [editingType, setEditingType] = useState<ProductTypeResponse | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTypeName, setEditTypeName] = useState('');
    const [editIsActive, setEditIsActive] = useState<number>(1);

    // Load danh sách danh mục khi vào trang
    useEffect(() => {
        fetchProductTypes();
    }, []);

    // Tự động tắt thông báo lỗi/thành công sau 3 giây
    useEffect(() => {
        if (successMsg || errorMsg) {
            const timer = setTimeout(() => {
                setSuccessMsg(null);
                setErrorMsg(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMsg, errorMsg]);

    const fetchProductTypes = async () => {
        setIsLoading(true);
        try {
            const data = await productTypeApi.getAll();
            setProductTypes(data || []);
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
            setErrorMsg("Không thể tải danh sách loại sản phẩm.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setNewTypeName('');
        setErrorMsg(null);
        setSuccessMsg(null);
        setIsAddModalOpen(true);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTypeName.trim()) return;

        setIsSaving(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            await productTypeApi.create({
                typeName: newTypeName.trim(),
                isActive: 1
            });
            setSuccessMsg("Thêm loại sản phẩm mới thành công!");
            setIsAddModalOpen(false);
            fetchProductTypes(); // Tải lại danh sách
        } catch (error: any) {
            const errorResponse = error.response?.data;
            setErrorMsg(typeof errorResponse === 'string' ? errorResponse : "Đã xảy ra lỗi khi thêm mới.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenEdit = (type: ProductTypeResponse) => {
        setEditingType(type);
        setEditTypeName(type.typeName);
        setEditIsActive(type.isActive);
        setErrorMsg(null);
        setSuccessMsg(null);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingType || !editTypeName.trim()) return;

        setIsSaving(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            await productTypeApi.update(editingType.id, {
                typeName: editTypeName.trim(),
                isActive: editIsActive
            });
            setSuccessMsg("Cập nhật loại sản phẩm thành công!");
            setIsEditModalOpen(false);
            setEditingType(null);
            fetchProductTypes(); // Tải lại danh sách
        } catch (error: any) {
            const errorResponse = error.response?.data;
            setErrorMsg(typeof errorResponse === 'string' ? errorResponse : "Đã xảy ra lỗi khi cập nhật.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            await productTypeApi.delete(id);
            setSuccessMsg("Xóa danh mục thành công!");
            fetchProductTypes(); // Tải lại danh sách
        } catch (error: any) {
            const errorResponse = error.response?.data;
            setErrorMsg(typeof errorResponse === 'string' ? errorResponse : "Không thể xóa danh mục này.");
        }
    };

    // Thực hiện lọc danh sách loại sản phẩm ở Client-side cực nhanh và mượt mà
    const filteredTypes = productTypes.filter(type => {
        const matchesSearch = 
            type.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(type.id).includes(searchTerm);
        
        const matchesStatus = 
            statusFilter === '' || 
            String(type.isActive) === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header Area giống y hệt trang Sản phẩm */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Loại Sản Phẩm</h1>
                    <p className="text-sm text-gray-500">Cấu hình danh mục loại sản phẩm và trạng thái hoạt động</p>
                </div>
                <Button onClick={handleOpenAdd}>
                    + Thêm loại sản phẩm
                </Button>
            </div>

            {/* Banner hiển thị thông báo thành công / lỗi */}
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

            {/* Filter & Search Bar giống y hệt trang Sản phẩm */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Ô tìm kiếm nhanh */}
                <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc ID loại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 text-sm rounded-lg outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-gray-700 placeholder-gray-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Bộ lọc Trạng thái */}
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto justify-end">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-48 cursor-pointer transition-colors"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Ngừng hoạt động</option>
                    </select>
                </div>
            </div>

            {/* Bảng danh sách - giống y hệt cấu trúc card, table của trang Sản phẩm */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600 w-24">ID</th>
                                <th className="p-4 font-semibold text-gray-600">Tên loại sản phẩm</th>
                                <th className="p-4 font-semibold text-gray-600 w-48">Trạng thái</th>
                                <th className="p-4 font-semibold text-gray-600 text-center w-48">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                // Skeleton loader đồng bộ
                                [1, 2, 3].map((i) => (
                                    <tr key={i} className="border-b">
                                        <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                                        <td className="p-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                                        <td className="p-4"><Skeleton className="h-8 w-24 mx-auto" /></td>
                                    </tr>
                                ))
                            ) : filteredTypes.length > 0 ? (
                                filteredTypes.map((type) => (
                                    <tr key={type.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono text-sm text-gray-500">#{type.id}</td>
                                        <td className="p-4 font-medium text-gray-900">{type.typeName}</td>
                                        <td className="p-4">
                                            {type.isActive === 1 ? (
                                                <span className="px-3 py-1 text-xs bg-green-50 text-green-700 border border-green-100 rounded-full font-medium">
                                                    Hoạt động
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 text-xs bg-red-50 text-red-700 border border-red-100 rounded-full font-medium">
                                                    Ngừng hoạt động
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    className="text-xs px-3 h-8" 
                                                    onClick={() => handleOpenEdit(type)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    className="text-xs px-3 h-8 text-red-600 hover:bg-red-50 hover:border-red-200" 
                                                    onClick={() => handleDelete(type.id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-gray-500">
                                        Không tìm thấy loại sản phẩm nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Thêm mới danh mục sản phẩm */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Thêm loại sản phẩm mới"
            >
                <form onSubmit={handleCreate} className="space-y-4 mt-2">
                    <TextInput
                        label="Tên loại sản phẩm"
                        placeholder="Nhập tên danh mục..."
                        value={newTypeName}
                        onChange={(e) => setNewTypeName(e.target.value)}
                        required
                    />

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" disabled={isSaving || !newTypeName.trim()}>
                            {isSaving ? 'Đang xử lý...' : 'Lưu danh mục'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Chỉnh sửa danh mục sản phẩm */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Chỉnh sửa loại sản phẩm"
            >
                <form onSubmit={handleUpdate} className="space-y-4 mt-2">
                    <TextInput
                        label="Tên loại sản phẩm"
                        placeholder="Nhập tên danh mục..."
                        value={editTypeName}
                        onChange={(e) => setEditTypeName(e.target.value)}
                        required
                    />

                    <SelectBox
                        label="Trạng thái hoạt động"
                        value={String(editIsActive)}
                        onChange={(e) => setEditIsActive(Number(e.target.value))}
                        options={[
                            { label: 'Hoạt động', value: '1' },
                            { label: 'Ngừng hoạt động', value: '0' }
                        ]}
                    />

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" disabled={isSaving || !editTypeName.trim()}>
                            {isSaving ? 'Đang xử lý...' : 'Cập nhật'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}